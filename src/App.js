import './App.css';
import {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home';
import Calendar from './components/calendar/Calendar';
import Modify from './components/modify/Modify'
import Create from './components/create/Create';
import Login from './components/login/Login';
import Pomodoro from './components/pomodoro/Pomodoro';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyC1GY_zDCrvFwHZLG85ivSbiXLWcBLK3z0",
  authDomain: "focusapp-c58cf.firebaseapp.com",
  projectId: "focusapp-c58cf",
  storageBucket: "focusapp-c58cf.appspot.com",
  messagingSenderId: "227244550985",
  appId: "1:227244550985:web:ab88c7ff75c3d4858a0898"
};

function App() {

  const app = initializeApp(firebaseConfig);

  useEffect(() => {
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
        <Route>
          {<Route path="/pomodoro" element={<Pomodoro/>}></Route>}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
