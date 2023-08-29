import './App.css';
import api from './api/axiosConfig';
import {useState,  useEffect} from 'react';
import Layout from './components/Layout';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home';
import Calendar from './components/calendar/Calendar';
import Modify from './components/modify/Modify'
import Create from './components/create/Create';

function App() {

  const [tasks, setTasks] = useState();
  const getTasks = async () => {
    
    try {
      const response = await api.get("/task/all");
 
      setTasks(response.data);
    } 
    catch(err){
      console.log(err);
    }
    
  }
  const actualTask = null;
  useEffect(() => {
    getTasks();
  },[])

  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<Layout/>}>
          {tasks && <Route exact path="/" element={<Home tasks={tasks} />} ></Route>}
        </Route>
        <Route>
          {tasks && <Route path="/calendar" element={<Calendar tasks={tasks} />} ></Route>}
        </Route>
        <Route>
          {tasks && <Route path="/modify" element={<Modify tasks ={tasks} />}></Route>}
        </Route>
        <Route>
          {tasks && <Route path="/create" element={<Create tasks ={tasks} />}></Route>}
        </Route>
        {/* <Route path="/pomodoro" element={<Pomodoro/>}/> */}
      </Routes>

    </div>
  );
}

export default App;
