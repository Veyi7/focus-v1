import './App.css';
import api from './api/axiosConfig';
import {useState,  useEffect} from 'react';

function App() {

  const [tasks, setTasks] = useState();
  const getTasks = async () => {
    
    try {
      const response = await api.get("/task/all");

      console.log(response.data);

      setTasks(response.data);
    } 
    catch(err){
      console.log(err);
    }
    
  }

  useEffect(() => {
    getTasks();
  },[])

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
