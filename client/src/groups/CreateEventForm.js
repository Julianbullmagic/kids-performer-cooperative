import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'
import Axios from 'axios'
const mongoose = require("mongoose");


export default function CreateRuleForm(props) {
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')
const locationValue = React.useRef('')
const selectedFile1 = React.useRef(null)
const selectedFile2 = React.useRef(null)
const selectedFile3 = React.useRef(null)
const selectedFile4 = React.useRef(null)
const selectedFile5 = React.useRef(null)
const [toggle, setToggle] = useState(false);
const [numberOfImages, setNumberOfImages]=useState(1)

function addImages(){
  var numberplusone=numberOfImages+1

  setNumberOfImages(numberplusone)
}

function lessImages(){
  var numberminusone=numberOfImages-1


  setNumberOfImages(numberminusone);

}


async function handleSubmit(e) {

e.preventDefault()
    var d = new Date();
    var n = d.getTime();
    var eventId=mongoose.Types.ObjectId()
    eventId=eventId.toString()


    const coords=await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${locationValue}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
                      .then(response => response.json())
                        .then(data =>{
                          console.log("DATA",data['features'][0]['center'])
                          return data['features'][0]['center']
                        })

                        let imageids=[]
                        console.log(selectedFile1.current.files[0],selectedFile2.current.files[0],
                          selectedFile3.current.files[0],selectedFile4.current.files[0],selectedFile5.current.files[0])
                      if(selectedFile1.current.files[0]){
                        const formData = new FormData();
                      formData.append('file', selectedFile1.current.files[0]);
                      formData.append("upload_preset", "jvm6p9qv");
                      await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
                      .then(response => {
                        console.log("cloudinary response",response)
                        imageids.push(response.data.public_id)
                      })}

                      if(selectedFile2.current.files[0]){const formData = new FormData();
                      formData.append('file', selectedFile2.current.files[0]);
                      formData.append("upload_preset", "jvm6p9qv");
                      await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
                      .then(response => {
                        console.log("cloudinary response",response)
                        imageids.push(response.data.public_id)
                      })}

                      if(selectedFile3.current.files[0]){const formData = new FormData();
                      formData.append('file', selectedFile3.current.files[0]);
                      formData.append("upload_preset", "jvm6p9qv");
                      await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
                      .then(response => {
                        console.log("cloudinary response",response)
                        imageids.push(response.data.public_id)
                      })}

                      if(selectedFile4.current.files[0]){const formData = new FormData();
                      formData.append('file', selectedFile4.current.files[0]);
                      formData.append("upload_preset", "jvm6p9qv");
                      await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
                      .then(response => {
                        console.log("cloudinary response",response)
                        imageids.push(response.data.public_id)
                      })}

                      if(selectedFile5.current.files[0]){const formData = new FormData();
                      formData.append('file', selectedFile5.current.files[0]);
                      formData.append("upload_preset", "jvm6p9qv");
                      await Axios.post("https://api.cloudinary.com/v1_1/julianbullmagic/image/upload",formData)
                      .then(response => {
                        console.log("cloudinary response",response)
                        imageids.push(response.data.public_id)
                      })}

                      console.log("imageids",imageids)



    const newEvent={
      _id:eventId,
      title: titleValue.current.value,
      description:descriptionValue.current.value,
      location:locationValue.current.value,
      coordinates:coords,
      images:imageids,
      timecreated:n,
      level:props.level,
      grouptype:props.grouptype,
      approval:[auth.isAuthenticated().user._id],
      group:props.id
    }

    console.log("newevent",newEvent)
    const eventToRender={
      _id:eventId,
      title: titleValue.current.value,
      description:descriptionValue.current.value,
      location:locationValue.current.value,
      images:imageids,
      coordinates:coords,
      timecreated:n,
      level:props.level,
      grouptype:props.grouptype,
      approval:[auth.isAuthenticated().user._id],
      group:props.group
    }

console.log("new event",newEvent,eventToRender)
    props.updateEvents(eventToRender)
    console.log(newEvent)
    const options={
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      await fetch("/events/createevent/"+eventId, options)
              .then(response => response.json()).then(json => console.log(json));

              const optionstwo = {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json'
                },
                   body: ''
              }


    await fetch("/groups/addeventtogroup/"+props.id+"/"+eventId, optionstwo)
  }




  return (
    <section className='section search'>

      <form className='search-form'>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='titleValue'
          id='titleValue'
          ref={titleValue}

        />

        <label htmlFor='name'>Description</label>
        <input
          type='text'
          name='descriptionValue'
          id='descriptionValue'
          ref={descriptionValue}
        />
        <label htmlFor='name'>Location</label>
        <input
          type='text'
          name='locationValue'
          id='locationValue'
          ref={locationValue}
        />

        <input id="file" type="file" ref={selectedFile1}/>
        <input id="file2" type="file" ref={selectedFile2}/>
        <input id="file3" type="file" ref={selectedFile3}/>
        <input id="file4" type="file" ref={selectedFile4}/>
        <input id="file5" type="file" ref={selectedFile5}/>

                <button onClick={addImages}>Add another image</button>
                <button onClick={lessImages}>Add one less image</button>

        <button onClick={(e) => handleSubmit(e)}>Submit Event?</button>

        </div>
      </form>
    </section>
  )}
