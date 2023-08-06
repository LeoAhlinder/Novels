import React from 'react';
import "./headerStyle.css"
import { useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate();

    const profileButtonClicked = () => {
        navigate("/Profile");
    }

    return (
        <div className="headerDesign">
            <div className="header">
                <button className='button'>Hits</button>
                <button className='button'>Best Selling</button>
                <button className='button'>Create</button>
                <button className='button'>Search</button>
                <button className='profileButton' onClick={profileButtonClicked}>Profile</button>
                <button className='profileButton'>Library</button>
            </div>
        </div>
    );
}

export default Header;
