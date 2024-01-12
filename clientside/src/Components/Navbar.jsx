import React, { useEffect, useState } from 'react'
import './Navbar.css'
import icon from '../photos/icon.png'
import {auth,provider} from '../firebase.js'
import { signInWithPopup } from 'firebase/auth'

const Navbar = ({email,setEmail,name,setName,pic,setPic}) => {

  
  const handleSignIn = ()=>{
    signInWithPopup(auth,provider).then((data)=>{
      setEmail(data.user.email)
      setName(data.user.displayName)
      setPic(data.user.photoURL)
      localStorage.setItem("email",data.user.email)
      localStorage.setItem("name",data.user.displayName)
      localStorage.setItem("pic",data.user.photoURL)
    })
  }

  useEffect(()=>{
    setEmail(localStorage.getItem("email"))
    setName(localStorage.getItem("name"))
    setPic(localStorage.getItem("pic"))
  },[])


  return (
    <div className='navbarContainer'>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
      <img src={icon} alt="" className="icon" />
      <h1 className='name'>MeetUp</h1>
      </div>
      {email ? 
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"30px"}}>
        <p className='signedInName'>{name}</p>
        <img src={pic} alt="" className='signedInImage'/>
      </div>
      :
      <button className='signinButton' onClick={handleSignIn}>Sign In</button>}
    </div>
  )
}

export default Navbar
