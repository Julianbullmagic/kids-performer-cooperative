const express =require( 'express')
const router = express.Router();
const userCtrl =require( '../controllers/user.controller')
const authCtrl =require( '../controllers/auth.controller')
const ExpertCandidate = require("../models/expertcandidate.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Event = require("../models/event.model");
require('dotenv').config();
const nodemailer = require('nodemailer');
const Rule = require("../models/rule.model");
const SuperGroup = require("../models/supergroup.model");
const Review = require("../models/userrating.model");
const Restriction= require("../models/restriction.model");
var random = require('mongoose-simple-random');


const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);




router.post("/createreview/:reviewid", (req, res, next) => {
   let newReview = new Review({
     _id: req.params.reviewid,
     rating:req.body['rating'],
     explanation:req.body['explanation'],
     timecreated: req.body["timecreated"],
     userId:req.body['userId'],
     groupId:req.body['groupId'],
     postedBy: req.body["postedBy"]
  });


   newReview.save((err) => {
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

router.post("/createuserrrestriction", (req, res) => {

    const restriction = new Restriction(req.body);
console.log(restriction)
    restriction.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.put("/addrestrictiontouser/:user/:restriction", (req, res, next) => {
  User.findByIdAndUpdate(req.params.user, {$push : {
  restrictions:req.params.restriction
  }}).exec(function(err,docs){
    if(err){
            console.log(err);
        }else{

            res.status(200).json({
              data:docs,
              message: "User updated successfully"
                    })
  }
   })
})

router.get("/findreviews/:groupId/:userId", (req, res, next) => {
  console.log("ids in server",req.params.groupId,req.params.userId)

      const items=Review.find({groupId:req.params.groupId, userId:req.params.userId})
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

  })})


router.post("/creategroup", (req, res, next) => {


   let newGroup = new Group({
     _id: req.body['_id']||new mongoose.Types.ObjectId(),
     location:req.body['location'],
     level:req.body['level'],
     centroid: req.body["centroid"],
     members:req.body["members"],
     allmembers:req.body["members"],
     title:req.body['title'],
     description:req.body['description'],
     rules:req.body['rules'],
  });

   newGroup.save((err) => {
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

router.post("/createsupergroup", (req, res, next) => {

   let newSuperGroup = new SuperGroup({
     _id: req.body['_id']||new mongoose.Types.ObjectId(),
     location:req.body['location'],
     centroid: req.body["centroid"],
     allmembers:req.body["members"],
     title:req.body['title'],
     description:req.body['description'],
     rules:req.body['rules'],
  });


   newSuperGroup.save((err,data) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         data:data,
         message: "Item was saved successfully"
      })
     }
   })
})

router.put("/addsupergrouptouser/:user/:supergroup", (req, res, next) => {
  console.log("user and supergroup",req.params.supergroup,req.params.user)
  User.findByIdAndUpdate(req.params.user, {$push : {
  supergroups:req.params.supergroup
  }}).exec(function(err,docs){
    if(err){
            console.log(err);
        }else{

            res.status(200).json({
              data:docs,
              message: "User updated successfully"
                    })
  }
   })
})



router.post('/sendelectionnotification/:groupName/:groupId', (req, res, next) => {
  console.log("send election notfication")
  var emails = req.body
  var groupId=req.params.groupId
var groupName=req.params.groupName


  if(emails.length>0){

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD // naturally, replace both with your real credentials or an application-specific password
      }
    })
    const optionsArray=emails.map(email=>{
      const mailOptions = {
        from: "democracybooknews@gmail.com",
        to: email,
        subject: 'Election Notification',
        text: `The group called ${groupName} is having an election, please take the time to read the candidates\' experience and qualifications. If you don\'t have time for this, please abstain from voting. You have three days to make your decision`
      };
      return mailOptions
    })

    optionsArray.forEach(sendEmails)

    function sendEmails(item){
      transporter.sendMail(item, function(error, info){
        if (error) {
      	console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })

    }
  }})






router.route('/withdrawdisapproval/:ruleId/:userId').put((req, res) => {
  let ruleId = req.params.ruleId
  let userId = req.params.userId;

  const updatedRule=Rule.findByIdAndUpdate(ruleId, {$pull : {
  disagree:userId
}}).exec()


})









function sendElectionReminder(){
let transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: process.env.EMAIL, // TODO: your gmail account
    pass: process.env.PASSWORD // TODO: your gmail password
}
});

