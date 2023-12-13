
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIurVJJ-V9ew7hIBUath0DXtFcORMhTUQ",
  authDomain: "foodimage-a28d7.firebaseapp.com",
  projectId: "foodimage-a28d7",
  storageBucket: "foodimage-a28d7.appspot.com",
  messagingSenderId: "314024727746",
  appId: "1:314024727746:web:a8ddb99eb2f687eedf175b"
};

const app = initializeApp(firebaseConfig);
export const imageDb=getStorage(app);