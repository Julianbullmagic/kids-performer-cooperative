const mongoose = require('mongoose');
var random = require('mongoose-simple-random');


const shopSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,

  },
  group:{type:mongoose.Schema.Types.ObjectId,ref:"Group"},
  items:[{type:mongoose.Schema.Types.ObjectId,ref:"Item"}],
  description: {
    type: String,
  },
  priceorrate: {
    type: String,
  },


})
shopSchema.plugin(random);

module.exports =  mongoose.model('Shop', shopSchema)
