import React, { Component } from 'react'
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import Axios from 'axios';
import auth from './../auth/auth-helper'
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
const mongoose = require("mongoose");


export class UserRatingForm extends Component {

constructor(props){
  super(props)
  this.state = {
    groupId:props.groupId,
    user:props.user,
    groupsize:props.groupsize,
    grouptitle:props.grouptitle,
    grouplevel:props.grouplevel,
    grouplocation:props.grouplocation,
    message:'',
    average:5,
    stars:5,
    reviews:[],
    explanation:'',
  }
  this.handleStarsChange=this.handleStarsChange.bind(this)
  this.handleExplanationChange=this.handleExplanationChange.bind(this)
  this.sumbitReview=this.submitReview.bind(this)

this.getReviews()

}


componentWillReceiveProps(nextProps) {
        if(nextProps.groupId){
          this.setState({group:nextProps.groupId});
        }
        if(nextProps.user){
          this.setState({user:nextProps.user});
        }
        if(nextProps.groupsize){
          this.setState({groupsize:nextProps.groupsize});
        }
        if(nextProps.centroid){
          this.setState({centroid:nextProps.centroid});
        }
        if(nextProps.radius){
          this.setState({radius:nextProps.radius});
        }
        if(nextProps.grouptitle){
          this.setState({grouptitle:nextProps.grouptitle});
        }
        if(nextProps.grouplevel){
          this.setState({grouplevel:nextProps.grouplevel});
        }
        if(nextProps.grouplocation){
          this.setState({grouplocation:nextProps.grouplocation});
        }
    }

async getReviews(){

    const groupid=await fetch('/groups/findreviews/'+this.state.groupId+'/'+this.state.user._id).then(res => {
       return res.json();
     }).then(blob => {
       console.log("reviews",blob['data'])
       this.getAverage(blob['data'])
       this.setState({reviews:blob['data']})
  })

}


async getAverage(reviews){
  var reviewsvalues=reviews.map(review=>{return review.rating})
  var sum=reviewsvalues.reduce(getSum, 0);

  function getSum(total, num) {
    return total + num;
  }

  var average=(((this.state.groupsize-reviews.length)*5)+sum)/this.state.groupsize
  console.log("average",average,sum)
  var message=""

  this.setState({average:average})
  var restrictions=this.state.user.restrictions.map(restriction=>{return restriction.restriction})
  if (average<2){
if(!restrictions.includes("This member cannot post")){
  this.filterOutRiffRaff("This member cannot post",average,restrictions)
}
if(!restrictions.includes("This member cannot comment")){
  this.filterOutRiffRaff("This member cannot comment",average,restrictions)
}
if(!restrictions.includes("This member cannot propose rules, events or candidates")){
  this.filterOutRiffRaff("This member cannot propose rules, events or candidates",average,restrictions)
}
if(!restrictions.includes("This member has been banned")){
  this.filterOutRiffRaff("This member has been banned",average,restrictions)
}
}
}


updateUsers(user){
  this.props.updateUsers(user);
}

async filterOutRiffRaff(restriction,average,restrictions){
  var d = new Date();
  var n = d.getTime();
  var restrictionid=mongoose.Types.ObjectId()
  restrictionid=restrictionid.toString()
console.log("grouptitle in form",this.state.grouptitle,this.state.grouplevel,this.state.grouplocation)
  var newRestriction={
    _id: restrictionid,
    grouptitle:this.state.grouptitle,
    grouplocation:this.state.grouplocation,
    grouplevel:this.state.grouplevel,
    userId:this.state.user._id,
    centre:this.state.centroid,
    radius:this.state.radius,
    timecreated:n,
  }

  if (average<2&&restriction=="This member cannot post"){
    console.log("restrictions!!!!!!",restrictions)
    var message="This member cannot post"
    this.setState({message:message})
    newRestriction.restriction="This member cannot post"
    var userrestrictionscopy=JSON.parse(JSON.stringify(this.state.user))
    userrestrictionscopy.restrictions.push(newRestriction)
    this.updateUsers(userrestrictionscopy)
    this.setState({user:userrestrictionscopy})
    this.postRestriction(newRestriction)

  }
  if (average<1.5&&restriction=="This member cannot comment"){
    console.log("restrictions!!!!!!",restrictions)

    var message="This member cannot post or comment"
    this.setState({message:message})
    newRestriction.restriction="This member cannot comment"
    var userrestrictionscopy=JSON.parse(JSON.stringify(this.state.user))
    userrestrictionscopy.restrictions.push(newRestriction)
    this.updateUsers(userrestrictionscopy)
    this.setState({user:userrestrictionscopy})
    this.postRestriction(newRestriction)

  }
  if (average<1&&restriction=="This member cannot propose rules, events or candidates"){
    console.log("restrictions!!!!!!",restrictions)
    var message="This member cannot propose rules, events or candidates. They cannot make posts or comments"
    this.setState({message:message})
    newRestriction.restriction="This member cannot propose rules, events or candidates"
    var userrestrictionscopy=JSON.parse(JSON.stringify(this.state.user))
    userrestrictionscopy.restrictions.push(newRestriction)
    this.updateUsers(userrestrictionscopy)
    this.setState({user:userrestrictionscopy})
    this.postRestriction(newRestriction)

  }
  if (average<0.5&&restriction=="This member has been banned"){
    console.log("restrictions!!!!!!",restrictions)

    var message="This member has been banned"
    this.setState({message:message})
    newRestriction.restriction="This member has been banned"
    var userrestrictionscopy=JSON.parse(JSON.stringify(this.state.user))
    userrestrictionscopy.restrictions.push(newRestriction)
      this.updateUsers(userrestrictionscopy)
    this.setState({user:userrestrictionscopy})
    this.postRestriction(newRestriction)
  }
  console.log("restrictions!!!!!!",restrictions)


console.log("newRestriction",newRestriction)



}

async postRestriction(newRestriction){
  const options={
      method: "POST",
      body: JSON.stringify(newRestriction),
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}


           await fetch("/groups/createuserrrestriction", options)
                      .then(response => response.json()).then(json => console.log(json));
    const optionstwo={
        method: "PUT",
        body:'',
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}

             await fetch("/groups/addrestrictiontouser/"+this.state.user._id+"/"+newRestriction._id, optionstwo)
                        .then(response => response.json()).then(json => console.log(json.data));
}

