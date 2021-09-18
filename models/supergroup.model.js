const mongoose = require('mongoose');


const superGroupSchema = mongoose.Schema({
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
  groups:[{type:mongoose.Schema.Types.ObjectId,ref:"Group"}],
  events: [{type:mongoose.Schema.Types.ObjectId,ref:"Event"}],
  centroid:[Number],
  radius:Number,
  rules: [{type:mongoose.Schema.Types.ObjectId}],
  allmembers: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],

})

module.exports =  mongoose.model('SuperGroup', superGroupSchema)
