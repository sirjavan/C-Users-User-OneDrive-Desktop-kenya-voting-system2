const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/firebase");

const router = express.Router();

/**
 * 🔹 Get All Candidates
 */
router.get("/candidates", async (req, res) => {
    try {
        const candidates = [];
        const snapshot = await db.collection("candidates").get();

        snapshot.forEach(doc => {
            candidates.push({ id: doc.id, ...doc.data() });
        });

        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: "Error fetching candidates" });
    }
});

/**
 * 🔹 Cast a Vote
 */
router.post("/vote", authMiddleware, async (req, res) => {
    const { candidate_id } = req.body;
    const voter_id = req.user.national_id;

    try {
        const voteRef = db.collection("votes").doc(voter_id);
        const voteDoc = await voteRef.get();

        if (voteDoc.exists) {
            return res.status(400).json({ error: "You have already voted!" });
        }

        await voteRef.set({ candidate_id });

        const candidateRef = db.collection("candidates").doc(candidate_id);
        await candidateRef.update({ votes: admin.firestore.FieldValue.increment(1) });

        res.json({ message: "Vote cast successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error casting vote" });
    }
});

module.exports = router;
