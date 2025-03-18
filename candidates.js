const express = require("express");
const { db } = require("../config/firebase");
const router = express.Router();

// Fetch all candidates
router.get("/", async (req, res) => {
    try {
        const candidatesSnapshot = await db.collection("candidates").get();
        const candidates = candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: "Error fetching candidates" });
    }
});

// Add a new candidate
router.post("/add", async (req, res) => {
    const { name, party } = req.body;

    try {
        const candidateRef = db.collection("candidates").doc();
        await candidateRef.set({ name, party });
        res.status(201).json({ message: "Candidate added successfully", id: candidateRef.id });
    } catch (error) {
        res.status(500).json({ error: "Error adding candidate" });
    }
});

module.exports = router;
