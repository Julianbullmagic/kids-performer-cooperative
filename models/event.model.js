const mongoose = require('mongoose');


const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title:String,
  description:String,
  location:String,
  images:[{type:String}],
  grouptitle:String,
  group:{type:mongoose.Schema.Types.ObjectId,ref:"Group"},
  approval: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  coordinates:[Number],
  sentdown:{ type: Boolean, default: false },
  timecreated:Number,
  level:Number,
  grouptype:String
})

module.exports =  mongoose.model('Event', eventSchema)