// Step 2
let mailOptions = {
from: 'DemocracyBookUpdates@gmail.com', // TODO: email sender
to: 'Julianbullmagic@gmail.com', // TODO: email receiver
subject: 'Nodemailer - Test',
text: 'Wooohooo it works!!'
};

// Step 3
transporter.sendMail(mailOptions, (err, data) => {
if (err) {
    return log('Error occurs');
}
return log('Email sent!!!');
})
}



router.get("/findgroupscoordinates", (req, res, next) => {
      const items=Group.find({ }, { _id: 1, centroid: 1 })
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

  })})

  router.put("/joinlocalgroup/:groupId/:userId", (req, res, next) => {
    let userId = req.params.userId;
    let groupId = req.params.groupId;
console.log("adding member to localgroup", groupId,userId)
        const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
        members:userId
      }}).exec()



      })





      router.route('/addruletogroup/:groupId/:ruleId').put((req, res) => {
        let groupId = req.params.groupId;
        let ruleId = req.params.ruleId;
        console.log("ids",groupId,ruleId)


        const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
        rules:ruleId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })

      router.route('/removerulefromgroup/:groupId/:ruleId').put((req, res) => {
        let groupId = req.params.groupId;
        let ruleId = req.params.ruleId;
        console.log("removing rule from normal group",groupId,ruleId)


        const updatedGroup=Group.findByIdAndUpdate(groupId, {$pull : {
        rules:ruleId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })

      router.route('/addeventtogroup/:groupId/:eventId').put((req, res) => {
        let groupId = req.params.groupId;
        let eventId = req.params.eventId;


        const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
        events:eventId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })

      router.route('/removeeventfromgroup/:groupId/:eventId').put((req, res) => {
        let groupId = req.params.groupId;
        let eventId = req.params.eventId;
        console.log("removing event form local group",groupId,eventId)

        const updatedGroup=Group.findByIdAndUpdate(groupId, {$pull : {
        events:eventId
      }}, function(err, result){

              if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

          })
      })






      router.get("/findlocalgroup/:groupId", (req, res, next) => {
        let groupId = req.params.groupId;
            const items=Group.findById(groupId).exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                      res.status(200).json({
                                  data: docs
                              });
            }
        })})



        router.get("/finduserrestrictions/:userId", (req, res, next) => {
              const items=User.findById(req.params.userId)
              .populate('restrictions')
              .exec(function(err,docs){
                if(err){
                        console.log(err);
                    }else{
                        res.status(200).json({
                                    data: docs
                                });
              }
          })})



router.post("/createlocalgroup", (req, res, next) => {

   let newGroup = new LocalGroup({
     _id: new mongoose.Types.ObjectId(),
     location:req.body['location'],
     centroid: req.body["centroid"],
   });


   newGroup.save((err) => {
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

router.get("/findgroups", (req, res, next) => {

      const items=Group.find()
      .populate('members')
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

  })})


      router.get("/getmemberids/:groupId", (req, res, next) => {
        let groupId = req.params.groupId;
      Group.find({_id:groupId}, { _id: 1, members: 1 })
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }
      })
          })

          router.get("/getlowergroupcoordsandradius/:groupId", (req, res, next) => {
            let groupId = req.params.groupId;
          Group.find({_id:groupId}, { _id: 1, centroid: 1, radius:1, groupsbelow:1 })
          .exec(function(err,docs){
            if(err){
                    console.log(err);
                }else{
                    res.status(200).json({
                                data: docs
                            });
          }
          })
              })

          router.get("/populategroupmembers/:groupId", (req, res, next) => {
            let groupId = req.params.groupId;
                const items=Group.find({_id:groupId})
                .populate({
                  path:'members',
                  populate:{ path: 'restrictions', model: Restriction }
                })
                .populate('associatedlocalgroups')
                .populate('expertcandidates')
                .populate({
               path    : 'groupabove',
               model: Group }
               )
               .populate({
              path    : 'groupsbelow',
              model: Group }
              )
              .populate({
                path:'rules',
                populate:{ path: 'group', model: Group }
              })
                .populate({
               path    : 'events',
               populate: { path: 'group', model: Group }
               })
                .exec(function(err,docs){
                  if(err){
                          console.log(err);
                      }else{
                        console.log("docs",docs)
                          res.status(200).json({
                                      data: docs
                                  });
                }
            })})


