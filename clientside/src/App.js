import './App.css';
import Lobby from './screens/Lobby';
import {Routes, Route} from 'react-router-dom'
import Room from './screens/Room';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import { useState } from 'react';

function App() {
  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [pic,setPic] = useState('')
  return (
    <div className="App">
      <Navbar email={email} setEmail={setEmail} name={name} setName={setName} pic={pic} setPic={setPic}/>
      <Routes>
        <Route path="/home" element ={<Home email={email} setEmail={setEmail} name={name} setName={setName} pic={pic} setPic={setPic}/>} />
        <Route path="/" element ={<Lobby email={email} setEmail={setEmail} name={name} setName={setName} pic={pic} setPic={setPic}/>} />
        <Route path="/room/:roomId" element ={<Room/>} />
      </Routes>
    </div>
  );
}

export default App;
