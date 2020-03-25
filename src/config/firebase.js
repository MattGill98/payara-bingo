import { readable } from 'svelte/store';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyD4grqXtT-gZP4LSGhojNbX9NTGJeiyaAc",
    authDomain: "payara-bingo.firebaseapp.com",
    databaseURL: "https://payara-bingo.firebaseio.com",
    projectId: "payara-bingo",
    storageBucket: "payara-bingo.appspot.com",
    messagingSenderId: "29169615939",
    appId: "1:29169615939:web:3f39900c4844781f6680f6",
    measurementId: "G-WDS21562M8"
};
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export const authenticated = readable(undefined, function start(set) {
	return auth.onAuthStateChanged(user => set(Boolean(user)));
});

let db = firebase.database();
let remoteBuzzwords = db.ref('buzzwords');
export const buzzwords = readable([], function start(set) {
    let local = [];
    return remoteBuzzwords.on('child_added', function(data) {
        if (data) {
            local.push(data.val());
            set(local);
        }
    });
});

export function addBuzzword(buzzword) {
    remoteBuzzwords.push(buzzword);
}

export default firebase;