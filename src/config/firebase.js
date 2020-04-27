import { readable, derived } from 'svelte/store';

///////////////////////////////////////// Initialise Firebase

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

///////////////////////////////////////// Authentication details

const auth = firebase.auth();

export const authStatus = readable(undefined, set => {
    let data = {};
    auth.onIdTokenChanged(user => {
        data.authenticated = Boolean(user);
        data.username = user? user.displayName : undefined;
        data.uid = user? user.uid : undefined;
        data.profileConfigured = user && user.displayName;
        data.isAdmin = false;
        if (user) {
            user.getIdTokenResult().then(token => {
                data.isAdmin = token.claims && token.claims.admin;
            });
        }
        set(data);
    });
});

///////////////////////////////////////// Buzzword details

let db = firebase.database();

let remoteBuzzwords = db.ref('buzzwords');
export const buzzwords = readable([], set => remoteBuzzwords.on('value', buzzwordsResult => {
    if (!buzzwordsResult) return set([]);
    let buzzwordsVal = buzzwordsResult.val();
    if (!buzzwordsVal) return set([]);

    set(Object.keys(buzzwordsVal).map(buzzwordKey => {
        let ref = () => buzzwordsResult.child(buzzwordKey).ref;
        let buzzword = buzzwordsVal[buzzwordKey];
        return {
            key: buzzwordKey,
            ...buzzword,
            select: () => ref().update({ selected: !Boolean(buzzword.selected) }),
            remove: () => ref().remove()
        };
    }));
}));
export const selectedBuzzwords = derived(buzzwords, list => list.filter(item => item.selected));

export function addBuzzword(buzzword) {
    remoteBuzzwords.push({
        text: buzzword
    });
}

///////////////////////////////////////// Game details

let functions = firebase.functions();

export const submitGrid = functions.httpsCallable('submitGrid');
export const startGame = functions.httpsCallable('startGame');
export const endGame = functions.httpsCallable('endGame');

let currentGameRef = db.ref('games/current');
export const currentGameId = readable(undefined, set => {
    currentGameRef.on('value', data => {
        if (!data) return set(undefined);
        let gameId = data.val();
        if (!gameId) return set(undefined);

        set(gameId);
    });
});
export const currentGameResults = derived(currentGameId, (gameId, set) => {
    if (!gameId) return undefined;

    db.ref(`games/${gameId}/results`)
        .on('value', data => set(data.val()));
});
export const myGrid = derived([authStatus, currentGameId], ([auth, currentGame], set) => {
    if (!auth || !auth.uid || !currentGame) return undefined;

    let gridRef = db.ref(`games/${currentGame}/players/${auth.uid}`);

    gridRef.on('value', data => {
        let grid = data.val().map(dataItem => {
            let gridItem = dataItem;
            gridItem.select = () => { gridItem.selected = !gridItem.selected; gridRef.set(JSON.parse(JSON.stringify(grid))); };
            return gridItem;
        });
        set(grid);
    });
});

export default firebase;