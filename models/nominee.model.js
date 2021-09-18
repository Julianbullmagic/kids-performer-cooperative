const mongoose = require('mongoose');

const nomineeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{
    type: String,
  },
  isCandidate:{
    type: Boolean,
    default:false
  },
  userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
  groupId: {type: mongoose.Schema.ObjectId, ref: 'Group'},
  qualifications: {
    type: String,
  },
  workexperience: {
    type: String,
  },
votes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
})

module.exports =  mongoose.model('ExpertNominee', nomineeSchema)
