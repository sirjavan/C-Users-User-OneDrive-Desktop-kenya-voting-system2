const express = require("express");
const registerUser = require("../blockchain/registerUser"); // Import blockchain function
const router = express.Router();

// Blockchain Registration API
router.post("/register", async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        await registerUser(userId);
        res.json({ message: `✅ User ${userId} registered on Blockchain` });
    } catch (error) {
        res.status(500).json({ error: `❌ Failed to register: ${error.message}` });
    }
});

module.exports = router;
