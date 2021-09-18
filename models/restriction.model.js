const mongoose = require('mongoose')

const restrictionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  centre:[Number],
  radius:Number,
  grouptitle:String,
  grouplocation:String,
  grouplevel:Number,
  timecreated:Number,
  timeexpires:Number,
  restriction:String
})

module.exports =  mongoose.model('Restriction', restrictionSchema)
