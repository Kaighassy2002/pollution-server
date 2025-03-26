const { sendWhatsAppMessage, initWhatsApp, closeBrowser } = require("../Service/puppeter");
const User = require("../Models/userModel"); // Import User model

exports.sendMessages = async (req, res) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: "No users provided" });
    }

    await initWhatsApp(); // Start WhatsApp session

    let updatedUsers = [];

    const sentNumbers = new Set(); // Store numbers that have already received messages

    for (let user of users) {
      if (!sentNumbers.has(user.mobile)) {
        const message = `പ്രിയ ഉപഭോക്താവേ, നിങ്ങളുടെ വാഹനം 🚗 (${user.vehicleNo})യുടെ പുക പരിശോധന ${user.uptoDate} ന് അവസാനിക്കുന്നതാണ്. അതിനാൽ, ദയവായി സമീപമുള്ള പുക പരിശോധന കേന്ദ്രത്തിൽ നിന്ന് പരിശോധന നടത്തുക. 

        *GreenLeaf Pollution Center*`;
          
        const success = await sendWhatsAppMessage(user.mobile, message);
    
        if (success) {
          sentNumbers.add(user.mobile); // Mark this number as sent
        }
    
        let verificationStatus = success === "skipped" ? false : success;
    
        // ✅ Update MongoDB with verified status
        await User.findByIdAndUpdate(
          user._id,
          { verified: verificationStatus },
          { new: true, upsert: true }
        );
      }
    }
    
  

    await closeBrowser(); // Close WhatsApp session

    res.status(200).json({
      message: "Messages processed successfully!",
      users: updatedUsers, // ✅ Return updated users to frontend
    });
  } catch (error) {
    console.error("❌ Error in sendMessages:", error);
    res.status(500).json({ error: "Failed to send messages" });
  }
};


