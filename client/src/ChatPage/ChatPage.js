import React, { Component } from 'react'
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import { getChats, getGroupChats, afterPostMessage } from "./../actions/chat_actions"
import ChatCard from "./Sections/ChatCard"
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { CHAT_SERVER } from './Config.js';
import auth from './../auth/auth-helper'


export class ChatPage extends Component {

constructor(props){
  super(props)
  this.state = {
      chatMessage: "",
      groups:[],
      chosengroup:'',
      yourgroups:[],
      group:{},
      chats:[],
      searchedusers:[],
      usersearchvalue:'',
      widthcolumntwo:"0%",
      widthcolumnthree:"60%",
      height:"40%",
      usertomessage:'',
      togglechat:false
  }
  this.handleGroupChange=this.handleGroupChange.bind(this)
  this.handlesearchuser=this.handlesearchuser.bind(this)
this.messageuser=this.messageuser.bind(this)

this.setInitialChats()

}

async setInitialChats(){

    const groupid=await fetch('/groups/findyourgroups/'+auth.isAuthenticated().user._id).then(res => {
       return res.json();
     }).then(blob => {

       this.setState({chosengroup:blob['data'][0]['groupstheybelongto'][0],yourgroups: [...blob['data'][0]['groupstheybelongto']]})
       return blob['data'][0]['groupstheybelongto'][0]['_id']
  })
console.log("groupid",groupid)
  await fetch(`/api/chat/getChats/${groupid}`)
      .then(response => response.json())
      .then(data=>{
        console.log("get chats",data)
        this.setState({chats:data})
      })

}




async handlesearchuser(e){
  e.stopPropagation();
  e.preventDefault()

await fetch(`/api/chat/finduserstomessage/${this.state.searchuservalue}`)
    .then(response => response.json())
    .then(data=>{
      console.log("users",data)
      this.setState({searchedusers:data.data})
    })
    this.setState({widthcolumntwo:"15%",widthcolumnthree:"50%"})
}

async handleGroupChange(event){

  var group=event.target.value
  await fetch(`/api/chat/getChats/${event.target.value}`)
      .then(response => response.json())
      .then(data=>{
        console.log("get chats",data)
        this.setState({chats:data})
      })
      this.setState({chosengroup:group,usertomessage:""})

}




    componentDidMount() {
        let server = "http://localhost:5000";

        this.props.dispatch(getChats());

        this.socket = io(server);


        this.socket.on("Output Chat Message", messageFromBackEnd => {
            console.log("messageFromBackEnd",messageFromBackEnd)
            var chatscopy=JSON.parse(JSON.stringify(this.state.chats))
            chatscopy.push(...messageFromBackEnd)
            this.setState({chats:chatscopy})
        })
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    handleSearchChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })


    }

    handlesearchuserchange = (e) => {
      console.log(e.target.value)
      console.log(this.state.searchuservalue)

        this.setState({
            searchuservalue: e.target.value,
        })

    }


    onDrop = (files) => {
        console.log(files)


        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }



        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])

        Axios.post('api/chat/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    let chatMessage = response.data.url;
                    let userId = auth.isAuthenticated().user._id;
                    let userName = auth.isAuthenticated().user.name;
                    let nowTime = moment();
                    let type = "VideoOrImage"
                    this.socket.emit("Input Chat Message", {
                        chatMessage,
                        userId,
                        userName,
                        nowTime,
                        type
                    });
                }
            })
    }






    submitChatMessage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }


        let groupId=this.state.chosengroup
        let chatMessage = this.state.chatMessage
        let recipient = this.state.usertomessage
        let userId = auth.isAuthenticated().user._id
        let userName = auth.isAuthenticated().user.name;
        let nowTime = moment();
        let type = "Text"

        this.socket.emit("Input Chat Message", {
            chatMessage,
            userId,
            userName,
            groupId,
            nowTime,
            type,
            recipient
        });
        this.setState({ chatMessage: "" })
    }


messageuser(e,userid){
  console.log(userid)
  this.setState({usertomessage:userid,chosengroup:"",widthcolumntwo:"0%",widthcolumnthree:"65%",searchedusers:[]})
  fetch(`/api/chat/getChatsWithParticularUser/${userid}`)
      .then(response => response.json())
      .then(data=>{
        console.log("get chats",data)
        this.setState({chats:data})
      })
}

    render() {

var mappedsearchedusers=this.state.searchedusers.map(user=>{
  return <button onClick={(e)=>this.messageuser(e,user._id)}
 style={{borderRadius:5,padding:"1px",height:"8.5%",width:"90%"}}>{user.name}</button>
})


      console.log(this.state.chosengroup, this.state.chats)
      var chats=  <p>No conversation so far.</p>
console.log("this.state.chats",this.state.chats)
var type=Array.isArray(this.state.chats)
console.log(type)
if(type==true){
  chats=this.state.chats.map(chat =>{
    return (
      <ChatCard key={chat._id}  {...chat} />
    )
  })}

console.log("yourgroups",this.state.yourgroups)
      var mappedgroups=  <option value="no groups">no groups</option>
      if(this.state.groups){
        mappedgroups=this.state.yourgroups.map(group=>{
          return(
              <option key={group._id} value={group._id}>{group.title||group.location}</option>
          )
        })
      }return (
            <React.Fragment  >

            <div style={{height:this.state.height}} className="chat">
                <div className="chatcoloumn1">
                <button style={{padding:"1px",borderRadius:"5px"}} onClick={() => {
              this.setState({ togglechat:!this.state.togglechat,height:this.state.togglechat?"40vh":"6vh"});
            }}>View Chat</button>
<div className="chatrow1">
<h2 style={{margin:"5px"}}>Choose a Group to chat with</h2>
<form onSubmit={this.setGroup}>
  <div >
    <label style={{margin:"5px"}} htmlFor="room">Group</label>
    <select style={{margin:"5px"}} name="room" id="room" onChange={this.handleGroupChange}>
      {mappedgroups}
    </select>
  </div>
  </form>
  </div>

<div className="chatrow2">
<form>

<input style={{margin:"5px"}}
placeholder="Search for user to message"
type="text"
value={this.state.searchuservalue}
onChange={this.handlesearchuserchange}></input>

<button onClick={this.handlesearchuser}>Search for user to message</button>

    </form>
    <form>

    <input style={{margin:"5px"}}
    placeholder="Let's start talking"
    type="text"
    value={this.state.chatMessage}
    onChange={this.handleSearchChange}></input>



            <button onClick={this.submitChatMessage}>Submit Message</button>

        </form>
    </div>
</div>

<div style={{border:"white", borderStyle: "solid",borderWidth:"5px",margin:"10px",width:this.state.widthcolumntwo}} className="chatcoloumn2">

{this.state.searchedusers&&mappedsearchedusers}

</div>
                <div style={{border:"white", borderStyle: "solid",borderWidth:"5px",margin:"10px",width:this.state.widthcolumnthree}} className="chatcoloumn3">

                    <div style={{ width:"90%",height: "90%",background:"#efefef",margin:"10px",  overflowY: 'scroll' }}>
                        {chats}
                        <div
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                            style={{clear: "both" }}
                        />
                    </div>


                            </div>
                            </div>



            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        chats: state.chat
    }
}


export default connect(mapStateToProps)(ChatPage);
