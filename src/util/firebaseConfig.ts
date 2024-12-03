import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCanGYDghcHsf48lyWGDlFZ8opRW3s3LoE",
  authDomain: "habits-auth.firebaseapp.com",
  projectId: "habits-auth",
  storageBucket: "habits-auth.firebasestorage.app",
  messagingSenderId: "335096964147",
  appId: "1:335096964147:web:ac6ac5a2da87e990e3af46",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
