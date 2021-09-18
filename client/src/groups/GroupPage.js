import React, { Component } from 'react';
import {Link} from "react-router-dom";
import auth from './../auth/auth-helper'
import Newsfeed from './../post/Newsfeed'
import CreateRuleForm from './CreateRuleForm'
import ExpertComponent from './ExpertComponent'
import CreateEventForm from './CreateEventForm'
import UserRatings from './UserRatings'
import ChatPage from "./../ChatPage/ChatPage"
import Kmeans from 'node-kmeans';
import {Image} from 'cloudinary-react'
var geodist = require('geodist')
const mongoose = require("mongoose");







class SingleGroupPage extends Component {

    constructor(props) {
           super(props);
           this.state = {
             location:"",
             centroid:"",
             title:"",
             members:[],
             level:0,
             radius:0,
             events:[],
             associatedlocalgroups:[],
             allmembers:[],
             allgroupsbelow:[],
             higherlevelgroup:'',
             groupData:{},
             newLowerGroupIds:[],
             id:'',
             rules: [],
             inthisgroup:false,
             redirect: false,
             updating:false
           }
           this.updateRules= this.updateRules.bind(this)
           this.updateEvents= this.updateEvents.bind(this)
           this.updateUsers= this.updateUsers.bind(this)

              }



              updateRules(newrule){
                console.log("newrule",newrule)
                var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
                rulescopy.push(newrule)
                this.setState({ rules:rulescopy})}

                updateUsers(user){
                  var memberscopy=JSON.parse(JSON.stringify(this.state.members))
                  var updatedUsers = memberscopy.filter(member => !(member._id===user._id));
                  updatedUsers.push(user)
                  this.setState({ members:updatedUsers})
                }

updateEvents(newevent){
  var eventscopy=JSON.parse(JSON.stringify(this.state.events))
  eventscopy.push(newevent)
  this.setState({ events:eventscopy})}



           componentDidMount(){
             this.getGroupData(this.props.match.params.groupId)
}

           async getGroupData(groupid){

                      await fetch("/groups/populategroupmembers/"+groupid).then(res => {
                        return res.json();
                      }).then(blob => {
                  console.log("getting group data",blob['data'][0])
                   this.setState({groupData:blob['data'][0],
                   id:groupid,
                   grouptype:blob['data'][0]['type'],
                   title:blob['data'][0]['title'],
                   location:blob['data'][0]['location'],
                   description:blob['data'][0]['description'],
                   level:blob['data'][0]['level'],
                   associatedlocalgroups:blob['data'][0]['associatedlocalgroups'],
                   groupabove:blob['data'][0]['groupabove'],
                   groupsbelow:blob['data'][0]['groupsbelow'],
                   events:blob['data'][0]['events'],
                   allmembers:blob['data'][0]['allmembers'],
                   rules: blob['data'][0]['rules'],
                   centroid: blob['data'][0]['centroid'],
                   radius: blob['data'][0]['radius'],
                   members: blob['data'][0]['members']})
                   var memberids=blob['data'][0]['members'].map(item=>{return item._id})
                   console.log("members", memberids)

                   console.log("user",auth.isAuthenticated().user._id)
                   var latlongroupcentroid={lat: blob['data'][0]['centroid'][0], lon: blob['data'][0]['centroid'][1]}
                  var latlonusercentroid={lat: auth.isAuthenticated().user.coordinates[0], lon: auth.isAuthenticated().user.coordinates[1]}

                         var dist = geodist(latlongroupcentroid, latlonusercentroid)
                         console.log("DISTANCE!!!!!!!!!",dist)
                    if(memberids.includes(auth.isAuthenticated().user._id)){
                      this.setState({inthisgroup:true})
                    }else{
                      this.setState({inthisgroup:false})
                    }
                   if(blob['data'][0]['location']){
                     this.setState({location:blob['data'][0]['location']})
                   }



this.checkruleapproval()
this.checkeventapproval()

           })

         }


