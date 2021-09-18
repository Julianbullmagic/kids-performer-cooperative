const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:String,
  expertise:String,
  timecreated:Number,
  level:Number,
  grouptitle:String,
  userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
  groupId: {type: mongoose.Schema.ObjectId, ref: 'Group'},
votes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
})

module.exports =  mongoose.model('ExpertCandidate', candidateSchema)
