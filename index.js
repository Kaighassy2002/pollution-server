require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./Routes/router");
require("./DB/connection");
const { initializeWhatsApp } = require("./Service/puppeteerService"); // Import Puppeteer Service

const ptServer = express();

ptServer.use(cors());
ptServer.use(express.json());
ptServer.use(router);

const PORT = process.env.PORT || 3000;

// ✅ Start WhatsApp Web on server start
initializeWhatsApp()
    .then(() => console.log("✅ WhatsApp Web initialized successfully!"))
    .catch((err) => console.error("❌ Error initializing WhatsApp:", err));

// ✅ Start the Express server
ptServer.listen(PORT, () => {
    console.log(`🚀 Pollution Testing Server started at port: ${PORT}`);
});

// ✅ Default Route
ptServer.get("/", (req, res) => {
    res.status(200).send(
        `<h1 style="color:red">🚀 Pollution Testing Server is running & waiting for client requests!!!</h1>`
    );
});
