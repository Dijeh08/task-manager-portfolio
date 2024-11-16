import React, { useState, useEffect } from "react";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DoneOutLineIcon from '@mui/icons-material/DoneOutLine'; 
import axios from "axios";
import Input from "./Input";
import "./Note.css";

function Note(props) {
    const controller = new AbortController();
    const [isEditPressed, setIsEditPressed] = useState(false);
    const [isUnCompleteDeletePressedState, setUnCompleteDeletePressedState] = useState(false);
    const [isCompleteDeletePressedState, setCompleteDeletePressedState] = useState(false);
    const [isSubmitPressed, setIsSubmitPressed] = useState(false);
    const [isMarkPressed, setMarkPressed] = useState(false);
    
   
    // const [dateTime, setDateTime] = useState(null);
    const contentArray = (props.content).split(' ') 
        
        if ((contentArray.filter(test => test.includes("/"))).length > 0) {
        
            for (let index = 0; index < 4; index++) {
                contentArray.pop()
            }
        }
        
        const contentString = contentArray.toString()
        const reformattedContent = contentString.replaceAll(',', ' ')
    const [editedNote, setEditedNote] = useState({
        id: props.id,
        title: props.title,
        content: reformattedContent,
        time: props.time
    });
    
    
    async function handleDeleteClick() {
        if (props.toDoOptionState) {

        // Delete a request
        await axios({
            headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' },
            method: 'delete',
            url: `http://localhost:3000/note/${props.id}`,
        });
        const isUnCompleteDeleteButtonPressed = !isUnCompleteDeletePressedState
        setUnCompleteDeletePressedState(isUnCompleteDeleteButtonPressed);
        props.deleteUnCompletePressed(isUnCompleteDeleteButtonPressed);
        }else if (props.completeOptionState) {
        // Delete complete request
        await axios({
            headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' },
            method: 'delete',
            url: `http://localhost:3000/complete/${props.id}`,
        });
        const isCompleteDeleteButtonPressed = !isCompleteDeletePressedState
        setCompleteDeletePressedState(isCompleteDeleteButtonPressed);
        props.deleteCompletePressed(isCompleteDeleteButtonPressed);
        }
        
    }

    function handleEditClick() {
        setIsEditPressed(true);  
    }

    function handleChange(event) {
        const {name, value} = event.target;
        setEditedNote((prevValue) => {
            return{
                ...prevValue,
                [name]: value,
            }
        });
    }
    function handleSubmit (event) {
        event.preventDefault();
        const {id, title, content, time} = editedNote;
        
        setIsSubmitPressed(!isSubmitPressed);
        // console.log(`this is the time ${time}`)
        try {
            // Send a PATCH request
            axios({
                headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' },
                method: 'patch',
                url: `http://localhost:3000/note/${id}`,
                data: JSON.stringify({
                    title: title,
                    content: time.length > 0 ? `${content} on ${(new Date(time)).toLocaleString()}` : content,
                    time: time,
                })
            });
        } catch (error) {
            console.log(error);
        }
       
        setIsEditPressed(false);
        props.submitState(isSubmitPressed);
    }
    
    

    async function handMarkClick() {
        const id = props.id;
        const goodMark = !isMarkPressed
        setMarkPressed(goodMark);

        try {
            // Convert an uncompleted note to completed note request
        await axios({
            headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' },
            method: 'GET',
            url: `http://localhost:3000/complete/${id}`,
            
        });
        props.MarkState(true);
        } catch (error) {
            console.log(error);
        }
       
    }
    
    const dateData = new Date(props.time)
   let localDate = dateData.toDateString()
   let localTime = dateData.toTimeString().split(" ")
    return(
        <div className="text-dark  float-start me-3 shadow-lg p-3 mb-5 bg-white rounded" style={{width: "300px"}}>
            {isEditPressed? 
            <>
            <div>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="mb-0 col-12 px-2">
                    <label className="form-label my-0 d-line">Title:</label>
                    <input 
                        type="text" 
                        name="title" 
                        onChange={handleChange}
                        value={editedNote.title}
                        className="form-control border border-dark my-0 d-line-flex"  
                        aria-describedby="emailHelp" 
                        autoFocus/>
                </div>
                <div className="mb-1 col-12 px-1 py-0 d-line">
                    <label  className="form-label my-0">Content:</label>
                    <textarea 
                        onChange={handleChange}
                        className="form-control border border-dark my-0" 
                        name="content" 
                        value={editedNote.content}  
                        rows="3">

                    </textarea>
                </div>
                <div className="mb-1 col-12 px-1 py-0 d-line">
                    <label  className="form-label my-0">Time:</label>
                    <input 
                        type="datetime-local" 
                        name="time" 
                        value={editedNote.time} 
                        onChange={handleChange}
                        
                        className="form-control border border-dark my-0 d-line-flex"  
                        aria-describedby="emailHelp" 
                        />
                </div>
                <div className="d-flex justify-content-center py-0 my-0">
                    <button 
                        type="submit"
                        // onClick={handleSubmit} 
                        className="btn btn-success d-flex justify-conent-center my-0">Edit</button>
                </div>
                </form>
        </div>
        </>
             : 

            <><h3 className="text-warning overflow-visible text-break">{props.title}</h3>
            <div className="d-flex justify-content-between text-break" >
                
                <div>
                    <h4 className="text-wrap text-break">{props.content}</h4>
                </div>
                
                <div className="d-flex justify-content-end m-0"> 
                {props.toDoOptionState 
                    &&
                    <>
                    <button 
                        onClick={handMarkClick} 
                        className="btn p-0 text-warning">
                            <DoneOutLineIcon sx={{fontSize: 28}} className="mx-0  text-warning"/>
                    </button>
                    
                    <button 
                        onClick={handleEditClick} 
                        className="btn p-0">
                        <CreateOutlinedIcon sx={{fontSize: 30}} className="mx-0  text-warning"/>
                    </button>
                    </>}
                    <button 
                        onClick={handleDeleteClick} 
                        className="btn p-0">
                        <DeleteOutlineOutlinedIcon sx={{fontSize: 30}} className="mx-0 text-warning"/>
                    </button>
                </div>
                
            </div>
            <div className="d-flex justify-content-start pt-2">
                <div>
                
                        <small>{localDate}</small>
                </div>
                <div className="ms-5">
                
                    <small>{localTime[0]}</small>
                </div>
            </div>
            </>
            }
            
        </div>
    )
}
 export default Note