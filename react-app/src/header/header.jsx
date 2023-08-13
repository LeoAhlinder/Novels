import React, { useEffect, useState } from 'react';
import "./headerStyle.css"
import { useNavigate } from "react-router-dom"

const Header = () => {

    const token = localStorage.getItem("authToken")

    useEffect(() => {
        const checkToken = async (token) => {
            try{
                const response = await fetch("http://localhost:3001/api/protected", {
                    method: "GET", // You can adjust the HTTP method accordingly
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the Authorization header
                    }
                });
            
                if (response.ok) {
                    const data = await response.json();
                    setLoggedIn(true)

                } else {
                    console.log("Token validation failed:", response.statusText);
                }
            }catch(err){
                console.log(err)
            }
        };
        
        checkToken(token);
    })
    
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);



    useEffect(() =>{
        if (localStorage.getItem("logIn_status") === "true"){
            setLoggedIn(true)
        }
        else{
            setLoggedIn(false)
        }
    },[location.pathname])


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
                    <button className='profileButton' onClick={loggedIn ? profileButtonClicked : logIn}>
                        {loggedIn ? "Profile" : "Log In or create Account"}
                    </button>
                </div>
            </div>
    );
}

export default Header
