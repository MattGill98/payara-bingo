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
    }).reverse());
}));
export const selectedBuzzwords = derived(buzzwords, list => list.filter(item => item.selected));

export function addBuzzword(buzzword) {
    if (buzzword) {
        remoteBuzzwords.push({
            text: buzzword,
            author: `${auth.currentUser.email} <${auth.currentUser.displayName}>`
        });
    }
}

///////////////////////////////////////// Game details

let functions = firebase.functions();

export const submitGrid = functions.httpsCallable('submitGrid');
export const startGame = functions.httpsCallable('startGame');
export const endGame = functions.httpsCallable('endGame');

let refToStore = ref => readable(undefined, set => {
    ref.on('value', data => {
        if (!data) return set(undefined);
        let gameId = data.val();

        set(gameId);
    });
});
let deriveFromIdStore = (idStore, propertyName, arrayFunction) => derived(idStore, (gameId, set) => {
    if (!gameId) return set(undefined);

    db.ref(`games/${gameId}/${propertyName}`)
        .on('value', data => {
            let val = data.val();
            if (!val) return {};
            if (arrayFunction) val = arrayFunction(val, data.ref);
            set(val);
        });
});
let deriveResultsFromStore = idStore => deriveFromIdStore(idStore, 'results',
    arr => {
        Object.keys(arr).forEach(uid => {
            if (arr[uid].score === undefined) delete arr[uid];
        });
        return arr;
    });
export const currentGameId = refToStore(db.ref('games/current'));
export const previousGameId = refToStore(db.ref('games/previous'));
export const currentGameResults = deriveResultsFromStore(currentGameId);
export const previousGameResults = deriveResultsFromStore(previousGameId);
export const currentGameBuzzwords = deriveFromIdStore(currentGameId, 'words',
    (arr, ref) => arr.map(obj => {
        let result = obj;
        result.verify = () => { result.verified = !result.verified; ref.set(JSON.parse(JSON.stringify(arr))); };
        return result;
    })
);

let gridRef;
export const myGrid = derived([authStatus, currentGameId], ([auth, currentGame], set) => {
    if (!auth || !auth.uid || !currentGame) return set(undefined);

    let dataHandler = data => {
        let val = data.val();
        let grid;
        if (val) {
            grid = data.val().map(dataItem => {
                let gridItem = dataItem;
                gridItem.select = () => { gridItem.selected = !gridItem.selected; gridRef.set(JSON.parse(JSON.stringify(grid))); };
                return gridItem;
            });
        }
        set(grid);
    };

    if (gridRef) gridRef.off('value', dataHandler);
    gridRef = db.ref(`games/${currentGame}/players/${auth.uid}`);
    gridRef.on('value', dataHandler);
});

export default firebase;