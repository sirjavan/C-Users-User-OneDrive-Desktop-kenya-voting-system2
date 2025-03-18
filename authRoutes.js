const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();
const SECRET_KEY = "your-secret-key"; // Use environment variable in production

// Admin Login Endpoint
router.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [admins] = await pool.query("SELECT * FROM admins WHERE username = ?", [username]);

        if (admins.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const admin = admins[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ admin_id: admin.id, role: "admin" }, SECRET_KEY, { expiresIn: "2h" });
        res.json({ message: "Admin login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
});

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        if (decoded.role !== "admin") return res.status(403).json({ error: "Access denied" });

        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = { router, verifyAdmin };
