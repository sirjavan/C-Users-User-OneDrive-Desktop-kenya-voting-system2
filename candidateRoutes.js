const express = require("express");
const { db } = require("../config/firebase"); // ✅ Correct import for Firebase
const { verifyAdmin } = require("./auth"); // ✅ Ensure auth.js exports verifyAdmin

const router = express.Router();

// ✅ Get all candidates (Anyone can view)
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("candidates").get();
        const candidates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ Failed to fetch candidates" });
    }
});

// ✅ Add a candidate (Admin only)
router.post("/add", verifyAdmin, async (req, res) => {
    const { name, party } = req.body;
    if (!name || !party) {
        return res.status(400).json({ error: "❌ All fields are required" });
    }

    try {
        const candidateRef = await db.collection("candidates").add({ name, party });
        res.json({ message: "✅ Candidate added successfully", id: candidateRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ Error adding candidate" });
    }
});

// ✅ Delete a candidate (Admin only)
router.delete("/delete/:id", verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection("candidates").doc(id).delete();
        res.json({ message: "✅ Candidate deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ Error deleting candidate" });
    }
});

module.exports = router;
