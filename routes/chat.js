const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { Chat } = require("../models/Chat");
const Group = require("../models/group.model");
var random = require('mongoose-simple-random');
const User = require("../models/user.model");


router.get("/finduserstomessage/:username", (req, res, next) => {
  var regexp = new RegExp("^"+ req.params.username);

  User.findRandom({name:{ $regex: regexp, $options: "i" }}, {}, {limit: 8}, function(err, results) {
    if (err) {
      console.log(err)
    }else{
var resultnames=results.map(item=>{return item.name})
console.log("users",resultnames)

        res.status(200).json({
                    data: results
                });
  }
  })})

  router.get("/getChatsWithParticularUser/:userid", (req, res, next) => {

    Chat.find({recipient:req.params.userid})
    .populate("sender")
    .exec((err, chats) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(chats)
    })
    })



router.get("/getChats",async (req, res) => {
  console.log("getting chats")
    await Chat.find()
        .populate("sender")
        .exec((err, chats) => {
            if(err) return res.status(400).send(err);
            res.status(200).send(chats)
        })
})

router.get("/getChats/:groupId",async (req, res) => {
  var groupId=req.params.groupId
  console.log("getting chats",groupId)

    await Chat.find({groupId:groupId})
        .populate("sender")
        .exec((err, chats) => {
            if(err) return res.status(400).send(err);
            res.status(200).send(chats)
        })
})

router.post("/addgroup",async (req, res) => {

let newGroup = new Group({
  _id: new mongoose.Types.ObjectId(),
  title :req.body["title"],
  description: req.body["description"],

});

newGroup.save((err) => {
  if(err){
    res.status(400).json({
      message: "The Item was not saved",
      errorMessage : err.message
   })
  }else{
    res.status(201).json({
      message: "Group was saved successfully"
   })
  }
})})


router.get("/getGroups",(req, res, next) => {
 Group.find()
        .exec((err, groups) => {
            console.log(groups)
            if(err) return res.status(400).send(err);
            res.status(200).send(groups)
        })
});

router.route('/addexpert/:userId').put((req, res) => {
  let userId = req.params.userId;
  const updatedRule=Group.findByIdAndUpdate(userId, {$addToSet : {
  experts:userId
}}).exec()


})

router.route('/removeexpert/:userId').put((req, res) => {
  let userId = req.params.userId;
  const updatedRule=Rule.findByIdAndUpdate(userId, {$pull : {
  experts:userId
}}).exec()


})





module.exports = router;
