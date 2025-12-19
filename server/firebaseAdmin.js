const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

try {
    const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin Initialized with Service Account");
    } else {
        console.warn("WARNING: serviceAccountKey.json not found in server directory.");
        console.warn("Admin operations will fail until text key is provided.");
        // Fallback or initialization without creds (won't work for Firestore access usually)
        // admin.initializeApp(); 
    }
} catch (error) {
    console.error("Error initializing Firebase Admin:", error);
}

let db = {
    collection: () => ({ add: () => Promise.reject("Firebase not initialized") })
};
let auth = {
    verifyIdToken: () => Promise.reject("Firebase not initialized")
};

if (admin.apps.length > 0) {
    db = admin.firestore();
    auth = admin.auth();
}

module.exports = { db, auth, admin };
