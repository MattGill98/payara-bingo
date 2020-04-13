const functions = require('firebase-functions');
const admin = require('firebase-admin');
const secure = require('./util').secure;

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

async function draftWordsForNextGame() {
    let buzzwords = database.ref('buzzwords');
    buzzwords.once('value', data => {
        data.forEach(dataItem => {
            let val = dataItem.val();
            if (val.selected !== val.active) {
                dataItem.ref.update({ active: val.selected });
            }
        });
    });
}

async function selectWordsForEachPlayer() {
    let users = await admin.auth().listUsers().then(result => result.users);
    return users
        .filter(user => user.customClaims && user.customClaims.admin)
        .forEach(user => {
            database.ref('game/' + user.uid).update({grid: []});
        });
}