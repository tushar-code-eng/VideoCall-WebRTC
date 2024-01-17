import React from 'react'
import './InfoModal.css'
import { useNavigate } from 'react-router-dom'

const InfoModal = ({setinfoModal}) => {
    const navigate = useNavigate()
  return (
    <div className='infoModal' onClick={()=>{setinfoModal(false)}}>
      <div className="modalContainer">
        <div className="emailId">{localStorage.getItem("email")}</div>
        <div className="info">
            <img src={localStorage.getItem("pic")} className="dp" />
            <div className="name">
                Hi,{localStorage.getItem("name")}
            </div>
        </div>
            <button onClick={()=>{
                localStorage.clear()
                navigate(`/home`)
                }}>Sign out</button>
      </div>
    </div>
  )
}

export default InfoModal
