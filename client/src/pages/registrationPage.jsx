import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Header from '../components/Header.jsx';
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Modal from '../components/Modal.jsx';

function Registration(props) {
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const controller = new AbortController();
    const [darkMode, setDarkMode] = useState(true);
    const naviagate = useNavigate();
    const [isPasswordsSame, setIsPasswordSame] = useState(true);
    const [userRegistrationData, setUserRegistrationData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password_repeat: ''
    });
    
    const htmlElement = document.querySelector('html');
        htmlElement.setAttribute('data-bs-theme', darkMode? 'dark': 'light');


    function handleChange(event) {
        const {name, value} = event.target;
        setUserRegistrationData((previousValue) => {
            return{
                ...previousValue,
                [name]: value
            }
        })
        
    };
    async function handleRegister(event) {
        event.preventDefault();
        
        const {firstName, lastName, email, password, password_repeat} = userRegistrationData;
        // console.log(firstName, lastName, email, password, password_repeat)
        if (firstName.length > 0 & lastName.length > 0 & email.length > 0 & password.length > 0 & password_repeat.length > 0) {
           
            if (password === password_repeat) {
                console.log('Same')
                setIsPasswordSame(true);

                try {
                    
                    const response = await 
                    axios({
                      origin: "*",
                      method: 'post',
                      url: 'http://localhost:3000/register',
                      data: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        password_repeat: password_repeat,
                    }}, {signal: controller.signal});
                      let responseJson = response.data;
                        
                        if (responseJson === 'exist') {
                            naviagate('/task-manager-portfolio/');
                        }else if (responseJson === 'saved') {
                            naviagate('/task-manager-portfolio/user');
                        }
                  } catch (error) {
                    console.log(error)
                  }
                
            } else {
                setIsPasswordSame(previousState => !previousState)
                // console.log('Not Same')
                alert('Please your passwords must be the same');
            }
        }
        // else{
        //     alert('Fill in the empty boxes');
        // }
       
        // console.log(email, password, password_repeat);
    }

    function handleDarkMode(params) {
        setDarkMode(params);
    }

    function handlePasswordVisibility1() {
        var x = document.getElementById("inputPassword1");
        if (x.type === "password") {
            x.type = "text";
            setPasswordVisibility(true)
        } else {
            x.type = "password";
            setPasswordVisibility(false)
        }
        
    }

    function handlePasswordVisibility2() {
        var x = document.getElementById("inputPassword2");
        if (x.type === "password") {
            setPasswordVisibility(true);
            x.type = "text";
        } else {
            x.type = "password";
            setPasswordVisibility(false);
        }
    }

    function handlePasswordInsertion(params) {
        const element1 = document.getElementById('inputPassword1');
        const element2 = document.getElementById('inputPassword2');
        element1.value = params;
        element2.value = params;
    }

    return(
        <>
        <div className='bg-warning text-white text-center mb-2'>
                    <Header 
                        mainHeading={'Register'}
                        lesserHeading={'Please fill in this form to create an account.'}
                        mode={handleDarkMode}/>
        </div>
        <div className={`mx-auto col-6 border  border-1  ${darkMode? 'border-success': 'border-secondary-subtle'}`}>
        <form className='needs-validation was-validated' onSubmit={handleRegister} noValidate>
            <div className="pe-4 ps-2 pb-1" >
                <div className="mb-1 d-flex justify-content-between" >
                    <div className='col-lg-6 me-3'>
                        <label htmlFor="exampleInputFirstName" className="form-label"><b>First Name</b></label>
                        <div className="col-lg-12 has-validation">
                            <input type="text" onChange={handleChange} name="firstName" className="form-control" id="exampleInputFirstName" aria-describedby="emailHelp" placeholder="Enter First Name" autoFocus required/>
                        </div>
                    </div>


                    <div className='col-lg-6'>
                        <label htmlFor="exampleInputLastName" className="form-label"><b>Last Name</b></label>
                        <div className="col-lg-12">
                            <input type="text" onChange={handleChange} name="lastName" className="form-control" id="exampleInputLastName" aria-describedby="emailHelp" placeholder="Enter Last Name" autoFocus required/>
                        </div>
                    </div>
                    
                </div>
                <div className="mb-1 row">
                    <label htmlFor="exampleInputEmail1" className="form-label"><b>Email address</b></label>
                    <div className="col-lg-8">
                        <input type="email" onChange={handleChange} name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Email" autoFocus required/>
                    </div>
                    
                </div>
                <div className="mb-1 row">
                    <label htmlFor="inputPassword1" className="form-label"><b>Password</b></label>
                    <div className="col-lg-8 input-group">
                        <input type="password" onChange={handleChange} placeholder="Password" name='password' className="form-control" id="inputPassword1" pattern="^(?=.*[A-Za-z])(?=.*\d)(?!.* )(?=.*\W).{8,}$" required/>
                        {passwordVisibility? 
                            <button onClick={handlePasswordVisibility1} className="input-group-text" id="basic-addon1"><i className="bi bi-eye"></i></button>
                            :
                            <button onClick={handlePasswordVisibility1} className="input-group-text" id="basic-addon2"><i className="bi bi-eye-slash"></i></button>
                        }
                        <Modal 
                            passwordGenerated={handlePasswordInsertion}/>
                    </div>
                    <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters, symbols and numbers.
                    </div>
                </div>
               
                <div className="mb-1 row">
                    <label htmlFor="inputPassword2" className="form-label"><b>Repeat Password</b></label>
                    <div className="col-lg-8 input-group">
                        <input type="password" onChange={handleChange} placeholder="Repeat Password" name='password_repeat' className="form-control" id="inputPassword2" pattern="^(?=.*[A-Za-z])(?=.*\d)(?!.* )(?=.*\W).{8,}$" required/>
                        
                        {passwordVisibility?
                            <button onClick={handlePasswordVisibility2} className="input-group-text"><i className="bi bi-eye"></i></button>
                            :
                            <button onClick={handlePasswordVisibility2} className="input-group-text" ><i className="bi bi-eye-slash"></i></button>
                        }
                        
                    </div>
                    {isPasswordsSame? null : <p className='text-danger'>Please your passwords must be the same</p>}
                </div>
                <div className='d-flex align-items-center flex-column'>
                    <div>
                        <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>
                    </div>
                
                    <div className=''>
                        <button type="submit" className="btn btn-success btn-lg">Register</button>
                    </div>
                    
                </div>
                
            </div>
            
            <div className="container border border-1 pt-1 d-flex justify-content-center">
                <div>
                <p className=' fw-normal'>Already have an account? <Link to={'/task-manager-portfolio/'}>Sign in</Link>.</p>
                </div>
            </div>
        </form>
        </div>
        
            
        </>
    )
}

export default Registration;