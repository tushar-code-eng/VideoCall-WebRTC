import React from 'react'
import './Home.css'
import homeImage from '../photos/homeImage.webp'
import { signInWithPopup } from 'firebase/auth'
import {auth,provider} from '../firebase.js'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = ({email,setEmail,name,setName,pic,setPic}) => {

    const navigate = useNavigate()

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
        if(email){
            navigate(`/`)
        }
        setEmail(localStorage.getItem("email"))
        setName(localStorage.getItem("name"))
        setPic(localStorage.getItem("pic"))

      },[email])

  return (
    <div className='homeContainer'>
      <div className="text">
        <h1 className='homeh1'>Video calls with anyone, anywhere</h1>
        <p className='homepara'>Stay connected and collaborate with friends, family and colleagues no matter where you are</p>
        {<button className='homeSignInbutton' onClick={handleSignIn}>Sign In</button>}
      </div>
      <img src={homeImage} alt="" className="homeImage" />
    </div>
  )
}

export default Home
