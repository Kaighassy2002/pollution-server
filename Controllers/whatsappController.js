const users = require("../Models/userModel");
const { sendMessage } = require("../Service/puppeteerService");

// ✅ Automatically Send WhatsApp Message for Upcoming Renewals
exports.sendWhatsAppMessage = async (req, res) => {
    try {
        // ✅ Get the date 3 days from today
        const today = new Date();
        today.setDate(today.getDate() + 3);
        const reminderDate = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        console.log(`🔍 Checking users with renewal date: ${reminderDate}`);

        // ✅ Find users whose `uptoDate` matches the reminder date
        const usersToNotify = await users.find({ uptoDate: reminderDate });

        if (usersToNotify.length === 0) {
            return res.json({ message: "✅ No users need a reminder today." });
        }

        // ✅ Send message to each user
        for (const user of usersToNotify) {
            const message = `Hello, your vehicle (${user.vehicleNo}) needs renewal in 3 days. Please update soon!`;
            await sendMessage(user.mobile, message);
            console.log(`📩 Message sent to ${user.mobile}`);
        }

        res.json({ message: `✅ Messages sent to ${usersToNotify.length} users` });
    } catch (error) {
        console.error("❌ Error sending WhatsApp messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};
