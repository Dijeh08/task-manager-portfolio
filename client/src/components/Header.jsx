import React, { useContext } from "react";
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
// import "./Header.css";

function Header(props) {
    return(
        <div>
           
            <h1><AppRegistrationOutlinedIcon/>{props.mainHeading}</h1>
            <p>{props.lesserHeading}</p>
        </div>
    )
}

export default Header