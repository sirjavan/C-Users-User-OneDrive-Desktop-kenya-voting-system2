const express = require("express");
const { admin, db } = require("../config/firebase");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "default-secret"; // Prevent crashes

// ✅ Register Voter
router.post("/register", async (req, res) => {
    const { national_id, password, role = "voter" } = req.body;

    if (!national_id || !password) {
        return res.status(400).json({ error: "❌ National ID and password are required" });
    }

    try {
        const email = `${national_id}@votingsystem.com`;

        // 🔹 Create User in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: national_id,
        });

        // 🔹 Store User Role in Firestore
        await db.collection("users").doc(userRecord.uid).set({
            national_id,
            role, // Default to "voter"
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({ message: "✅ Voter registered successfully", uid: userRecord.uid });
    } catch (error) {
        res.status(500).json({ error: `❌ Registration failed: ${error.message}` });
    }
});

// ✅ Login Voter
router.post("/login", async (req, res) => {
    const { national_id } = req.body;

    if (!national_id) {
        return res.status(400).json({ error: "❌ National ID is required" });
    }

    try {
        const email = `${national_id}@votingsystem.com`;
        const user = await admin.auth().getUserByEmail(email);

        // 🔹 Retrieve User Role from Firestore
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "❌ User record not found" });
        }

        const userData = userDoc.data();
        const role = userData.role;

        // 🔹 Generate JWT Token
        const token = jwt.sign(
            { voter_id: user.uid, role }, // Include role in JWT
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.json({ message: "✅ Login successful", token, voter_id: user.uid, role });
    } catch (error) {
        if (error.code === "auth/user-not-found") {
            return res.status(404).json({ error: "❌ User not registered" });
        }
        res.status(500).json({ error: "❌ Something went wrong" });
    }
});

// ✅ Middleware: Verify Admin
function verifyAdmin(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "❌ Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "❌ Access denied: Admins only" });
        }
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        res.status(401).json({ error: "❌ Invalid token" });
    }
}

module.exports = { router, verifyAdmin };
