const puppeteer = require("puppeteer");

let browser;
let page;

// Selectors for WhatsApp Web
const newChatButtonSelector = "button[title='New chat']"; // New chat button
const searchInputSelector = "div[aria-label='Search name or number'][contenteditable='true']"; // Search input field
const contactExistsSelector = "div._ak8l"; // Contact check inside the wrapper
const contactWrapperSelector = "div[role='button']"; // Wrapper for checking contacts

const messageBoxSelector = "div[aria-label='Type a message'][contenteditable='true']"; // Chat text input

// Initialize WhatsApp Web
const initWhatsApp = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false, // Set to true to run without UI
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();
    await page.goto("https://web.whatsapp.com");
    console.log("🚀 WhatsApp Web opened. Please scan the QR Code.");

    // Wait for QR code scan
    await page.waitForSelector(newChatButtonSelector, { timeout: 60000 });
    console.log("✅ WhatsApp Web initialized.");
  }
};

// Send WhatsApp Message
const sendWhatsAppMessage = async (mobile, message) => {
  try {
    if (!page) {
      console.error("❌ Error: Puppeteer page is not initialized.");
      return false;
    }

    console.log(`🔍 Checking WhatsApp availability for: ${mobile}`);

    // Open "New Chat"
    await page.waitForSelector(newChatButtonSelector, { timeout: 60000 });
    await page.click(newChatButtonSelector);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Search for the contact
    await page.waitForSelector(searchInputSelector);
    await page.click(searchInputSelector);

    // Clear previous search and enter the number
    await page.keyboard.down("Control");
    await page.keyboard.press("A");
    await page.keyboard.up("Control");
    await page.keyboard.press("Backspace");
    await new Promise(resolve => setTimeout(resolve, 500));

    await page.keyboard.type(mobile, { delay: 200 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const contactButtons = await page.$$(contactWrapperSelector);
    let contactFound = false;

    for (let button of contactButtons) {
      const contactExists = await button.$(contactExistsSelector);
      if (contactExists) {
        console.log(`✅ Contact found: ${mobile}`);
        await button.click(); // Click to open chat
        contactFound = true;
        break;
      }
    }

    if (!contactFound) {
      console.log(`❌ Contact ${mobile} NOT FOUND. Skipping...`);
      return false;
    }

    console.log(`✅ Number ${mobile} is active on WhatsApp. Sending message...`);

    // Select user and send message
    await page.keyboard.press("Enter");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.waitForSelector(messageBoxSelector);
    await page.click(messageBoxSelector);
    await page.keyboard.type(message, { delay: 200 });
    await page.keyboard.press("Enter");

    console.log(`✅ Message sent to: ${mobile}`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    return true;
  } catch (error) {
    console.error(`❌ Error sending message to ${mobile}:`, error);
    return false;
  }
};


// Close Puppeteer
const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
    console.log("🚪 WhatsApp Web closed.");
  }
};

module.exports = { initWhatsApp, sendWhatsAppMessage, closeBrowser };
