var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email : {
      type:String,
      required:true,
      unique:true
  },

  password:{
      type:String,
      required:true
  },
  firstName: {
      type:String,
      required:true
  }, 
  lastName: {
    type:String,
    required:true
},
  job:{
      type:String,
      required:true
  },
  city:{
      type:String,
      required:true
  },
  frend:{
      type:mongoose.SchemaTypes.ObjectId,
      ref:"User"

  },
  moreInfo:{
      type:String
  }

});

module.exports = mongoose.model("User" , userSchema);