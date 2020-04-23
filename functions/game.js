const functions = require('firebase-functions');
const admin = require('firebase-admin');
const secure = require('./util').secure;

const auth = admin.auth();
const database = admin.database();

const gridSize = 9;

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

exports.startGame = functions.https.onCall(secure(async (data, context) => {
    let lists = await draftWordsForNextGame()
        .then(buzzwords)
        .then(words => combinations(words, gridSize))
        .then(combinations => randomise(combinations.map(randomise)));

    console.log('Active buzzword combinations');
    console.log(lists)

    let qualifiedUsers = await auth.listUsers()
        .then(result => result.users.filter(user => !user.customClaims || !user.customClaims.admin));

    console.log('Qualifying users');
    console.log(qualifiedUsers);

    if (qualifiedUsers.length > lists.size) {
        throw new Error('There are not enough combinations of buzzwords to begin the game');
    }

    qualifiedUsers.forEach(user => {
        database.ref(`game/${user.uid}`).set(lists.shift());
    });

    return database
        .ref('game/global')
        .update({ started: true });
}));
exports.endGame = functions.https.onCall(secure((data, context) => {
    return endGame();
}));

function endGame() {
    return database
        .ref('game/global')
        .update({ started: false });
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

async function draftWordsForNextGame() {
    database.ref('buzzwords').once('value', data => {
        data.forEach(dataItem => {
            let val = dataItem.val();
            let active = val.active;
            if (val.selected !== val.active) {
                active = val.selected;
            }
            dataItem.ref.update({ active, verified: false });
        });
    });
}

async function buzzwords() {
    return await database.ref('buzzwords')
        .once('value')
        .then(data => {
            let words = [];
            data.forEach(dataItem => {
                let val = dataItem.val();
                if (val.active) {
                    words.push({
                        key: dataItem.key,
                        text: val.text
                    });
                }
            });
            return words;
        });
}