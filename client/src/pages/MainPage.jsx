import { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom'
import Header from '../components/Header';
import Input from '../components/Input';
import Note from '../components/Note';
import axios from "axios"


function MainPage() {
  const controller = new AbortController();
  const [notes, setNotes] = useState([]);
  const location = useLocation();
  const [isUncomplete, setIsUncomplete] = useState(true); 
  const [isComplete, setIsComplete] = useState(false);
  const [submitButtonPressed, setsubmitButtonPressed] = useState(null);
  const [isUnCompleteDeletePressedState, setUnCompleteDeletePressedState] = useState(false);
  const [isCompleteDeletePressedState, setCompleteDeletePressedState] = useState(false);
  const [isEditPressed, setIsEditPressed] = useState(false);
  const [isMarkPressed, setMarkPressed] = useState(false);

  const {email} = location.state;

  // GET request for remote todo-list in index.js
  const fetchToDoAPI = async (req, res) => {
    try {
      const response = await  
            axios({
              origin: "*",
              method: 'post',
              url: 'http://localhost:3000/all',
              data: {
                email: email,
            }}, {signal: controller.signal});

        const todoNote = response.data

        if (isUncomplete) {
          setNotes(todoNote);
          
        }
        
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchToDoAPI();
    
    return(() => {
      controller.abort();
      
    })
  }, [submitButtonPressed, isUncomplete, isUnCompleteDeletePressedState, isEditPressed, isMarkPressed]);
  
  // GET request for remote complete in index.js
  const fetchCompleteAPI = async (req, res) => {
    try {
      const response = await  
            axios({
              origin: "*",
              method: 'post',
              url: 'http://localhost:3000/complete/all',
              data: {
                email: email,
            }}, {signal: controller.signal});


        var completedNote = response.data;
        if (isComplete) {
          setNotes(completedNote)
        }
        
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCompleteAPI();
    return(() => {
      controller.abort();
      // console.log(controller.signal)
    })
    }, [isComplete, isCompleteDeletePressedState]);
    
    function submitPressed(params) {
      // console.log(params)
      setsubmitButtonPressed(params);

    }
    
    function handleToDoButton() {
      setIsUncomplete(true);
      setIsComplete(false);
    };

  function handleCompleteButton() {
    setIsUncomplete(false);
    setIsComplete(true);
    }
    
  function handleDeleteClick() {
    setUnCompleteDeletePressedState(!isUnCompleteDeletePressedState);
  }

  function handleCompleteDeleteClick() {
    setCompleteDeletePressedState(!isCompleteDeletePressedState)
  }

  function EditedState() {
    setIsEditPressed(!isEditPressed);
   
  }
  
  function markState() {
    setMarkPressed(!isMarkPressed);
  }
 
  return(
  <>
  <div className='bg-warning text-white p-3'>
      <Header mainHeading={'GET THINGS DONE!'}/>    
  </div>
  <div className='container'>
    <div className='row d-flex justify-content-center'>
    <div className='bg-white mt-1   border rounded shadow col-xs-12 col-sm-8 col-md-6 col-lg-4' >
          <Input 
            email={email}
            changeOfState={submitPressed}
            buttonType={"Submit"}
            />
        </div>
    </div>
      
  </div>

  <div className='container-fluid'>
    <button 
      className={isUncomplete? 'btn btn-warning text-white': 'btn btn-dark text-warning'} 
      onClick={handleToDoButton}
      >
        ToDo
    </button>
    <button 
      className={isComplete? 'btn btn-warning text-white': 'btn btn-dark text-warning'} 
      onClick={handleCompleteButton}
      >
        Completed
    </button>
  </div>
  

  <div className='container-fluid  my-2'>
    <div>
      {notes.map((note, index) =>{
        return(
          <Note 
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            date = {note.date}
            time = {note.time}
            deleteUnCompletePressed={handleDeleteClick}
            deleteCompletePressed={handleCompleteDeleteClick}
            toDoOptionState={isUncomplete}
            completeOptionState ={isComplete}
            submitState={EditedState}
            MarkState={markState}
            />

          
        )
     })}
    </div>
    
  </div>
</>
)
}

export default MainPage;
