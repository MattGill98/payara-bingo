import { readable, derived } from 'svelte/store';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

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

export const authPromise = readable(new Promise(() => {}), function start(set) {
	return auth.onAuthStateChanged(user => set(Promise.resolve(Boolean(user))));
});

export const username = readable(undefined, function start(set) {
	return auth.onIdTokenChanged(user => {
        if (!user) {
            return set(null);
        }
        set(user.displayName);
    });
});

export const profileConfigured = readable(undefined, function start(set) {
	return auth.onIdTokenChanged(user => {
        set(Boolean(user && user.displayName));
    });
});

export const isAdmin = readable(undefined, function start(set) {
	return auth.onIdTokenChanged(user => {
        if (user) {
            user.getIdTokenResult().then(token => {
                set(token.claims && token.claims.admin);
            });
        } else {
            set(false);
        }
    });
});

let functions = firebase.functions();

let db = firebase.database();

let remoteBuzzwords = db.ref('buzzwords');
export const buzzwords = readable([], function start(set) {
    let local = [];
    remoteBuzzwords.on('child_added', function(data) {
        if (data) {
            let child = () => remoteBuzzwords.child(data.key);
            local.push({
                key: data.key,
                val: data.val(),
                remove: () => child().remove(),
                select: () => child().update({ selected: true }),
                deselect: () => child().update({ selected: false })
            });
            set(local);
        }
    });
    remoteBuzzwords.on('child_changed', function(data) {
        if (data) {
            local = local.map(item => {
                if (item.key == data.key) {
                    return { ...item, val: data.val() };
                }
                return item;
            });
            set(local);
        }
    });
    remoteBuzzwords.on('child_removed', function(data) {
        if (data) {
            local = local.filter(item => item.key != data.key);
            set(local);
        }
    });
});
export const selectedBuzzwords = derived(buzzwords, list => list.filter(item => item.val.selected));
export const activeBuzzwords = derived(buzzwords, list => list.filter(item => item.val.active));

export function addBuzzword(buzzword) {
    remoteBuzzwords.push({
        text: buzzword
    });
}

let remoteGameData = db.ref('game');
export const game = readable({}, function start(set) {
    remoteGameData.on('value', data => {
        set({
            ...data.val(),
            start: functions.httpsCallable('startGame'),
            end: functions.httpsCallable('endGame')
        });
    });
});

export default firebase;