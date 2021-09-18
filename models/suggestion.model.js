const mongoose = require('mongoose')



const ruleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  suggestion: {
    type: String,
    required: true
  },
  userId:mongoose.Schema.Types.ObjectId,
  suggestionExplanation: {
    type: String,
    required: true
  },
  ruleId:mongoose.Schema.Types.ObjectId,

  suggestionExplanation: {
    type: String,
    required: true
  },
  upvotes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]

})

module.exports =  mongoose.model('Suggestion', ruleSchema)
