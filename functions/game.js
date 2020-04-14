const functions = require('firebase-functions');
const admin = require('firebase-admin');
const secure = require('./util').secure;

const auth = admin.auth();
const database = admin.database();

exports.startGame = functions.https.onCall(secure((data, context) => {
    draftWordsForNextGame();
    selectWordsForEachPlayer();
    return database
        .ref('game')
        .update({ started: true });
}));
exports.endGame = functions.https.onCall(secure((data, context) => {
    return database
        .ref('game')
        .update({ started: false });
}));
exports.getCombinations = functions.https.onCall((data, context) => {
    return buzzwords()
        .then(words => combinations(words, 9))
        .then(combinations => randomise(combinations.map(randomise)));
});

async function draftWordsForNextGame() {
    database.ref('buzzwords').once('value', data => {
        data.forEach(dataItem => {
            let val = dataItem.val();
            if (val.selected !== val.active) {
                dataItem.ref.update({ active: val.selected });
            }
        });
    });
}

async function selectWordsForEachPlayer() {
    let users = await auth.listUsers().then(result => result.users);
    return users
        .filter(user => user.customClaims && user.customClaims.admin)
        .forEach(user => {
            database.ref('game/' + user.uid).update({ grid: [] });
        });
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
        throw new Error('Subset cannot be larger than the original set');
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

async function buzzwords() {
    return await database.ref('buzzwords')
        .once('value')
        .then(data => {
            let words = [];
            data.forEach(dataItem => {
                words.push(dataItem.val().text);
            });
            return words;
        });
}