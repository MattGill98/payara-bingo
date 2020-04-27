const functions = require('firebase-functions');
const admin = require('firebase-admin');
const secure = require('./util').secure;

const auth = admin.auth();
const database = admin.database();

const gridSize = 9;

let games = () => database.ref('games');
let currentGame = () => games().child('current');
let previousGame = () => games().child('previous');

let buzzwords = () => database.ref('buzzwords').once('value').then(value => 
    Object.values(value.val())
            .filter(obj => obj.selected)
            .map(obj => obj.text));

exports.startGame = functions.https.onCall(secure(async (data, context) => {
    let validWords = await buzzwords();

    console.log('Valid words');
    console.log(validWords);

    if (validWords.length < gridSize) {
        throw new Error('Not enough valid buzzwords');
    }

    let wordObjects = randomise(validWords.map(word => ({
        text: word
    })));

    let possibleGrids = randomise(combinations(wordObjects, gridSize));

    console.log('Possible grids');
    console.log(possibleGrids);

    let eligibleUserIds = await auth.listUsers()
        .then(result => result.users
                .filter(user => !user.customClaims || !user.customClaims.admin)
                .map(user => user.uid));

    console.log('Eligible users');
    console.log(eligibleUserIds);

    if (possibleGrids.length < eligibleUserIds.length) {
        throw new Error(`Not enough possible combinations. Users: ${eligibleUserIds.length}. Combinations: ${possibleGrids.length}`)
    }

    let newGame = {
        words: wordObjects,
        players: eligibleUserIds.reduce((acc, uid) => {
            acc[uid] = possibleGrids.pop();
            return acc;
        }, {})
    };

    let gameId = games().push(newGame).key;

    console.log(`New game ID: ${gameId}`);
    console.log(JSON.stringify(newGame, null, 2));

    currentGame().set(gameId);
}));
exports.endGame = functions.https.onCall(secure((data, context) => {
    return endGame();
}));

exports.submitGrid = functions.https.onCall(async (data, context) => {
    let grid = await database.ref(`game/${context.auth.uid}`).once('value');

    if (!grid) {
        throw new Error('No grid found for the user');
    }

    let keys = grid.val().map(item => item.key);

    console.log(grid.val());

    let correctCount = (await Promise.all(
                keys.map(key => database.ref(`buzzwords/${key}`)
                        .once('value')
                        .then(buzzword => Boolean(buzzword.val().verified))))
            ).filter(val => val).length;

    if (correctCount < gridSize) {
        console.error(`User ${context.auth.uid} submitted a grid with only ${correctCount} correct words`);
        throw new Error('The submitted grid was incorrect');
    }

    return endGame();
});
exports.collectResults = functions.database.ref('games/{gameId}/players/{playerId}').onUpdate((snapshot, context) => {
    let result = snapshot.after.val();
    let gameId = context.params.gameId;
    let playerId = context.params.playerId;
    return database.ref(`games/${gameId}/results/${playerId}`)
        .set(result.filter(word => word.selected).length);
});

async function endGame() {
    let gameId = await currentGame().once('value');
    return previousGame().set(gameId.val())
        .then(() => currentGame().set(null))
}

function randomise(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function combinations(arr, size) {
    if (size > arr.length) {
        throw new Error(`Subset cannot be larger than the original set. Subset size: ${size}. Set size: ${arr.length}`);
    }
    if (size == arr.length) {
        return [ arr ];
    }
    let results = [];
    let len = arr.length;
    for (let i = 0; i < (1 << len); i++) {
        let result = [];
        for (let j = 0; j < len; j++) {
            if (i & (1 << j)) {
                result.push(arr[j]);
            }
        }
        if (result.length == size) {
            results.push(result);
        }
    }
    return results;
}