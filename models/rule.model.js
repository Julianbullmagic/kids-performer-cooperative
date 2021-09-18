const mongoose = require('mongoose');


const ruleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rule: {
    type: String,
    required: true
  },
  explanation:String,
  grouptitle:String,
  group:{type:mongoose.Schema.Types.ObjectId,ref:"Group"},
  approval: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  coordinates:[Number],
  timecreated:Number,
  sentdown:{ type: Boolean, default: false },
  level:Number,
  grouptype:String
})

module.exports =  mongoose.model('Rule', ruleSchema)
