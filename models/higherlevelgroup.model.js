const mongoose = require('mongoose');




const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  level:Number,
  type:String,
  location: {
    type: String,
  },
  centroid:[Number],
  radius:Number,
  events:[{type:mongoose.Schema.Types.ObjectId,ref:"Event"}],
  associatedlocalgroups:[{type:mongoose.Schema.Types.ObjectId,ref:"LocalGroup"}],
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  members:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  allmembers: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  groupabove:{type:mongoose.Schema.Types.ObjectId},
  groupsbelow:[{type:mongoose.Schema.Types.ObjectId}]

})

module.exports =  mongoose.model('HigherLevelGroup', groupSchema)
