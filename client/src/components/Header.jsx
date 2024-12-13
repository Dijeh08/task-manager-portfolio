import React, { useContext, useState } from "react";
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import 'bootstrap-icons/font/bootstrap-icons.css'
// import "./Header.css";

function Header(props) {
    const [darkMode, setDarkMode] = useState(true);

    function handleMode() {
        setDarkMode(!darkMode);
        // console.log(darkMode)
        props.mode(!darkMode)
    }
    return(
        <>
        <div className="d-flex justify-content-between mx-3 py-1">
            <div className="">
                <h1><AppRegistrationOutlinedIcon/>{props.mainHeading}</h1>
                
            </div>
            <div className="">
                {darkMode ? 
                    <button type="button" onClick={handleMode} className="btn"><i className="bi bi-moon-stars fs-2 text-white"></i></button> : 
                    <button type="button" onClick={handleMode} className="btn"><i className="bi bi-brightness-high fs-2"></i></button>}
                
            </div>
        </div>
        <h3 className="text-center">{props.lesserHeading}</h3>
        </>
    )
}

export default Header