import React, { useState, useEffect } from "react";
import axios from "axios";

// import './input.css';


function Input(props) {
    const controller = new AbortController();
    const signal = controller.signal;
    const [isSubmitButtonPressed, setSubmitButtonPressed] = useState(false);
    const [note, setNote] = useState({
        id: "", 
        title: "",
        content: "",
        date: "",
        time: ""
    });
    

    function handleChange(event) {
        const {name, value} = event.target;
        setNote((prevValue) => {
            return{
                ...prevValue,
                [name]: value,
            }
        });
        // console.log(name, value)
    };
     async function handleButtonClick (event) {
        // setSubmitButtonPressed(() => {return(!isSubmitButtonPressed)})
        console.log(note);
        event.preventDefault();
        note.date = (new Date().toString())
        
        // console.log(note.time.length)
        if (note.title && note.content) {
            setSubmitButtonPressed(!isSubmitButtonPressed);
            
                try {
                    
                    // Send a POST request
                    const response = await axios({
                        headers: {
                                    'Accept': 'application/json',
                                    'content-type': 'application/json' },
                        method: 'POST',
                        url: 'http://localhost:3000/note',
                        data: JSON.stringify({
                            email: props.email,
                            title: note.title,
                            content: note.time.length > 0 ? `${note.content} on ${(new Date(note.time)).toLocaleString()}` : note.content,
                            time: (new Date(note.time)).toLocaleString(),
                            date: note.date
                        }, {signal})
                    });
                    // console.log(response.data)
                    // console.log(` Another Wahala ${isSubmitButtonPressed}`)
                    props.changeOfState(isSubmitButtonPressed);
                   } catch (error) {
                    console.log(error)
                   }
            
                
            
        }
        
    }
    // setSubmitButtonPressed(false)
    // console.log(`This is it ${note.date}`)
    return(
        <div>
            <form onSubmit={handleButtonClick} method="post">
                <div className="mb-0 col-12 px-2">
                    <label className="form-label my-0 d-line">Title:</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={props.titleValue}
                        onChange={handleChange}
                        placeholder="Title..." 
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
                        placeholder="Content..."  
                        rows="3"
                        value={props.contentValue}>

                    </textarea>
                </div>
                <div className="mb-1 col-12 px-1 py-0 d-line">
                    <label  className="form-label my-0">Time:</label>
                    <input 
                        type="datetime-local" 
                        name="time" 
                        // value={props.titleValue}
                        onChange={handleChange}
                        
                        className="form-control border border-dark my-0 d-line-flex"  
                        aria-describedby="emailHelp" 
                        />
                </div>
                <div className="d-flex justify-content-center py-0 my-1">
                    <button type="submit"
                        className="btn btn-success d-flex justify-conent-center my-0">
                            {props.buttonType}
                    </button>
                </div>
                </form>
        </div>
    )
}


export default Input