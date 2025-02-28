const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    vehicleNo:{
        type: String,
        required:true,
        unique:true
    },
    mobile:{
        type: String,
        required:true,
        unique:true
    },
    validDate:{
        type: String,
        required:true
    },
    uptoDate:{
        type: String,
        required:true
        
    },
    rate:{
        type: String,
        required:true
    }

})

const users = mongoose.model("users",userSchema)

module.exports = users