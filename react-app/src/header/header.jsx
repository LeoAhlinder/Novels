import React, { useEffect, useState } from 'react';
import "./headerStyle.css"
import { useNavigate } from "react-router-dom"

const Header = () => {
   
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    if (window.scrollY > 20){
        console.log("TESt222")
    }

    useEffect(() => {
        (async () => {
          const tok = await checkToken();
          if (tok === "valid"){
            setLoggedIn(true)
          }
          else{
            setLoggedIn(false)
          }
        })();
      });
      

    const checkToken = async () => {
        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                return "unvalid"
            } else {
                const res = await fetch(`http://localhost:3001/api/protected/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                const response = await res.json();
                if (response.message === "this is protected"){
                    return "valid"
                }
            }
        } catch (err) {
            console.log(err);
        }
    };



    const profileButtonClicked = async () =>{
        const token = await checkToken()
        if (token === "valid"){
            navigate("/Profile")
        }
        else{
            navigate("logIn")
        }

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
                    <button className='profileButton' onClick={profileButtonClicked}>
                        {loggedIn ? "Profile" : "Log In or create Account"}
                    </button>
                </div>
            </div>
    );
}

export default Header
