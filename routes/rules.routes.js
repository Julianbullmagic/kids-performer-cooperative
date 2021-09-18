const express =require( 'express')
const router = express.Router();
const Rule = require("../models/rule.model");
const Group = require("../models/group.model");
const Suggestion= require("../models/suggestion.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);



router.get("/:ruleId", (req, res, next) => {

    Rule.findById(req.params.ruleId)
    .populate('suggestions')
      .then(rule => res.json(rule))
      .catch(err => res.status(400).json('Error: ' + err));
  })

  router.get("/:ruleId", (req, res, next) => {

      Rule.findById(req.params.ruleId)
      .populate('suggestions')
        .then(rule => res.json(rule))
        .catch(err => res.status(400).json('Error: ' + err));
    })


  router.delete("/:ruleId", (req, res, next) => {

      Rule.findByIdAndDelete(req.params.ruleId)
      .exec()
    })



    router.route('/approveofrule/:ruleId/:userId').put((req, res) => {
      let ruleId = req.params.ruleId
      let userId = req.params.userId;
      console.log(ruleId,userId)

      const updatedRule=Rule.findByIdAndUpdate(ruleId, {$addToSet : {
      approval:userId
    }}).exec()
    })

    router.route('/withdrawapprovalofrule/:ruleId/:userId').put((req, res) => {
      let ruleId = req.params.ruleId
      let userId = req.params.userId;
      console.log(ruleId,userId)

      const updatedRule=Rule.findByIdAndUpdate(ruleId, {$pull : {
      approval:userId
    }}).exec()
    })


    router.route('/markrulesentdown/:ruleId').put((req, res) => {
      console.log("sending rule down",req.params.ruleId)
      Rule.findByIdAndUpdate(req.params.ruleId, {sentdown:true}).exec()
    })


  router.route('/createrule/:ruleId').post((req, res) => {
    let ruleId = req.params.ruleId;
    console.log("req.body",req.body)
    var newRule=new Rule({
      _id: ruleId,
      rule :req.body["rule"],
      level:req.body["level"],
      explanation:req.body["explanation"],
      grouptitle :req.body["grouptitle"],
      group:req.body["group"],
      timecreated:req.body["timecreated"],
      approval:req.body["approval"],
      grouptype:req.body["grouptype"]
    });
console.log(newRule)

  newRule.save((err,doc) => {
    if(err){
      res.status(400).json({
        message: "The Item was not saved",
        errorMessage : err.message
     })
    }else{
      res.status(201).json({
        message: "Item was saved successfully",
        data:doc
     })
    }
  })})





module.exports= router
