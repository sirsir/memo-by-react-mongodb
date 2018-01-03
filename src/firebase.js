import firebase from 'firebase'
const config = {
    apiKey: 'AIzaSyA67oGlldc0pMP-qvuBqm3vQRYLxssUZb8',
    authDomain: 'sir-memo.firebaseapp.com',
    databaseURL: 'https://sir-memo.firebaseio.com',
    projectId: 'sir-memo',
    storageBucket: 'sir-memo.appspot.com',
    messagingSenderId: '255297077153'
  };
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
// export const providerFace = new firebase.auth.FacebookAuthProvider();
export const auth = firebase.auth();
export default firebase;
