import React, { Component } from 'react'
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import Axios from 'axios';
import auth from './../auth/auth-helper'
import UserRatingForm from './UserRatingForm'

const mongoose = require("mongoose");


export class UserRatings extends Component {

constructor(props){
  super(props)
  this.state = {
      groupid:props.groupid,
      users:props.users,
      radius:props.radius,
      centroid:props.centroid,
      grouptitle:props.grouptitle,
      grouplevel:props.grouplevel,
      grouplocation:props.grouplocation
  }

}

componentWillReceiveProps(nextProps) {
        if(nextProps.groupid){
          this.setState({groupid:nextProps.groupid});
        }
        if(nextProps.grouptitle){
          this.setState({grouptitle:nextProps.grouptitle});
        }
        if(nextProps.centroid){
          this.setState({centroid:nextProps.centroid});
        }
        if(nextProps.radius){
          this.setState({radius:nextProps.radius});
        }
        if(nextProps.users){
          this.setState({users:nextProps.users});
        }
        if(nextProps.groupsize){
          this.setState({groupsize:nextProps.groupsize});
        }
        if(nextProps.grouplevel){
          this.setState({grouplevel:nextProps.grouplevel});
        }
        if(nextProps.grouplocation){
          this.setState({grouplocation:nextProps.grouplocation});
        }
    }



    render() {
      console.log("radius and centroid",this.state.radius,this.state.centroid)
      console.log("grouptitle in user ratings component",this.state.grouptitle,this.state.grouplevel,this.state.grouplocation)

      var usersmapped=<h3>No Candidates</h3>
      if(this.state.users){
      usersmapped=this.state.users.map(item => {
       return(
         <>
         <h3>{item.name}</h3>
      <UserRatingForm user={item} groupId={this.state.groupid} grouptitle={this.state.grouptitle} grouplevel={this.state.grouplevel} grouplocation={this.state.grouplocation} groupsize={this.state.users.length} radius={this.state.radius} centroid={this.state.centroid} updateUsers={this.props.updateUsers}/>
      </>
      )})}




      return (
            <React.Fragment>
            <h3>User Ratings</h3>
{this.state.users&&usersmapped}
                            <p>Ratings are one way in which the rules created by Democracy Book users can be enforced.

                            There are no admins or moderators for you to tell on other members' bad behaviour. If you have a problem
                            with another members actions, it is best to confront them directly in person or through messages. After this,
                            if you are still unsatisfied, you can leave a review. All members can see all reviews of all other members.
                            This gives everyone an oportunity to respond to criticism and it makes the person giving criticism more
                            accountable for their actions. This is designed to make it more difficult for members to slander each other,
                            they must be confident enough in their criticism to submit it for all to see and scrutinize. This sort of thing
                            already happens in most capitalist corporations, except it is almost only the executives and managers who allowed
                            to cast judgements (usually very shallow, poorly informed ones) that have consequences. There is very little reverse accountability. You cannot hire or fire your boss,
                            but they can hire or fire you, possibly depriving you of your means of survival.

                            If you like someone in the group, let them know. If you have a problem with a member, try to constructively criticise
                            their behaviour without making prejudicial judgements about their overall character. Try to to keep in mind
                            that people's lives are very complicated and our personal circumstances can effect how we behave and our
                            character in ways beyond our control. It is not always fair to blame an individual for being the person that
                            they are. Punishments are not always the best way to address apparently immoral behaviour, perhaps
                            if someone has been forced to behave in unethical ways by desperate circumstances. If a child has to steal food
                            because they can't afford to buy it and have noone to buy for them, the solution is to give them food. We all deserve to live and be healthy,
                            physically and psychologically. Someone might have poor social skills because they been surrounded by abusive
                            or untrustworthy people for most of their lives. The solution may be to show them kindness. When we do give punishments
                            they should be designed to demonstrate the fundamental reason why we behave morally, that is, to enjoy the benefits
                            of forming mutually beneficial relationship and the strength in numbers that comes with being part of a harmonious
                            community of equals. If someone has chosen to abuse us, the response should be a proportionate withdrawal of the
                            benefits of having a relationship with us. Each rating should be accompanied by a thorough explanation. If we
                            impose a punishment onto someone and they don't understand or agree with it, we are simply reinforcing their belief
                            that might makes right, and therefore encouraging further unethical behaviour even if the rule is a good one. In some
                            extreme circumstances, perhaps with very violent or dangerous criminals, it may be necessary to forcefully restrain them.
                            It is not always possible to explain to people who are behaving in irrational, immoral ways why they should stop. However,
                            our first line of defence should always be to try to demonstrate and convince someone of why it is good to behave
                            morally and why you can be trusted to form a mutually beneficial relationship as opposed to an imbalanced,
                            exploitative and/or oppressive one. If you cannot be trusted, it may as well be them exploiting and oppressing you
                            because you were just going to do that to them.

                            Often, within a hierarchical organisation, punishments are not given in order to encourage ethical behaviour. Instead,
                            their purpose is to try to break the spirit of someone, to teach them that they are inferior and that they should
                            tolerate being oppressed, abused and exploited.

                            By default, everyone has a five star rating from all other group members. If you agree with this
                            assessment of someone, you can add an explanation of why you like the person. If you give someone a rating below
                            3 stars, that user can no longer see or comment on your posts and vice versa, below 1 stars they cannot send or receive
                            messages and vice versa. If their average rating from all group members drops below 2.5 stars, they are temporarily
                            osctracised (banned) from the group for a day, below 2 stars they are banned for a week, below 1.5 stars banned
                            for a month and 1 star, permanent removal.</p>


            </React.Fragment>
        )
    }
}



export default UserRatings;
