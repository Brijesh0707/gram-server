const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true
    },
    followers:[{type:ObjectId,ref:"USERS"}],
    followings:[{type:ObjectId,ref:"USERS"}]
})

mongoose.model("USERS",userSchema);