import axios from "axios";
import React, { useState, useEffect } from "react";
import Header from '../components/Header.jsx'
import {Link, useNavigate} from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookLogin from 'react-facebook-login';
import FacebookIcon from '@mui/icons-material/Facebook';

function Authentication(props) {
    const controller = new AbortController();
    const [ user, setUser ] = useState([]);
    const [ facebookUserProfile, setFacebookUserProfile ] = useState([]);
    const [facebookLoginCondition, setFacebookLoginCondition] = useState(false);
    const [ googleUserProfile, setGoogleUserProfile ] = useState([]);
    const [ userInputProfile, setuserInputProfile ] = useState([]);
    const [loginAuthenticationState, setloginAuthenticationState] = useState(true)
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });
  

    
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => setFacebookLoginCondition(false)
    });

    const handleFacebookCallback = async (response) => {
    if (response?.status === "unknown") {
        // console.error('Sorry!', 'Something went wrong with facebook Login.');
        setFacebookLoginCondition(false);

     return;
    }
    
    // console.log(response); // prints name, email, etc
    const nameArray = (response.name).split(' ');
    const facebookLastName = nameArray[0];
    const facebookFirstName = nameArray[1];
    // console.log(facebookLastName, facebookFirstName)
    setFacebookLoginCondition(true)
    setFacebookUserProfile(response);
    const result = await axios ({
        origin: "*",
          method: 'post',
          url: 'http://localhost:3000/googleLogin',
          data: {
            firstName: facebookFirstName,
            lastName: facebookLastName,
            email: response.email,
            password: 'Facebook'}

    })
  
    
    }
    // console.log(import.meta.env.VITE_SECRET_CLIENT_ID)
    // console.log(` this is it ${import.meta.env.VITE_SECRET_FACEBOOK_APP_ID}`)
     async function fetchGoogleApi() {
        try {
            if (user) {
                const response = await axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })  
                        // console.log(response.data)
                        setGoogleUserProfile(response.data);
                await axios ({
                    origin: "*",
                      method: 'post',
                      url: 'http://localhost:3000/googleLogin',
                      data: {
                        firstName: response.data.given_name,
                        lastName: response.data.family_name,
                        email: response.data.email,
                        password: 'google'}

                })
            }
        } catch (error) {
            console.log(error)
        }
     } 

    useEffect(() => {
            fetchGoogleApi()
        },
        [ user ]
    );

    function handleChange(event) {
        
        const {name, value} = event.target;
        setUserData((previousValue) => {
            return({
                ...previousValue,
                [name]: value
            })
        })
    };

    async function handleSubmit(event) {
        event.preventDefault();
        const {email, password} = userData;

        
        
        // console.log(email, password);
        try {
            const response = await 
            axios({
              origin: "*",
              method: 'post',
              url: 'http://localhost:3000/login',
              data: {
                email: email,
                password: password,
            }}, {signal: controller.signal});

            let loginAuthentication = response.data;
            setloginAuthenticationState(loginAuthentication)

            if (loginAuthentication) {
                // console.log('I get am');
                // setuserInputProfile({
                //     email: email,
                //     password: password});
                navigate('/user', {state: {email: email}});
            } else if(!loginAuthentication){
                console.log('Either you inserted the wrong details or you are not registered')
                // navigate('/registrationPage');

            }
             
          } catch (error) {
            console.log(error)
          }
    }
    // console.log(facebookUserProfile)
    useEffect(() => {
        if (googleUserProfile.verified_email || facebookLoginCondition) {
            // console.log(`Logged in through here`)
            // console.log(facebookUserProfile.email)
            navigate("/user", {state: { email: googleUserProfile.verified_email? googleUserProfile.email : facebookUserProfile.email}});
        }
    },[googleUserProfile.verified_email, facebookLoginCondition])
    
   
    return(
        <>
        <div className="bg-warning">
        <h1 className="text-center text-white"><Header mainHeading={'Login to Task Manager App'}/></h1>
        </div>
        
        <div className="mx-auto p-2 col-8 ">
            <div className="position-absolute top-20 start-50 translate-middle-x border border-1 border-secondary-subtle">
                <div className="w-100 h-100 d-flex justify-content-center p-3" >
                    <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                            
                                <input 
                                    type="email" 
                                    name="email"
                                    className="form-control col-12" 
                                    id="exampleInputEmail1" 
                                    aria-describedby="emailHelp" 
                                    placeholder="Email address" 
                                    onChange={handleChange}
                                     
                                    required 
                                    autoFocus/>
                            
                            </div>
                            <div className="mb-3">
                                <input 
                                    type="password" 
                                    name="password"
                                    className="form-control" 
                                    onChange={handleChange}
                                    id="exampleInputPassword1" 
                                    placeholder="Password" 
                                    size={30} 
                                    required/>
                            </div>
                            
                            <div 
                                className="my-3"
                                style={{display: 'inline', margin: '40%'}}
                                >
                                <button type="submit" className="btn btn-warning">Submit</button>
                                {loginAuthenticationState? null:<div className="text-danger text-center"><span>Either you inserted the wrong details or you are not registered</span></div>}

                               
                                <button  
                                    onClick={() => login()} 
                                    className="btn mt-3 btn-danger col-12 d-flex justify-content-evenly" style={{borderRadius: '25px'}}><div><GoogleIcon /></div>   <div><b className="text-white fs-6"> SIGN IN WITH GOOGLE</b></div>
                                </button> 
                                <div className="text-center"><h3>or</h3></div>
                                
                                <FacebookLogin 
                                    buttonStyle={{padding:"6px", width: '100%',  borderRadius: '25px'}}  
                                    appId= {import.meta.env.VITE_SECRET_FACEBOOK_APP_ID}  //    we need to get this from facebook developer console by setting the app.
                                    autoLoad={false}  
                                    fields="name,email,picture"  
                                    callback={handleFacebookCallback}
                                    icon={<FacebookIcon/>}
                                    />
                                
                                <div className="mt-2">
                                    <span className="text-dark link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Don't have an account? <Link to={'/registrationPage'}> Sign-up </Link> </span>
                                </div>
                                
                            </div>

                            
                    </form>
                </div>
            </div>
        </div>
        
        
      
      </>
    )
}

export default Authentication