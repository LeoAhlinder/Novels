import React, { useEffect, useState } from 'react';
import "./headerStyle.css"
import { useNavigate } from "react-router-dom"

const Header = () => {
   
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    if (window.scrollY > 20){
        console.log("TESt222")
    }

    useEffect(() =>{
        if (localStorage.getItem("logIn_status") === "true"){
            setLoggedIn(true)
        }
        else{
            setLoggedIn(false)
        }
    })

    
    const profileButtonClicked = () => {
        navigate("/Profile");
    }
    const logIn =  () =>{
        navigate("/logIn")
    }
    const home = () =>{
        navigate("/")
    }

    return (
            <div className="headerDesign">
                <div className="header">
                    <button className='button' onClick={() => home()}>Home</button>
                    <button className='button'>Hits</button>
                    <button className='button'>Most Popular</button>
                    <button className='button'>Create</button>
                    <button className='button'>Search</button>
                    <button className='profileButton' onClick={loggedIn ? profileButtonClicked : logIn}>
                        {loggedIn ? "Profile" : "Log In or create Account"}
                    </button>
                </div>
            </div>
    );
}

export default Header
