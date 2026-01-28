const express = require('express');
const cors = require('cors');
const { db, auth } = require('./firebaseAdmin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Middleware
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

// --- ROUTES ---

// Helper for error handling
const handleRequest = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// DOCTORS
app.post('/api/doctors', verifyToken, handleRequest(async (req, res) => {
    const docRef = await db.collection('doctors').add(req.body);
    res.status(201).json({ id: docRef.id, ...req.body });
}));

app.put('/api/doctors/:id', verifyToken, handleRequest(async (req, res) => {
    const { id } = req.params;
    await db.collection('doctors').doc(id).set(req.body, { merge: true });
    res.json({ id, ...req.body });
}));

app.delete('/api/doctors/:id', verifyToken, handleRequest(async (req, res) => {
    const { id } = req.params;
    await db.collection('doctors').doc(id).delete();
    res.json({ message: `Doctor ${id} deleted` });
}));

// HOSPITALS
app.post('/api/hospitals', verifyToken, handleRequest(async (req, res) => {
    const docRef = await db.collection('hospitals').add(req.body);
    res.status(201).json({ id: docRef.id, ...req.body });
}));

app.put('/api/hospitals/:id', verifyToken, handleRequest(async (req, res) => {
    const { id } = req.params;
    await db.collection('hospitals').doc(id).set(req.body, { merge: true });
    res.json({ id, ...req.body });
}));

app.delete('/api/hospitals/:id', verifyToken, handleRequest(async (req, res) => {
    const { id } = req.params;
    await db.collection('hospitals').doc(id).delete();
    res.json({ message: `Hospital ${id} deleted` });
}));

// DONORS (Admin)
app.put('/api/donors/:id', verifyToken, handleRequest(async (req, res) => {
    const { id } = req.params;
    await db.collection('donors').doc(id).set(req.body, { merge: true });
    res.json({ id, ...req.body });
}));

app.delete('/api/donors/:id', verifyToken, handleRequest(async (req, res) => {
    const { id } = req.params;
    await db.collection('donors').doc(id).delete();
    res.json({ message: `Donor ${id} deleted` });
}));


// SETTINGS
app.get('/api/settings', handleRequest(async (req, res) => {
    const snapshot = await db.collection('settings').limit(1).get();
    if (snapshot.empty) {
        return res.json({ centralPhone: '', useCentralPhone: false });
    }
    res.json(snapshot.docs[0].data());
}));

app.put('/api/settings', verifyToken, handleRequest(async (req, res) => {
    const snapshot = await db.collection('settings').limit(1).get();
    let docId;
    if (snapshot.empty) {
        const ref = await db.collection('settings').add(req.body);
        docId = ref.id;
    } else {
        docId = snapshot.docs[0].id;
        await db.collection('settings').doc(docId).set(req.body, { merge: true });
    }
    res.json({ success: true, ...req.body });
}));

// DONATION REQUESTS
app.put('/api/donation-requests/:id', verifyToken, handleRequest(async (req, res) => {
    const { id } = req.params;
    await db.collection('donation_requests').doc(id).set(req.body, { merge: true });
    res.json({ id, ...req.body });
}));

app.delete('/api/donation-requests/:id', verifyToken, handleRequest(async (req, res) => {
    const { id } = req.params;
    await db.collection('donation_requests').doc(id).delete();
    res.json({ message: `Donation request ${id} deleted` });
}));

app.get('/', (req, res) => {
    res.send('HemoCare Admin Server Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
