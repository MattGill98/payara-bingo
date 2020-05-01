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
    let validWords = await buzzwords().then(randomise);

    console.log('Valid words');
    console.log(validWords);

    if (validWords.length < gridSize) {
        throw new Error('Not enough valid buzzwords');
    }

    let wordObjects = validWords.map(word => ({
        text: word
    }));

    let possibleGrids = await combinations(wordObjects, gridSize).then(randomise);

    console.log('Possible grids');
    console.log(possibleGrids);

    let users = (await auth.listUsers()).users;
    // Get all users except admins
    let eligibleUsers = users.filter(user => !user.customClaims || !user.customClaims.admin);

    console.log('Eligible users');
    console.log(eligibleUsers.map(user => ({ name: user.displayName, uid: user.uid })));

    if (possibleGrids.length < eligibleUsers.length) {
        throw new Error(`Not enough possible combinations. Users: ${eligibleUsers.length}. Combinations: ${possibleGrids.length}`)
    }

    let userIdMap = func => eligibleUsers.reduce((acc, user) => {
        acc[user.uid] = func(user);
        return acc;
    }, {});

    let newGame = {
        words: wordObjects,
        players: userIdMap(() => possibleGrids.pop()),
        results: userIdMap(user => ({ name: user.displayName }))
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
    let uid = context.auth.uid;
    let grid = await database.ref(`game/${uid}`).once('value');

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
        console.error(`User ${uid} submitted a grid with only ${correctCount} correct words`);
        throw new Error('The submitted grid was incorrect');
    }

    console.log(`User ${uid} has won the game`);
    return endGame();
});
exports.collectResults = functions.database.ref('games/{gameId}/players/{playerId}').onUpdate(async (snapshot, context) => {
    let gameId = context.params.gameId;
    let playerId = context.params.playerId;

    let realResult = (await snapshot.after.ref.once('value')).val();

    return await database.ref(`games/${gameId}/results/${playerId}`)
            .update({ score: realResult.filter(word => word.selected).length })
            .then(() => 'Results updated');
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

async function combinations(arr, size) {
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