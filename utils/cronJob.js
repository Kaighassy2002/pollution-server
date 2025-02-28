const puppeteer = require("puppeteer");
const fs = require("fs");

const SESSION_FILE = "./session.json"; // ✅ File to store session data

let browser, page;

// ✅ Initialize Puppeteer & Load WhatsApp Web
const initializeWhatsApp = async () => {
    const args = {
        headless: false, // Keep browser visible
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--user-data-dir=./whatsapp-session" // ✅ Stores session for auto-login
        ]
    };

    browser = await puppeteer.launch(args);
    page = await browser.newPage();

    // ✅ Load session if available
    if (fs.existsSync(SESSION_FILE)) {
        const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, "utf8"));
        await page.evaluateOnNewDocument((session) => {
            for (const key in session) {
                localStorage.setItem(key, session[key]);
            }
        }, sessionData);
        console.log("✅ WhatsApp session restored!");
    }

    await page.goto("https://web.whatsapp.com");

    console.log("📢 Scan the QR code if required...");
    
    // ✅ Wait for WhatsApp to load
    await page.waitForSelector("._3xTHG", { timeout: 60000 }) // Main WhatsApp screen
        .then(async () => {
            console.log("✅ WhatsApp Web connected!");
            
            // ✅ Save session to file
            const session = await page.evaluate(() => localStorage);
            fs.writeFileSync(SESSION_FILE, JSON.stringify(session));
            console.log("✅ WhatsApp session saved!");
        })
        .catch(() => {
            console.log("⚠️ QR Code Scan Needed!");
        });
};

// ✅ Send WhatsApp Message
const sendMessage = async (phone, message) => {
    if (!browser) {
        console.log("⚠️ WhatsApp is not initialized. Please start it first!");
        return;
    }

    const whatsappURL = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    await page.goto(whatsappURL);

    // ✅ Wait for the message input box to load
    await page.waitForSelector("._4sWnG");

    // ✅ Press "Enter" to send the message
    await page.keyboard.press("Enter");

    console.log(`📩 Message sent to ${phone}: ${message}`);
};

module.exports = { initializeWhatsApp, sendMessage };
