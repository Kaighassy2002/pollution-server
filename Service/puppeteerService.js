const puppeteer = require("puppeteer");
const cron = require("node-cron");

let browser, page;

// ✅ Initialize Puppeteer & Open WhatsApp Web
const initializeWhatsApp = async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto("https://web.whatsapp.com");

    console.log("✅ Scan the QR code in WhatsApp Web to authenticate.");
    await page.waitForSelector("._2UwZ_", { timeout: 60000 }) // More stable selector
        .then(() => console.log("✅ WhatsApp Web connected!"))
        .catch(() => console.log("⚠️ QR Code Scan Needed!"));
};

// ✅ Function to Validate and Format Phone Numbers
const formatPhoneNumber = (mobile) => {
    if (!mobile.startsWith("+")) {
        console.log(`⚠️ Incorrect phone format: ${mobile}`);
        return null; // Return null if the phone number is invalid
    }
    return mobile.replace(/\s/g, ""); // Remove spaces if any
};

// ✅ Send WhatsApp Message to a Customer
const sendMessage = async (mobile, message) => {
    if (!browser) {
        console.log("⚠️ Puppeteer is not initialized. Start WhatsApp first!");
        return;
    }

    const validPhone = formatPhoneNumber(mobile);
    if (!validPhone) {
        console.log("❌ Invalid phone number format. Message not sent.");
        return;
    }

    const whatsappURL = `https://web.whatsapp.com/send?phone=${validPhone}&text=${encodeURIComponent(message)}`;
    await page.goto(whatsappURL);

    try {
        // ✅ Wait for the chat box to load
        await page.waitForSelector("div[title='Type a message']", { timeout: 30000 });

        // ✅ Delay before sending the message
        await page.waitForTimeout(2000);

        // ✅ Press Enter to send message
        await page.keyboard.press("Enter");

        console.log(`📩 Message sent to ${validPhone}: ${message}`);
    } catch (error) {
        console.error(`❌ Failed to send message to ${validPhone}.`, error);
    }
};

// ✅ Schedule WhatsApp Messages at 6:32 PM
cron.schedule("32 18 * * *", async () => {
    console.log("⏳ Running WhatsApp reminder task at 6:32 PM...");
    
    // Example: Replace with your logic to fetch numbers from the database
    const phoneNumbers = ["+917593984425"]; // Dummy number
    const message = "Hello! This is your daily reminder at 6:30 PM. 🚀";

    for (const phone of phoneNumbers) {
        await sendMessage(phone, message); // ✅ Fixed variable name
    }
}, {
    timezone: "Asia/Kolkata"
});

module.exports = { initializeWhatsApp, sendMessage };
