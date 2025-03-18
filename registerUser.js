const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

async function registerUser(userId) {
    try {
        const ccpPath = path.resolve(__dirname, "..", "connection-org1.json");
        if (!fs.existsSync(ccpPath)) {
            throw new Error("❌ connection-org1.json is missing");
        }
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        const walletPath = path.join(process.cwd(), "wallet");
        if (!fs.existsSync(walletPath)) {
            fs.mkdirSync(walletPath);
        }

        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "admin",
            discovery: { enabled: true, asLocalhost: true },
        });

        const network = await gateway.getNetwork("mychannel");
        const contract = network.getContract("voting");

        await contract.submitTransaction("registerUser", userId);
        console.log(`✅ User ${userId} registered on Blockchain`);

        await gateway.disconnect();
    } catch (error) {
        console.error(`❌ Failed to register user: ${error.message}`);
        throw error;
    }
}

module.exports = registerUser;
