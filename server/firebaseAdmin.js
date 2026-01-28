const admin = require("firebase-admin");
require('dotenv').config();

let serviceAccount;
let isInitialized = false;

// Try to get service account from environment variable (for Vercel deployment)
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
        const decoded = Buffer.from(
            process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
            'base64'
        ).toString('utf8');
        serviceAccount = JSON.parse(decoded);
        // console.log('✅ Firebase service account loaded from environment variable');
    } catch (error) {
        console.error('❌ Failed to decode FIREBASE_SERVICE_ACCOUNT_BASE64:', error.message);
    }
}
// Alternative: Use individual environment variables
else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
    // console.log('✅ Firebase service account loaded from individual environment variables');
}
// Local development: Use serviceAccountKey.json file
else {
    try {
        serviceAccount = require('./serviceAccountKey.json');
        // console.log('✅ Firebase service account loaded from serviceAccountKey.json');
    } catch (error) {
        console.warn('⚠️ Firebase service account not found. Admin features will not work.');
        console.warn('   For local development: Add serviceAccountKey.json to /server');
        console.warn('   For Vercel: Set FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable');
    }
}

// Initialize Firebase Admin if service account is available
if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        isInitialized = true;
        // console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin:', error.message);
    }
}

const db = isInitialized ? admin.firestore() : null;
const auth = isInitialized ? admin.auth() : null;

module.exports = { db, auth };
