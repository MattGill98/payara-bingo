import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

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
firebase.initialise = () => firebase.initializeApp(firebaseConfig);

export default firebase;