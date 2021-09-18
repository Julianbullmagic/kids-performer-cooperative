const express =require( 'express')
const fileUpload = require('express-fileupload');
const multer=require('multer')
const path=require('path')


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./client/public/uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


const router = express.Router();
var random = require('mongoose-simple-random');
const Item = require("../models/item.model");
const Shop = require("../models/shop.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', true);



  router.get("/items", (req, res, next) => {

    Item.findRandom({}, {}, {limit: 10}, function(err, results) {
      if (err) {
        console.log(err)
      }else{
        console.log(results)

          res.status(200).json({
                      data: results
                  });
    }
    })})

    router.get("/getoneitem/:id", (req, res, next) => {

      Item.find({_id:req.params.id})
        .exec(function(err,docs){
          if(err){
                  console.log(err);
              }else{
                console.log(docs)

                  res.status(200).json({
                              data: docs
                          });
        }
    })
      })


    router.get("/shopitems/:groupId", (req, res, next) => {

      Item.findRandom({groupId:req.params.groupId}, {}, {limit: 10}, function(err, results) {
        if (err) {
          console.log(err)
        }else{
          console.log("shop items",results)

            res.status(200).json({
                        data: results
                    });
      }
      })})


    router.get("/shops", (req, res, next) => {

      Shop.findRandom({}, {}, {limit: 10}, function(err, results) {
        if (err) {
          console.log(err)
        }else{
          console.log(results)
            res.status(200).json({
                        data: results
                    });
      }
      })})



  router.get("/getitems/:searchvalue", (req, res, next) => {
    console.log(req.params.searchvalue)
        const items=Item.find({ title: { $regex:req.params.searchvalue, $options: "i" } })
        .limit(10)
        .exec(function(err,docs){
          if(err){
                  console.log(err);
              }else{
                console.log(docs)

                  res.status(200).json({
                              data: docs
                          });
        }
    })})
    router.get("/getshopitems/:searchvalue/:groupId", (req, res, next) => {
      console.log(req.params.searchvalue,req.params.groupId)
          const items=Item.findRandom({ title: { $regex:req.params.searchvalue, $options: "i" },groupId:req.params.groupId })
          .limit(10)
          .exec(function(err,docs){
            if(err){
                    console.log(err);
                }else{
                  console.log(docs)

                    res.status(200).json({
                                data: docs
                            });
          }
      })})




    router.get("/getshops/:searchvalue", (req, res, next) => {
      console.log(req.params.searchvalue)

          const shops=Shop.find({ title: { $regex: req.params.searchvalue, $options: "i" } })
          .limit(10)
          .exec(function(err,docs){
            if(err){
                    console.log(err);
                }else{
                  console.log(docs)

                    res.status(200).json({
                                data: docs
                            });
          }
      })})






      router.post("/additem/:userId", upload.single("itemImage"), (req, res) => {

        console.log(req.body)
        const newItem = new Item({
          _id:new mongoose.Types.ObjectId(),
          title: req.body.title,
          description: req.body.description,
          priceorrate: req.body.priceorrate,
          groupId:req.body.groupId,
          images: req.body.images,
          createdby:req.params.userId
        });

        newItem
          .save()
          .then(() => res.json("New Item posted!"))
          .catch((err) => res.status(400).json(`Error: ${err}`));
      });









router.post("/addshop", (req, res, next) => {
console.log(req.body)
   let newItem= new Shop({
     _id:new mongoose.Types.ObjectId(),
     title:req.body['title'],
     description:req.body['description'],
   })
   console.log("new shop",newItem)


   newItem.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         message: "Item was saved successfully"
      })
     }
   })

})






module.exports= router
