const { log } = require('console')
const users = require('../Models/userModel')


//details post

exports.vehicleData= async(req,res)=>{
    const{vehicleNo,mobile,validDate,uptoDate,rate} = req.body
    console.log(vehicleNo,mobile,validDate,uptoDate,rate);

    try{
        const existingUser = await users.findOne({vehicleNo})
        if (existingUser) {
            res.status(406).json("vehicle Already exists!!!")
        }else{
            const newUser = new users({
                vehicleNo,mobile,validDate,uptoDate,rate 
            })
            await newUser.save()
            res.status(200).json({ message: "Vehicle registered successfully" });
        }
    }catch(err){
        res.status(401).json(err)
    }
}



// get details 

exports.getallVehicle = async(req,res)=>{
    try {
        console.log('Fetching all users...');
        const allVehicle = await users.find();
        console.log('Users fetched:', allVehicle);
        res.status(200).json(allVehicle);
      } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: err.message });
      }
}


// edit

exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedUser = await users.findByIdAndUpdate(id, updatedData, {
        new: true, // Returns the updated document
        runValidators: true, // Ensures validation is applied
      });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  

  // Delete user by ID
 exports. deleteUser = async (req, res) => {
      try {
          const { id } = req.params;
          const deletedUser = await users.findByIdAndDelete(id);
  
          if (!deletedUser) {
              return res.status(404).json({ message: "User not found" });
          }
  
          res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
          res.status(500).json({ message: "Error deleting user", error });
      }
  };


  // get user message details

  exports.getExpiredUsersList = async (req, res) => {
    try {
        const today = new Date();
        const expiredDate = new Date();
        expiredDate.setDate(today.getDate() + 3); // 3 days from today

        
        const formattedExpiredDate = expiredDate.toISOString().split("T")[0];
        const formattedToday = today.toISOString().split("T")[0];

        console.log(`🔍 Fetching users with uptoDate on or before: ${formattedExpiredDate}`);

        // Query to fetch all users whose `uptoDate` is today or within the next 3 days
        const expiredUsers = await users.find(
            { uptoDate: { $lte: formattedExpiredDate, $gte: formattedToday } }, // Ensures past and upcoming expiry users
            { vehicleNo: 1, mobile: 1, uptoDate: 1, verified: 1, _id: 1 } // Selecting necessary fields
        );

        if (expiredUsers.length === 0) {
            console.log("❌ No users found with expiry dates within the range.");
            return res.status(404).json({ message: "No expired users found" });
        }

        console.log(`✅ Found ${expiredUsers.length} expired users`);
        res.status(200).json(expiredUsers);
    } catch (error) {
        console.error("❌ Error fetching expired user data:", error);
        res.status(500).json({ error: "Error fetching expired user data" });
    }
};






  




  
  