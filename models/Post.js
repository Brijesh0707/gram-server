const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const postschema = new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"USERS"}],
    postedby:{
        type:ObjectId,
        ref:"USERS"

    }
})

mongoose.model("POSTS",postschema);