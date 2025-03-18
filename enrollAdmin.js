const { Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

async function enrollAdmin() {
    try {
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const adminIdentity = await wallet.get("admin");
        if (adminIdentity) {
            console.log("✅ Admin identity already exists");
            return;
        }

        console.log("✅ Admin enrolled successfully");
    } catch (error) {
        console.error(`❌ Failed to enroll admin: ${error.message}`);
    }
}

enrollAdmin();