         async deleteEvent(item){


           var eventscopy=JSON.parse(JSON.stringify(this.state.events))
           function checkEvent(event) {
             return event._id!=item._id
           }

               var filteredapproval=eventscopy.filter(checkEvent)
         console.log(filteredapproval)

           this.setState({events:filteredapproval})


           const options = {
             method: 'delete',
             headers: {
               'Content-Type': 'application/json'
             },
                body: ''
           }

           await fetch("/events/"+item._id, options)


         const optionstwo = {
         method: 'put',
         headers: {
         'Content-Type': 'application/json'
         },
         body: ''
         }

         await fetch("/groups/removeeventfromgroup/"+this.state.id+"/"+item._id, optionstwo)

         }



async deleteRule(item){


  var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
  function checkRule(rule) {
    return rule._id!=item._id
  }

      var filteredapproval=rulescopy.filter(checkRule)
console.log(filteredapproval)

  this.setState({rules:filteredapproval})


  const options = {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
       body: ''
  }

  await fetch("/rules/"+item._id, options)


const optionstwo = {
method: 'put',
headers: {
'Content-Type': 'application/json'
},
body: ''
}

await fetch("/groups/removerulefromgroup/"+this.state.id+"/"+item._id, optionstwo)

}

checkeventapproval(){
  var d = new Date();
  var n = d.getTime();


for (var item of this.state.events){
  var memberids=this.state.members.map(item=>{return item._id})
  var peoplewhoapproveincurrentgroup=item.approval.filter(approvee => memberids.includes(approvee))
  var approval=peoplewhoapproveincurrentgroup.length/this.state.members.length*100
var wholegroup=item.approval.filter(approvee=>item.group.allmembers.includes(approvee))
var wholegroupapproval=wholegroup.length/item.group.allmembers.length*100

if(wholegroupapproval<50&&(n-item.timecreated)>2592000000){
this.deleteEvent(item)
}
if(approval<50&&(n-item.timecreated)>604800000&&wholegroupapproval<50){
this.deleteEvent(item)
}


if(approval>=50&&this.state.associatedlocalgroups){
  for (var localgroup of this.state.associatedlocalgroups){
  console.log("item.sentdown",item.sentdown)

  if(!item.sentdown){
  this.sendEventDown(this.state.level,this.state.id,item,this.state.groupData,localgroup._id)
  }
  }
}
}
}

checkruleapproval(){
  var d = new Date();
  var n = d.getTime();


for (var item of this.state.rules){
  var memberids=this.state.members.map(item=>{return item._id})
  var peoplewhoapproveincurrentgroup=item.approval.filter(approvee => memberids.includes(approvee))
  var approval=peoplewhoapproveincurrentgroup.length/this.state.members.length*100
var wholegroup=item.approval.filter(approvee=>item.group.allmembers.includes(approvee))
var wholegroupapproval=wholegroup.length/item.group.allmembers.length*100

if(wholegroupapproval<50&&(n-item.timecreated)>2592000000){
this.deleteRule(item)
}
if(approval<50&&(n-item.timecreated)>604800000&&wholegroupapproval<50){
this.deleteRule(item)
}

if(approval>=50&&this.state.associatedlocalgroups){
  for (var localgroup of this.state.associatedlocalgroups){
  console.log("item.sentdown",item.sentdown)

  if(!item.sentdown){
  this.sendRuleDown(this.state.level,this.state.id,item,this.state.groupData,localgroup._id)
  }
  }
}
}
}






        async sendRuleDown(level,groupid,rule,groupData,localgroupid) {

  console.log("sending rule down",rule,localgroupid)
            const options = {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
                 body: ''
            }

            await fetch("/groups/addruletogroup/"+localgroupid+"/"+rule._id, options)

            const optionstwo = {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
                 body: ''
            }

            fetch("/rules/markrulesentdown/" + rule._id, optionstwo
           ).then(res => {
           console.log(res);
           }).catch(err => {
           console.log(err);
           })

    }

