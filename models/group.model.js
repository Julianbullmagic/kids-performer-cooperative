const mongoose = require('mongoose');
var random = require('mongoose-simple-random');






const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  type:String,
  level:Number,
  events:[{type:mongoose.Schema.Types.ObjectId,ref:"Event"}],
  electedrepresentatives:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  expertcandidates:[{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],
  groupabove:{type:mongoose.Schema.Types.ObjectId,ref:"Group"},
  groupsbelow:[{type:mongoose.Schema.Types.ObjectId,ref:"Group"}],
  associatedlocalgroups:[{type:mongoose.Schema.Types.ObjectId,ref:"Group"}],
  chat: [{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}],
  centroid:[Number],
  radius:Number,
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  members: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  allmembers: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
})
groupSchema.plugin(random);


module.exports =  mongoose.model('Group', groupSchema)
