const functions = require('firebase-functions');
const admin = require('firebase-admin');
const secure = require('./util').secure;

exports.startGame = functions.https.onCall(secure((data, context) => {
    draftWordsForNextGame();
    selectWordsForEachPlayer();
    return admin.database()
        .ref('game')
        .update({ started: true });
}));
exports.endGame = functions.https.onCall(secure((data, context) => {
    return admin.database()
        .ref('game')
        .update({ started: false });
}));

async function draftWordsForNextGame() {
    let buzzwords = admin.database().ref('buzzwords');
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
    let database = admin.database();
    return users
        .filter(user => user.customClaims && user.customClaims.admin)
        .forEach(user => {
            database.ref('game/' + user.uid).update({grid: []});
        });
}