router.get("/findyourgroups/:userId", (req, res, next) => {

      User.find({_id:req.params.userId})
      .populate('groupstheybelongto')
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
              console.log("docs",docs)
                res.status(200).json({
                            data: docs
                        });
      }
  })})


      router.get("/findgroups", (req, res, next) => {

            const items=Group.find()
            .populate('members')
            .exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                      res.status(200).json({
                                  data: docs
                              });
            }

        })})

        router.get("/findgroupsbytitle/:title", (req, res, next) => {

              const items=Group.find({title:req.params.title})
              .populate('members')
              .exec(function(err,docs){
                if(err){
                        console.log(err);
                    }else{
                        res.status(200).json({
                                    data: docs
                                });
              }

          })})

        router.get("/findsupergroups", (req, res, next) => {

              const items=SuperGroup.find()
              .exec(function(err,docs){
                if(err){
                        console.log(err);
                    }else{
                        res.status(200).json({
                                    data: docs
                                });
              }

          })})

        router.get("/getgroup/:groupId", (req, res, next) => {
          let groupId = req.params.groupId;

              const items=Group.find({_id:groupId})
              .exec(function(err,docs){
                if(err){
                        console.log("err",err);
                    }else{
                      console.log("docs",docs)
                        res.status(200).json({
                                    data: docs
                                });
              }
          })})






    router.route('/join/:groupId/:userId').put((req, res) => {
      let userId = req.params.userId;
      let groupId = req.params.groupId;

      User.findByIdAndUpdate(userId, {$addToSet : {
      groupstheybelongto:groupId
    }}).exec()
      Group.findByIdAndUpdate(groupId, {$addToSet : {
      members:userId
    }}).exec()
    })

    router.route('/leave/:groupId/:userId').put((req, res) => {
      let userId = req.params.userId;
      let groupId = req.params.groupId;

      User.findByIdAndUpdate(userId, {$pull : {
      groupstheybelongto:groupId
    }}).exec()
      Group.findByIdAndUpdate(groupId, {$pull : {
      members:userId
    }}).exec()
    })














      router.get("/findlocalgroup/:groupId", (req, res, next) => {
            const items=Group.findById(req.params.groupId).exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                    console.log("localgroup",docs)

                      res.status(200).json({
                                  data: docs
                              })
            }
        })})