    async sendEventDown(level,groupid,ev,groupData,localgroupid) {
console.log("level,groupid,ev,groupData,localgroupid",level,groupid,ev._id,groupData,localgroupid)
console.log("eventId",ev._id)

        const options = {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
             body: ''
        }

        await fetch("/groups/addeventtogroup/"+localgroupid+"/"+ev._id, options)

        const optionstwo = {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
             body: ''
        }

        fetch("/events/markeventsentdown/" + ev._id, optionstwo
       ).then(res => {
       console.log(res);
       }).catch(err => {
       console.log(err);
       })

}








       approveofrule(e,id){
var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
function checkRule() {
  return id!==auth.isAuthenticated().user._id
}
for (var rule of rulescopy){
  if (rule._id==id){

 if(!rule.approval.includes(auth.isAuthenticated().user._id)){
   rule.approval.push(auth.isAuthenticated().user._id)
 }

this.setState({rules:rulescopy})
  }
}

this.setState({rules:rulescopy})
         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/rules/approveofrule/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}


       withdrawapprovalofrule(e,id){
         var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
         function checkRule(userid) {
           return userid!=auth.isAuthenticated().user._id
         }
         for (var rule of rulescopy){
           if (rule._id==id){


             var filteredapproval=rule.approval.filter(checkRule)
             rule.approval=filteredapproval
           }
         }
         this.setState({rules:rulescopy})

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/rules/withdrawapprovalofrule/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

       }


       approveofevent(e,id){
var eventscopy=JSON.parse(JSON.stringify(this.state.events))
function checkEvent() {
  return id!==auth.isAuthenticated().user._id
}
for (var ev of eventscopy){
  if (ev._id==id){

 if(!ev.approval.includes(auth.isAuthenticated().user._id)){
   ev.approval.push(auth.isAuthenticated().user._id)
 }

this.setState({events:eventscopy})
  }
}

this.setState({events:eventscopy})
         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/events/approveofevent/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}


       withdrawapprovalofevent(e,id){
         var eventscopy=JSON.parse(JSON.stringify(this.state.events))
         function checkEvent(userid) {
           return userid!=auth.isAuthenticated().user._id
         }
         for (var ev of eventscopy){
           if (ev._id==id){


             var filteredapproval=ev.approval.filter(checkEvent)
             ev.approval=filteredapproval
           }
         }
         this.setState({events:eventscopy})

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/events/withdrawapprovalofevent/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

       }



