const express = require('express')
const userController = require('../Controllers/userController')
const messageContoller = require('../Controllers/messageContoller')

const router = new express.Router()

//details post

router.post('/vehicleData',userController.vehicleData)

//get all users

router.get('/allVehicleDetails',userController.getallVehicle)

// Update user details
router.put("/update/:id", userController.updateUser);

// remove
router.delete('/delete/:id', userController.deleteUser);

// message today users
router.get('/getUserList',userController.getExpiredUsersList)

//send message
router.post("/sendmessages", messageContoller.sendMessages);



module.exports = router