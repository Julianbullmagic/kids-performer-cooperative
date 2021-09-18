const mongoose = require('mongoose')



const reviewSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rating:Number,
  explanation:String,
  userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  groupId:{type:mongoose.Schema.Types.ObjectId,ref:"Group"},
  timecreated:Number,
  centre:[Number],
  radius:Number,
  grouptitle:String,
  grouplocation:String,
  grouplevel:Number,
})

module.exports =  mongoose.model('Review', reviewSchema)