    handleExplanationChange = (e) => {
        this.setState({
            explanation: e.target.value
        })
    }

    handleStarsChange = (e) => {
        this.setState({
            stars: e.target.value
        })
    }








    submitReview = (e) => {
      e.preventDefault();
      var d = new Date();
      var n = d.getTime();
      var reviewid=mongoose.Types.ObjectId()
      reviewid=reviewid.toString()

      const newReview={
        _id:reviewid,
        rating: this.state.stars,
        explanation:this.state.explanation,
        timecreated:n,
        userId:this.state.user._id,
        groupId:this.state.groupId,
        postedBy:auth.isAuthenticated().user._id
      }

var reviewscopy=JSON.parse(JSON.stringify(this.state.reviews))
reviewscopy.push(newReview)
      console.log(newReview)

this.getAverage(reviewscopy)
      this.setState({ stars:5,explanation:'',reviews:reviewscopy })
      const options={
          method: "POST",
          body: JSON.stringify(newReview),
          headers: {
              "Content-type": "application/json; charset=UTF-8"}}


     fetch("/groups/createreview/"+reviewid, options)
                .then(response => response.json()).then(json => console.log(json));
    }




    render() {
var reviewsmapped=this.state.reviews.map(review=>{return(
<><h4>{review.explanation}</h4>
<Rating
       name="hover-feedback"
       value={review.rating}
       precision={0.1}
     />
</>)})

return (
            <React.Fragment>
            <form>


            <input style={{margin:"5px"}}
            placeholder="Rating"
            type="text"
            value={this.state.stars}
            onChange={this.handleStarsChange}></input>
            <input style={{margin:"5px"}}
            placeholder="Explain how you feel about this person"
            type="text"
            value={this.state.explanation}
            onChange={this.handleExplanationChange}></input>

            <button onClick={this.submitReview}>Submit Review</button>
            </form>
            <h5>Average rating={this.state.average}</h5>
            <Rating
                   name="hover-feedback"
                   value={this.state.average}
                   precision={0.1}
                 />
            <h5>{this.state.message}</h5>
            <div className='reviewscroll'>
            {reviewsmapped}
            </div>
            </React.Fragment>
        )
  }
}


export default UserRatingForm;
