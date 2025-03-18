const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { router: authRoutes, verifyAdmin } = require("./routes/auth"); 
const candidateRoutes = require("./routes/candidateRoutes");
const votingRoutes = require("./routes/votingRoutes");
const blockchainRoutes = require("./routes/blockchainRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voting", votingRoutes);
app.use("/api/blockchain", blockchainRoutes);

// Protected Admin Route Example
app.get("/api/admin-only", verifyAdmin, (req, res) => {
    res.json({ message: "✅ Admin access granted" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
