const express = require('express')
const userController = require('../Controllers/userController')
const whatsappController = require('../Controllers/whatsappController')

const router = new express.Router()

//details post

router.post('/vehicleData',userController.vehicleData)

//get all users

router.get('/allVehicleDetails',userController.getallVehicle)

// Update user details
router.put("/update/:id", userController.updateUser);

// remove
router.delete('/delete/:id', userController.deleteUser);

//send message
router.post("/send-message", whatsappController.sendWhatsAppMessage);

module.exports = router