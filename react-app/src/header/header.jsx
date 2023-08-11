import React from 'react';
import "./headerStyle.css"
import { useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate();

    const loggedIn = false;

    const profileButtonClicked = () => {
        navigate("/Profile");
    }
    const logIn =  () =>{
        navigate("/logIn")
    }

    return (
        <div className="headerDesign">
            <div className="header">
                <button className='button'>Hits</button>
                <button className='button'>Most Popular</button>
                <button className='button'>Create</button>
                <button className='button'>Search</button>
                <button className='profileButton' onClick={loggedIn ? profileButtonClicked : logIn}>{loggedIn ? "Profile" : "Log In or create Account"}</button>
            </div>
        </div>
    );
}

export const loggedIn = false;
export default Header;