       join(e){

         var supergrouptitles=auth.isAuthenticated().user.supergroups.map(group=>{return group.title})

         for (var supergroup of supergrouptitles){
           if(supergroup==this.state.title){

           for(var group of auth.isAuthenticated().user.groupstheybelongto){
           if (group.title==supergroup&&group.level==0){
             const options = {
               method: 'put',
               headers: {
                 'Content-Type': 'application/json'
               },
                  body: ''
             }

             fetch("/groups/leave/"+group._id+"/"+ auth.isAuthenticated().user._id, options
    )  .then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
           }
         }
       }
     }

         var memberscopy=[...this.state.members]
         memberscopy.push(auth.isAuthenticated().user._id)

         this.setState({members: memberscopy});

         const optionstwo = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/groups/join/"+this.props.match.params.groupId+"/"+ auth.isAuthenticated().user._id, optionstwo
)  .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch(this.props.match.params.groupId).then(res => {
    return res.json();
  }).then(blob => {

this.setState({members: blob.members});
  })


       }

       leave(e){
         var memberscopy=[...this.state.members]
         var filteredarray = memberscopy.filter(function( obj ) {
    return obj._id !== auth.isAuthenticated().user._id;
});
         this.setState({members:filteredarray});

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/groups/leave/"+this.props.match.params.groupId+"/"+ auth.isAuthenticated().user._id, options
)  .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

       }







  render() {





var rulescomponent=<h3>no rules</h3>
if (this.state.members&&this.state.rules&&this.props.match.params.groupId){

  rulescomponent=this.state.rules.map(item => {


    var memberids=this.state.members.map(item=>{return item._id})

    var peoplewhoapproveincurrentgroup=item.approval.filter(approvee => memberids.includes(approvee))
    var approval=peoplewhoapproveincurrentgroup.length/this.state.members.length*100

    if(item.group){
      var wholegroup=item.approval.filter(approvee=>item.group.allmembers.includes(approvee))
      var wholegroupapproval=wholegroup.length/item.group.allmembers.length*100
      console.log("wholegroupapproval",item.approval.length,item.group.allmembers.length,wholegroupapproval,wholegroup.length,item.group.allmembers)
      var wholegroupapprovalcomponent=<h5>{Math.round(wholegroupapproval)}% Approval overall in all groups considering this rule, {wholegroup.length} out of {item.group.allmembers.length} members</h5>

    }

    if(item.explanation){
      var explanation=<h5>Explanation:{item.explanation}</h5>

    }
    var approvalcomponent=<h5>{Math.round(approval)}% Approval in this particular group, {peoplewhoapproveincurrentgroup.length} out of {this.state.members.length} members</h5>

    var d = new Date();
    var n = d.getTime();
    var timesincecreation=`${Math.round((n-item.timecreated)/86400000)} days since creation `
    var daysleftforhigherapproval=`${7-Math.round((n-item.timecreated)/86400000)} days left to approve this rule to be suggested to lower groups`
    var daysleftforapproval=`${7-Math.round((n-item.timecreated)/86400000)} days left to approve this rule`

    if(item.group){
      var daysleftforlowerapproval=`${31-Math.round((n-item.timecreated)/86400000)} days left to approve by all related local groups.`
    }


    return(

      <div key={item._id}>
      <hr/>
      <h4>{item.rule}</h4>
  <h4>Rule Level:{item.level}</h4>
  {explanation}
  {item.approval.includes(auth.isAuthenticated().user._id)&&<h4>You have approved this rule</h4>}
  {item.approval.includes(auth.isAuthenticated().user._id)&&approval<3&&<h4>Try to persuade other members of why this is a good idea</h4>}
  {!item.approval.includes(auth.isAuthenticated().user._id)&&<button onClick={(e)=>this.approveofrule(e,item._id)}>Approve this rule?</button>}

  {item.approval.includes(auth.isAuthenticated().user._id)&&<button onClick={(e)=>this.withdrawapprovalofrule(e,item._id)}>Withdraw Approval?</button>}
<button onClick={(e)=>this.seeWhoApproves(e,item.approval)}>See who approves?</button>

          <div>
           {(approval<50)&&approvalcomponent}
           {(approval>50)&&wholegroupapprovalcomponent&&wholegroupapprovalcomponent}

           {timesincecreation}
           {(approval<50)&&this.state.level>0&&daysleftforhigherapproval&&daysleftforhigherapproval}
           {approval<50&&this.state.level>0&&daysleftforlowerapproval&&daysleftforlowerapproval}
           {approval<50&&this.state.level==0&&daysleftforapproval&&daysleftforapproval}


          </div>
          <br/>
      </div>
    )
  })}




            var eventscomponent=<h3>no events</h3>
            if (this.state.members&&this.state.events&&this.props.match.params.groupId){

              eventscomponent=this.state.events.map(item => {


                var memberidstwo=this.state.members.map(item=>{return item._id})

                var peoplewhoapproveincurrentgroup=item.approval.filter(approvee => memberidstwo.includes(approvee))

                var approval=peoplewhoapproveincurrentgroup.length/this.state.members.length*100

                if(item.group){
                  var wholegroup=item.approval.filter(approvee=>item.group.allmembers.includes(approvee))
                  var wholegroupapproval=wholegroup.length/item.group.allmembers.length*100
                  console.log("wholegroupapproval",item.approval.length,item.group.allmembers.length,wholegroupapproval,wholegroup.length,item.group.allmembers)
                  var wholegroupapprovalcomponent=<h5>{Math.round(wholegroupapproval)}% Attendance in all groups considering this event, {wholegroup.length} out of {item.group.allmembers.length} members</h5>

                }

                if(item.description){
                  var description=<h5>Description:{item.description}</h5>

                }
                if(item.location){
                  var location=<h5>Location:{item.location}</h5>

                }
                var images=<h5>No Images</h5>
                if(item.images.length>0){
                  console.log("images")
                  for (var img of item.images){
                    console.log("img",img)
                  }
                   images=item.images.map(item=>{return <Image style={{width:200}} cloudName="julianbullmagic" publicId={item} />})

                }
                var approvalcomponent=<h5>{Math.round(approval)}% Approval in this particular event, {peoplewhoapproveincurrentgroup.length} out of {this.state.members.length} members</h5>

                var d = new Date();
                var n = d.getTime();
                var timesincecreation=`${Math.round((n-item.timecreated)/86400000)} days since creation `
                var daysleftforhigherapproval=`${7-Math.round((n-item.timecreated)/86400000)} days left to approve this event to be suggested to lower groups`
                var daysleftforapproval=`${7-Math.round((n-item.timecreated)/86400000)} days left to approve this event`

                if(item.group){
                  var daysleftforlowerapproval=`${31-Math.round((n-item.timecreated)/86400000)} days left to approve by all related local groups.`
                }
console.log("radius and centroid",this.state.radius,this.state.centroid)

                return(

                  <div key={item._id}>
                  <hr/>
                  <h4>{item.title}</h4>
              <h4>Item Level:{item.level}</h4>
              {description}
              {location}
              {images}
              {item.approval.includes(auth.isAuthenticated().user._id)&&<h4>You are attending this event</h4>}
              {item.approval.includes(auth.isAuthenticated().user._id)&&approval<3&&<h4>Try to persuade other members of why this event is a good idea</h4>}
              {!item.approval.includes(auth.isAuthenticated().user._id)&&<button onClick={(e)=>this.approveofevent(e,item._id)}>Attend this event?</button>}

              {item.approval.includes(auth.isAuthenticated().user._id)&&<button onClick={(e)=>this.withdrawapprovalofevent(e,item._id)}>Don't want to attend anymore?</button>}

                      <div>
                       {(approval<50)&&approvalcomponent}
                       {(approval>50)&&wholegroupapprovalcomponent&&wholegroupapprovalcomponent}

                       {timesincecreation}
                       {(approval<50)&&this.state.level>0&&daysleftforhigherapproval&&daysleftforhigherapproval}
                       {approval<50&&this.state.level>0&&daysleftforlowerapproval&&daysleftforlowerapproval}
                       {approval<50&&this.state.level==0&&daysleftforapproval&&daysleftforapproval}
                      </div>
                      <br/>
                  </div>
                )
              })}






var joinOrLeave=<h1></h1>

console.log("level",this.state.level)
var memberids=this.state.members.map(item=>{return item._id})
console.log(memberids)
console.log(auth.isAuthenticated().user._id)
if(this.state.level==0){

        if(memberids.includes(auth.isAuthenticated().user._id)){
          joinOrLeave=<><button onClick={(e)=>this.leave(e)}>Leave Group?</button></>
        }else{
            joinOrLeave=<><button onClick={(e)=>this.join(e)}>Join Group?</button></>
        }
}



console.log("state",this.state)
var restricted=this.state.members.filter(member => (member._id===auth.isAuthenticated().user._id))
console.log("restricted",restricted[0])
var restrict=[]
var inthisgroup=[]
if(restricted[0]){
  var restrictions=restricted[0]['restrictions']
  console.log("restrictions",restrictions)
  for (var res of restrictions){
    var latlongroup={lat: this.state.centroid[0], lon: this.state.centroid[1]}
    var latlonrestriction={lat: res.centre[0], lon: res.centre[1]}
    console.log("coords",latlongroup,latlonrestriction)
    var dist = geodist(latlongroup, latlonrestriction)
    console.log("dist and radius",dist,this.state)
    if (dist<=this.state.radius){
      inthisgroup.push(res)
    }
  }
  console.log("inthisgroup",inthisgroup)

   restrict=inthisgroup.map(item=>{return item.restriction})
  console.log("restrict",restrict)
}

console.log("level and location",this.state.level,this.state.location)

    return (
      <>

      {restrict.includes("This member has been banned")&&<><br/><br/><h1>You have been banned from this group</h1></>}
      {!restrict.includes("This member has been banned")&&<><div>
      <br/>
      <br/>
      <h2>Group Details</h2>
      {this.state.title&&<p>Group Title: <strong> {this.state.title}</strong></p>}
      {this.state.location&&<p>Location: <strong> {this.state.location}</strong></p>}
      {this.state.description&&<p>Description: <strong> {this.state.description}</strong></p>}
      {joinOrLeave}
      {this.state.groupabove&&
      <><h2>Group Above</h2><Link className="gotogroup" exact to={"/groups/" + this.state.groupabove._id}><h2>Group Above {this.state.title&&this.state.title}{this.state.groupabove.location}</h2></Link></>}
      {this.state.groupsbelow&&<h2>Groups below</h2>}
      {this.state.groupsbelow&&this.state.groupsbelow.map(item=>
      {return <Link className="gotogroup" exact to={"/groups/" + item._id}> <h5>Group Below {item.title&&item.title}{item.location}</h5></Link>})}
      {this.state.groupsbelow&&(this.state.level==1)&&this.state.groupsbelow.map(item=>
      {return <Link className="gotogroup" exact to={"/groups/" + item._id}> <h5>Group Below {item.title&&item.title}{item.location}</h5></Link>})}
      {restrict.includes("This member cannot post")&&<><h2>You cannot post</h2></>}

      {!restrict.includes("This member cannot post")&&<Newsfeed groupId={this.state.id} group={this.state.groupData} inthisgroup={this.state.inthisgroup} canComment={restrict.includes("This member cannot comment")}/>}
      {restrict.includes("This member cannot propose rules, events or candidates")&&<><h2>You cannot propose rules, events or candidates</h2></>}
      {!restrict.includes("This member cannot propose rules, events or candidates")&&this.state.inthisgroup&&<h2>Propose a Rule</h2>}
      {!restrict.includes("This member cannot propose rules, events or candidates")&&this.state.inthisgroup&&<CreateRuleForm group={this.state.groupData} id={this.state.id} level={this.state.level} updateRules={this.updateRules}/>}
      <h2>Group Rules: <strong>   {rulescomponent} </strong></h2>
      {!restrict.includes("This member cannot propose rules, events or candidates")&&this.state.inthisgroup&&<h2>Propose an Event</h2>}
      {!restrict.includes("This member cannot propose rules, events or candidates")&&this.state.inthisgroup&&<CreateEventForm group={this.state.groupData} id={this.state.id} grouptype={this.state.grouptype} higherlower={this.state.highorlow} level={this.state.level} updateEvents={this.updateEvents}/>}
      <h2>Group Events: <strong>   {eventscomponent} </strong></h2>
      {!restrict.includes("This member cannot propose rules, events or candidates")&&this.state.groupData&&<ExpertComponent groupData={this.state.groupData}/>}
      <ChatPage/>
      {this.state.members&&<UserRatings users={this.state.members} groupid={this.state.id} grouptitle={this.state.title} grouplevel={this.state.level} grouplocation={this.state.location} radius={this.state.radius} centroid={this.state.centroid} updateUsers={this.updateUsers}/>}
      </div></>}
      </>
    );
  }
}



export default SingleGroupPage;
