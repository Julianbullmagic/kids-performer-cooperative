import React, {useState, useEffect} from 'react'
import Expertfeed from './../post/Expertfeed'
import auth from './../auth/auth-helper'

const mongoose = require("mongoose");


export default function ExpertComponent(props) {

const [loading, setLoading] = useState(false);
const [groupData, setGroupData] = useState({});
const [toggleNominations, setToggleNominations] = useState(false);
const [toggleViewCandidates, setToggleViewCandidates] = useState(false);



useEffect(() => {
      setGroupData(props.groupData);
  }, [props])
if(groupData){
  console.log("groupData",groupData.members)
}

function toggleNominationsFunction(){
  setToggleNominations(!toggleNominations)
}


function toggleViewCandidatesFunction(){
  setToggleViewCandidates(!toggleViewCandidates)
}







      function approve(e,candidateId){


var userId=auth.isAuthenticated().user._id

var candidatesCopy=JSON.parse(JSON.stringify(groupData.expertcandidates))

        for (const candidate of candidatesCopy) {

          if (candidate._id==candidateId){
          const included=candidate.votes.includes(userId)

          if(!included){
            candidate.votes.push(auth.isAuthenticated().user._id)

            setGroupData({...groupData,expertcandidates:candidatesCopy})

          }
        }
      }


        }

   function giveapproval(e,candidateId){
approve(e,candidateId)

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/groups/approveofcandidate/" + candidateId +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}




function disapprove(e,candidateId){


var userId=auth.isAuthenticated().user._id

var candidatesCopy=JSON.parse(JSON.stringify(groupData.expertcandidates))


  for (const candidate of candidatesCopy) {

    if (candidate._id==candidateId){


    const included=candidate.votes.includes(userId)

    if(included){

      for (let i = 0; i < candidate.votes.length; i++) {
        if (candidate['votes'][i] == auth.isAuthenticated().user._id) {
          candidate.votes.splice(i, 1);
        }
      }



    }
  }
  }
  setGroupData({...groupData,expertcandidates:candidatesCopy})

  }

function givedisapproval(e,candidateId){
disapprove(e,candidateId)

   const options = {
     method: 'put',
     headers: {
       'Content-Type': 'application/json'
     },
        body: ''
   }

   fetch("/groups/withdrawapprovalofcandidate/" + candidateId +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})

}







      function nominate(e,nomineeId,nomineeName,nomineeexpertise){


console.log("nominee id",nomineeId)
  const newCandidate= {
    _id:mongoose.Types.ObjectId(),
    userId:nomineeId,
    groupId:groupData._id,
    name: nomineeName,
    level:groupData.level,
    expertise:nomineeexpertise,
    timecreated:new Date().getTime(),
    votes:[auth.isAuthenticated().user._id]
  }
console.log("new candidate",newCandidate)

  var justnames=groupData.expertcandidates.map(item=>{return item.name})
console.log("candidates",groupData.expertcandidates,justnames,groupData,newCandidate)

if(!justnames.includes(newCandidate.name)){


  var candidatesCopy=JSON.parse(JSON.stringify(groupData.expertcandidates))
  candidatesCopy.push(newCandidate)
  setGroupData({...groupData,expertcandidates:candidatesCopy})



  const options = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
     body: JSON.stringify(newCandidate)
  }

  fetch("/groups/nominatecandidate/", options
  ).then(res => res.json())
  .then(res => {
console.log(res)
addNomineeToGroupObject(res.id)
  }).catch(err => {
  console.log(err);
  })

}

}



function addNomineeToGroupObject(candidateId){
  console.log("candidateId and groupId",candidateId,groupData._id)
  const options2 = {
  method: 'put',
  headers: {
    'Content-Type': 'application/json'
  },
     body: ''
}

fetch("/groups/addnomineetogroupobject/" + candidateId + "/" +groupData._id, options2
) .then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})
}





      function removeCandidate(nomineeId,groupId){

             const options = {
             method: 'delete',
             headers: {
               'Content-Type': 'application/json'
             },
                body: ''
           }

         fetch("/groups/removecandidate/" + nomineeId, options
  ).then(res => res.json())
  .then(res => {
  console.log(res);
  })
  .catch(err => {
      console.log(err);
    })

removeNomineeFromGroupObject(nomineeId,groupId)


}



function removeNomineeFromGroupObject(candidateId,groupId){
  const options = {
  method: 'put',
  headers: {
    'Content-Type': 'application/json'
  },
     body: ''
}

fetch("/groups/removenomineefromgroupobject/" + candidateId + "/" +groupId, options
).then(res => {
  res.json()
})
.then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})
}






var candidatesmapped=<h3>No Candidates</h3>
if(groupData.expertcandidates){
candidatesmapped=groupData.expertcandidates.map(item => {

  let votes=[]
  let approval=<h5></h5>

  if(item.votes){
   votes=[...item.votes]
   if(votes.length==0){
     approval=<h5>No approval</h5>

 }
   if(votes.length==1){
   approval=<h5>{votes.length} member approves of this candidate</h5>
   }
   if(votes.length>1){
   approval=<h5>{votes.length} members approve of this candidate</h5>
 }}

 return(
   <>
   <h3>{item.name}</h3>
<p>{item.expertise}</p>
<p>Candidate Level:{item.level}</p>

<button onClick={(e)=>giveapproval(e,item._id)}>Approve of Candidate?</button>
<button onClick={(e)=>givedisapproval(e,item._id)}>Remove Approval?</button>
{approval}

</>
)})}


var membersmapped=<h3>No Members</h3>

 if(groupData.members){


 membersmapped=groupData.members.map(item => {
   return(
     <>
     <h3>{item.name}</h3>
     <h1>Expertise/skills/qualifications/leadership experience :{item.expertise&&item.expertise}</h1>
 <button onClick={(e)=>nominate(e,item._id,item.name,item.expertise)}>Nominate</button>

 </>
 )
})
}



  return (
    <>

      <h2>Candidates</h2>
      <button id="vote" onClick={(e)=>toggleViewCandidatesFunction(e)}>See nominated candidates</button>
  {toggleViewCandidates&&candidatesmapped}
      <h2>Nominate a group member as a candidate</h2>

  <button id="nominate" onClick={(e)=>toggleNominationsFunction(e)}>Nominate a member for leadership</button>

    {toggleNominations&&<h3>There are no particular election events on Democracy Book. Members can nominate and/or vote for any other
    member at any time. If one member becomes more popular than another they can become leader at any time.The
    elected leaders are servants of the people they represent, if they do not lead the group in a direction that
    is in the best interests of the group, the group can take away authority at any time. Every day, the list of
    nominated candidates is shuffled and then sorted in order from highest to lowest number of votes
    candidates with equal numbers of votes will be ordered randomly. This may mean that if many people have equal numbers
    of votes, each time they refresh the page, they may or may not be a leader. All of this is designed to make leaders feel
    as insecure as possible, to force them to consult with and make the people they represent feel as comfortable as possible
    with them being in charge. You must earn people's respect, you are not entitled to it. Power, in the sense of being able to
    impose your will onto others, is never legitimate. Authority should be grounded in knowledge, wisdom and moral integrity,
    not coercive force. Also, being removed from leadership does not necessarily reflect poorly on you as a person or your
    overall character, your life circumstances may restrit your ability to perform the job effectively. It may not be your
    fault, but the group still needs to have the most capable leaders. We think you are smart enough to understand the common
    sense idea that experts often have valuable advice for us that we should take voluntarily. </h3>}
      {toggleNominations&&membersmapped}
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
      </>


  )}
