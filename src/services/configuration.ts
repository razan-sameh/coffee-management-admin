// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase config here
const firebaseConfig = {
    apiKey: "AIzaSyDkzK1uQqZJj2agmWf-Q9jCkGlwMGzAWf4",
    authDomain: "coffeeapp-45d44.firebaseapp.com",
    databaseURL: "https://coffeeapp-45d44-default-rtdb.firebaseio.com",
    projectId: "coffeeapp-45d44",
    storageBucket: "coffeeapp-45d44.appspot.com",
    messagingSenderId: "24598469643",
    appId: "1:24598469643:web:32be91425934ab9c13bb0e",
    measurementId: "G-EXWMG6ZC5T"
};

// Initialize Firebase
const cong = initializeApp(firebaseConfig);
export const database = getDatabase(cong);

export default cong;
// Now you can use Firebase services in your React app!