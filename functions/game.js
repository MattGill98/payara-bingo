const functions = require('firebase-functions');
const admin = require('firebase-admin');
const secure = require('./util').secure;

const auth = admin.auth();
const database = admin.database();

exports.startGame = functions.https.onCall(secure(async (data, context) => {
    let lists = await draftWordsForNextGame()
        .then(buzzwords)
        .then(words => combinations(words, 9))
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
        database.ref(`game/${user.uid}`).update({
            grid: lists.shift()
        });
    });

    return database
        .ref('game/global')
        .update({ started: true });
}));
exports.endGame = functions.https.onCall(secure((data, context) => {
    return database
        .ref('game/global')
        .update({ started: false });
}));

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
            if (val.selected !== val.active) {
                dataItem.ref.update({ active: val.selected });
            }
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
                    words.push(val.text);
                }
            });
            return words;
        });
}