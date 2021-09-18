const mongoose = require('mongoose');
var random = require('mongoose-simple-random');


const itemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,

  },
  description: {
    type: String,
  },
  priceorrate: {
    type: String,
  },
  images:[{type:String}],
  groupId:{type:mongoose.Schema.Types.ObjectId,ref:"Group"},
  createdby:{type:mongoose.Schema.Types.ObjectId,ref:"User"}

})

itemSchema.plugin(random);


module.exports =  mongoose.model('Item', itemSchema)
