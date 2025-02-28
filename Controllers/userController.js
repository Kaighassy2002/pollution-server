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
  
  
  