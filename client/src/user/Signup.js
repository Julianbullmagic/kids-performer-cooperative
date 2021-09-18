import React, {useState,useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {create} from './api-user.js'
import {Link} from 'react-router-dom'
import auth from './../auth/auth-helper'
var geodist = require('geodist')
const mongoose = require("mongoose");


const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },

}))

export default function Signup (){
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    password: '',
    coordinates:'',
    groupsCoordinates:'',
    address:'',
    expertise:'',
    email: '',
    error:'',
    open: false,

  })

  useEffect(() => {
    getLocation()
},[])


     function getLocation() {


        fetch('/groups/findgroupscoordinates').then(res => {
           return res.json();

         }).then(blob => {
           console.log("groups coordinates",blob.data)
           setValues({ ...values, groupsCoordinates:blob.data})
         })

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition,showError)}
     else {
    setValues({ ...values, error: "Geolocation is not supported by this browser." })}



}

  function showPosition(position) {
    console.log([position.coords.latitude,position.coords.longitude])
    setValues({ ...values, coordinates: [position.coords.latitude,position.coords.longitude] })
  }

    function showError(error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
        setValues({ ...values, error: "User denied the request for Geolocation." })
          break;
        case error.POSITION_UNAVAILABLE:
        setValues({ ...values, error: "Location information is unavailable." })
          break;
        case error.TIMEOUT:
        setValues({ ...values, error: "The request to get user location timed out." })
          break;
        case error.UNKNOWN_ERROR:
        setValues({ ...values, error: "An unknown error occurred." })
          break;
      }
    }

    function joinLocalGroup(usercoords,groupscoords,userid){

      console.log("joining local group")
console.log(usercoords)
console.log(groupscoords)
console.log(userid)

const distances=groupscoords.map(item=>{
  let dist=calculatedist(item['centroid'],usercoords)
  return {
    id:item['_id'],
    distance:dist,
  }}
)
distances.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
console.log("distances",distances)

const options = {
  method: 'put',
  headers: {
    'Content-Type': 'application/json'
  },
     body: ''
}

fetch("groups/joinlocalgroup/"+distances[0]['id']+"/"+ userid.toString(), options
)  .then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})
return distances[0]['id']
    }

    function calculatedist(groupcoords,usercoords){
      return geodist({lat: usercoords[0], lon: usercoords[1]}, {lat: groupcoords[0], lon: groupcoords[1]})
    }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = (e) => {
    if(values.coordinates){
      console.log("values.coordinates",values.coordinates)
      createUser(values.coordinates)

    }else{
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${values.address}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
      .then(response => response.json())
      .then(data => {
        console.log("mapbox coordinates",[data['features'][0]['center'][1],data['features'][0]['center'][0]])
        createUser([data['features'][0]['center'][1],data['features'][0]['center'][0]])
    })
  }
  }

  function createUser(coords){
    var userId=mongoose.Types.ObjectId()
    var localgroup=joinLocalGroup(values.coordinates,values.groupsCoordinates,userId)
    const user = {
      _id:userId,
      name: values.name || undefined,
      email: values.email || undefined,
      expertise: values.expertise || undefined,
      localgroup:localgroup||undefined,
      coordinates: coords || undefined,
      password: values.password || undefined
    }
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        setValues({ ...values, error: '', open: true})
        console.log("coords",user.coordinates)
      }
    })

  }

    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography id="title" variant="h6" className={classes.title}>
            Sign Up
          </Typography>
          <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <p>Each Democracy Book member is assigned to a local group composed of 40 people or less who are closest to you. If you allow us, we
          can find the geographic coordinates of your computer or if you don't want to be so precise, you could just enter your suburb, city and country below</p>
          <TextField id="address" type="address" label="Address" className={classes.textField} value={values.address} onChange={handleChange('address')} margin="normal"/><br/>
          <p>Democracy book is not just democratic but also technocratic and meritocratic. A democracy in which experts are not empowered to make
          decisions about the things they have knowledge about is really a demagoguery, a disguised form of oligarchy where political participation
          mainly serves to create the illusion of legitimacy for an oppressive/exploitative regime. This is clearly evident in the
          Ancient Athenian and Swiss forms of democracy. Both are "direct democracies", people could directly vote on most issues facing society
          but exploitation are still very common. Slavery was perfectly legal in Athens and Switzerland is on of the least
          socialistic countries in Europe, they don't even have a free public healthcare system, housing is very expensive, most of the
          businesses are capitalist and the finance industry is extremely powerful. In capitalist and other class based countries there are practically
          no academic requirements for leadership and little to ensure the leaders have moral integrity. Being willing and able to exploit
          others does not make you superior. We cannot measure the overall innate worth of a person relative to the very complicated set of
          circumstances that have resulted in them being the person they are, but we can measure their knowledge about particular subjects.
          In democracy book you may be elected to a leadership role,
          please outline your skills, qualifications or degrees in the text input field below. This does not necessarily need to be formal
          education, we invite you
          to try to explain or demonstrate your knowledge by whatever measure or standard you believe is significant. Perhaps you have a
           portfolio or a youtube channel. Some of history's most famous intellectuals or artists outright rejected the concept of
           formal education. Einstein dropped out of high school. The famous American polymath Noam Chomsky claims that “Most schooling is
           training for stupidity and conformity". Formal qualifications can be a valuable way of demonstrating the extent of someone's
           knowledge (especially in the sciences), but they are not the only way. We aim to prevent dogmatism and indoctrination by
           allowing the members of Democracy book to judge each other's qualifications themselves, rather than an oppressive/exploitative
           power imposing their views onto others.</p>
          <TextField id="expertise" type="expertise" label="expertise" className={classes.textField} value={values.expertise} onChange={handleChange('expertise')} margin="normal"/><br/>

          <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)
          }
        </CardContent>
        <CardActions>
        <button id="submit" onClick={clickSubmit}>Submit</button>
        </CardActions>
      </Card>
      <Dialog open={values.open} disableBackdropClick={true}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>)
}