router.route('/update/:id').post((req, res) => {
  Group.findById(req.params.id)
    .then(post => {
      post.name = req.body.name;
      post.category = req.body.category;
      post.image = req.body.image;
      post.text = req.body.text;
      post.date = req.body.date;

      post.save()
        .then(() => res.json('Group updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});






router.get("/getuser/:userId", (req, res, next) => {
  var userId=req.params.userId
  console.log("userId in router",userId)
  const items=User.findById(userId, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
        console.log("Result : ", docs);
        res.status(200).json({
                    data: docs
                })
    }
})
})

router.post("/createuser", (req, res, next) => {
  var user=req.body.user
        let newUser = new User(user);

console.log("new user in server",newUser)
        newUser.save((err,docs) => {
          if(err){
            console.log(err)
            res.status(400).json({
              message: "The Item was not saved",
              errorMessage : err.message
           })
          }else{
            console.log("DOCS",docs)
            res.status(201).json({
              message: "Item was saved successfully",
              data:docs
           })
          }
        })

})


router.route('/addusertogroup/:groupId/:userId').put((req, res) => {
  let groupId = req.params.groupId;
  let userId = req.params.userId;
  const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
  members:userId
}}, function(err, result){

        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
})

router.route('/removeuserfromgroup/:groupId/:userId').put((req, res) => {
  let groupId = req.params.groupId;
  let userId = req.params.userId;


Group.findByIdAndUpdate(groupId, {$pull : {
  members:userId
}}, function(err, result){

        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
})


router.get("/searchforgroups/:titlevalue/:locationvalue/:levelvalue", (req, res, next) => {
  var level=parseInt(req.params.levelvalue)

    Group.find({ level: level,
    title: { $regex:req.params.titlevalue, $options: "i" },
    location: { $regex:req.params.locationvalue, $options: "i" } })
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
router.get("/searchforgroupsbytitleandlocation/:titlevalue/:locationvalue", (req, res, next) => {

    Group.find({title: { $regex:req.params.titlevalue, $options: "i" },
    location: { $regex:req.params.locationvalue, $options: "i" } })
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
router.get("/searchforgroupsbytitleandlevel/:titlevalue/:levelvalue", (req, res, next) => {
var level=parseInt(req.params.levelvalue)
console.log("level",level)

    Group.find({ level: level ,
    title: { $regex:req.params.titlevalue, $options: "i" } })
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
router.get("/searchforgroupsbylocationandlevel/:locationvalue/:levelvalue", (req, res, next) => {
  var level=parseInt(req.params.levelvalue)

    Group.find({ level: level,
    location: { $regex:req.params.locationvalue, $options: "i" } })
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

router.get("/searchforgroupsbylocation/:locationvalue", (req, res, next) => {

    Group.find({location: { $regex:req.params.locationvalue, $options: "i" } })
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
router.get("/searchforgroupsbytitle/:titlevalue", (req, res, next) => {

    Group.find({title: { $regex:req.params.titlevalue, $options: "i" } })
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
router.get("/searchforgroupsbylevel/:levelvalue", (req, res, next) => {
  var level=parseInt(req.params.levelvalue)

    Group.find({ level: level})
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



router.post("/nominatecandidate/", (req, res, next) => {


   let newCandidate= new ExpertCandidate({
     _id:req.body._id,
     name:req.body.name,
     expertise:req.body.expertise,
     level:req.body.level,
     grouptitle:req.body.grouptitle,
     timecreated:req.body.timecreated,
     userId:req.body.userId,
     groupId:req.body.groupId,
     votes:[...req.body.votes]
      })

   newCandidate.save((err,candidate) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         message: "Candidate was saved successfully",
         id:candidate._id
      })
     }
   })
})


router.route('/addnomineetogroupobject/:nominee/:group').put((req, res) => {
  let nomineeId = req.params.nominee
  let groupId = req.params.group;

console.log("ADDING NOMINEE TO GROUP",groupId,nomineeId)

const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
expertcandidates:nomineeId
}}, function(err, result){

      if(err){
          res.send(err)
      }
      else{
          res.send(result)
      }

  })


})





router.route('/removenomineefromgroupobject/:nominee/:group').put((req, res) => {
  let nomineeId = req.params.nominee
  let groupId = req.params.group;
  console.log("removing candidate from group object",nomineeId,groupId)


  const updatedGroup=Group.findByIdAndUpdate(groupId, {$pull : {
  expertcandidates:nomineeId
}}).exec()
})

router.route('/approveofcandidate/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;

  const updatedCandidate=ExpertCandidate.findByIdAndUpdate(candidateId, {$addToSet : {
  votes:userId
}}).exec()
})

router.route('/withdrawapprovalofcandidate/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;

  const updatedCandidate=ExpertCandidate.findByIdAndUpdate(candidateId, {$pull : {
  votes:userId
}}).exec()
})



module.exports= router
