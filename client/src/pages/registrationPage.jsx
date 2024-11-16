import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Header from '../components/Header.jsx';
import axios from "axios";


function Registration(props) {
    const controller = new AbortController();
    const naviagate = useNavigate();
    const [isPasswordsSame, setIsPasswordSame] = useState(true);
    const [userRegistrationData, setUserRegistrationData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password_repeat: ''
    });
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
        if (firstName.length & lastName.length & email.length & password.length & password_repeat.length) {
           
            if (password === password_repeat) {
                // console.log('Same')
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
                            naviagate('/');
                        }else if (responseJson === 'saved') {
                            naviagate('/user');
                        }
                  } catch (error) {
                    console.log(error)
                  }
                
            } else {
                setIsPasswordSame(previousState => !previousState)
                // console.log('Not Same')
                alert('Please your passwords must be the same')
            }
        }
       
        // console.log(email, password, password_repeat);
    }
    return(
        <>
        <div className='bg-warning text-white text-center mb-4'>
                    <Header 
                        mainHeading={'Register'}
                        lesserHeading={'Please fill in this form to create an account.'}/>
        </div>
        <div className='mx-auto col-6 border  border-1 mt-2'>
        <form className='needs-validation' onSubmit={handleRegister} noValidate>
            <div className="px-5" >
                <div className="mb-2 d-flex justify-content-between" >
                    <div className='col-lg-6 me-3'>
                        <label htmlFor="exampleInputFirstName" className="form-label"><b>First Name</b></label>
                        <div className="col-lg-12">
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
                <div className="mb-2 row">
                    <label htmlFor="exampleInputEmail1" className="form-label"><b>Email address</b></label>
                    <div className="col-lg-8">
                        <input type="email" onChange={handleChange} name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Email" autoFocus required/>
                    </div>
                    
                </div>

                <div className="mb-2 row">
                    <label htmlFor="exampleInputPassword1" className="form-label"><b>Password</b></label>
                    <div className="col-lg-8">
                        <input type="password" onChange={handleChange} placeholder="Password" name='password' className="form-control" id="exampleInputPassword1" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$" required/>
                    </div>
                    <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers.
                    </div>
                </div>
               
                <div className="mb-2 row">
                    <label htmlFor="exampleInputPassword2" className="form-label"><b>Repeat Password</b></label>
                    <div className="col-lg-8">
                        <input type="password" onChange={handleChange} placeholder="Repeat Password" name='password_repeat' className="form-control" id="exampleInputPassword2" required/>
                        {isPasswordsSame? null : <p className='text-danger'>Please your passwords must be the same</p>}
                    </div>
                </div>
                <div className='d-flex align-items-center flex-column'>
                    <div>
                        <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>
                    </div>
                
                    <div className='mt-0'>
                        <button type="submit" className="btn btn-success btn-lg">Register</button>
                    </div>
                    
                </div>
                
            </div>
            <hr/>
            <div className="container d-flex justify-content-center">
                <div>
                <p className='text-dark link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>Already have an account? <Link to={'/'}>Sign in</Link>.</p>
                </div>
            </div>
        </form>
        </div>
        
        </>
    )
}

export default Registration;