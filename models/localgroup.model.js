const mongoose = require('mongoose');




const localGroupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  location: {
    type: String,
  },
  centroid:[Number],
    radius:Number,
    events:[{type:mongoose.Schema.Types.ObjectId,ref:"Event"}],
    groupabove:{type:mongoose.Schema.Types.ObjectId,ref:"HigherLevelGroup"},
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  members: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],

})

module.exports =  mongoose.model('LocalGroup', localGroupSchema)
