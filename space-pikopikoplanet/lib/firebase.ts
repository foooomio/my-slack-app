import firebase from 'firebase/app';
import 'firebase/firestore';

require('dotenv').config();

const firebaseConfig = {
  projectId: process.env.SPACE_PIKOPIKOPLANET_FIREBASE_PROJECT_ID,
};

export const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
