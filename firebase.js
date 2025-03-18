const admin = require("firebase-admin");
const fs = require("fs");
require("dotenv").config(); // ✅ Load environment variables

// ✅ Ensure Firebase Credentials File Exists
if (!process.env.FIREBASE_CREDENTIALS || !fs.existsSync(process.env.FIREBASE_CREDENTIALS)) {
    console.error("❌ ERROR: Firebase credentials file missing!");
    console.error("➡ Ensure 'serviceAccountKey.json' exists in './config/' and check your .env file.");
    process.exit(1);
}

// ✅ Ensure Firebase Database URL is Set
if (!process.env.FIREBASE_DATABASE_URL) {
    console.error("❌ ERROR: FIREBASE_DATABASE_URL is missing!");
    console.error("➡ Add it to your .env file.");
    process.exit(1);
}

// 🔥 Load Firebase credentials
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);

// 🔥 Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// 🔥 Initialize Firestore Database
const db = admin.firestore();

console.log("✅ Firebase Firestore initialized.");

module.exports = { admin, db };
