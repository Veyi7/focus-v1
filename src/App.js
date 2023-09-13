import './App.css';
import api from './api/axiosConfig';
import {useState,  useEffect} from 'react';
import Layout from './components/Layout';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home';
import Calendar from './components/calendar/Calendar';
import Modify from './components/modify/Modify'
import Create from './components/create/Create';
import Login from './components/login/Login';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1GY_zDCrvFwHZLG85ivSbiXLWcBLK3z0",
  authDomain: "focusapp-c58cf.firebaseapp.com",
  projectId: "focusapp-c58cf",
  storageBucket: "focusapp-c58cf.appspot.com",
  messagingSenderId: "227244550985",
  appId: "1:227244550985:web:ab88c7ff75c3d4858a0898"
};

function App() {

  const [tasks, setTasks] = useState();

  const app = initializeApp(firebaseConfig);

  const getTasks = async () => {
    try {
      const response = await api.get("/task/all");
      setTasks(response.data);
    } 
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    //getTasks();
  },[])

  return (
    <div className="App">
      <Routes>
        <Route>
          {<Route exact path="/" element={<Login/>} ></Route>}
        </Route>
        <Route>
          {<Route path="/home" element={<Home/>} ></Route>}
        </Route>
        <Route>
          {<Route path="/calendar" element={<Calendar/>} ></Route>}
        </Route>
        <Route>
          {<Route path="/modify/:id" element={<Modify/>}></Route>}
        </Route>
        <Route>
          {<Route path="/create" element={<Create/>}></Route>}
        </Route>
        {/* <Route path="/pomodoro" element={<Pomodoro/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
