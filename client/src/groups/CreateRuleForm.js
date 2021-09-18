import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'
const mongoose = require("mongoose");


export default function CreateRuleForm(props) {
const ruleValue = React.useRef('')
const explanationValue = React.useRef('')

const [toggle, setToggle] = useState(false);



async function handleSubmit(e) {
e.preventDefault()
    var d = new Date();
    var n = d.getTime();
    var ruleId=mongoose.Types.ObjectId()
    ruleId=ruleId.toString()

    const newRule={
      _id:ruleId,
      rule: ruleValue.current.value,
      explanation:explanationValue.current.value,
      timecreated:n,
      level:props.level,
      grouptype:props.grouptype,
      approval:[auth.isAuthenticated().user._id],
      group:props.id

    }

    const ruleToRender={
      _id:ruleId,
      rule: ruleValue.current.value,
      explanation:explanationValue.current.value,
      timecreated:n,
      level:props.level,
      grouptype:props.grouptype,
      approval:[auth.isAuthenticated().user._id],
      group:props.group
    }




console.log("newPost.group",newRule.group)
    props.updateRules(ruleToRender)
    console.log(newRule)
    const options={
        method: "POST",
        body: JSON.stringify(newRule),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      await fetch("/rules/createrule/"+ruleId, options)
              .then(response => response.json()).then(json => console.log(json));

              const optionstwo = {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json'
                },
                   body: ''
              }

console.log("props.id,ruleId",props.id,ruleId)

    await fetch("/groups/addruletogroup/"+props.id+"/"+ruleId, optionstwo)





}


  return (
    <section className='section search'>

      <form className='search-form'>
        <div className='form-control'>
        <label htmlFor='name'>Rule</label>
        <input
          type='text'
          name='ruleValue'
          id='ruleValue'
          ref={ruleValue}

        />
        <label htmlFor='name'>Explanation</label>
        <input
          type='text'
          name='explanationValue'
          id='explanationValue'
          ref={explanationValue}

        />

        <button onClick={(e) => handleSubmit(e)}>Submit Rule</button>


        </div>
      </form>
    </section>
  )}
