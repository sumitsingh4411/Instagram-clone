import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyBprZwfEZV7_lCYhfcHzej-9Qn9HzPN37Q",
    authDomain: "instagram-10b88.firebaseapp.com",
    projectId: "instagram-10b88",
    storageBucket: "instagram-10b88.appspot.com",
    messagingSenderId: "933390593843",
    appId: "1:933390593843:web:cc45289366a9c02ef49846"
  };;
  const fire=firebase.initializeApp(firebaseConfig);
  const db=fire.firestore();
  const auth=fire.auth();
  const provider=new firebase.auth.GoogleAuthProvider();
  const storage=firebase.storage();
  export {auth,provider,storage};
  export default db;
