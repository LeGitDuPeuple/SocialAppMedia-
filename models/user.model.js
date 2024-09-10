const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = mongoose.Schema( {
  pseudo:{type:String, required:false, unique:true},
  email: {type:String, required: true,  unique:true},
  password: {type:String, required:true},
  role: { type: String, enum: ['admin', 'user'], default: 'user' }

});

// Ce plugin sert a empecher la création de plusieurs compte avec la même adresse miel 
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema);