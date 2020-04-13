const functions = require('firebase-functions');
const admin = require('firebase-admin');
const secure = require('./util').secure;

exports.addInitialAdmin = functions.auth.user().onCreate(user => {
    if (user.email === 'matthew.gill@live.co.uk') {
        return grantAdminRole(user.email);
    }
    return {
        error: "Could not promote the user to an admin"
    }
});

exports.addAdmin = functions.https.onCall(secure((data, context) => {
    const email = data.email;
    return grantAdminRole(email);
}));

async function grantAdminRole(email) {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && user.customClaims.admin === true) {
        return;
    }
    console.log(`Setting ${email} to admin`);
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
    }).then(() => ({
        result: `${email} is now an admin`
    }));
}