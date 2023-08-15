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

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    function test(){
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
          })
    }

    return (
        <header>
            <div class="container"> 
                <nav class="navbar">
                    <a onClick={home} class="nav-branding">Novels</a>
                    <ul class="nav-menu">
                        <li class="nav-item">
                            <a className='nav-link'>Hits</a>
                        </li>
                        <li class="nav-item">
                            <a className='nav-link'>Most Popular</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link">Create</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link">Search</a>
                        </li>
                        <li>
                            <a className='nav-link' onClick={profileButtonClicked}>
                                {loggedIn ? "Profile" : "Log In or create Account"}
                            </a>
                        </li>
                    </ul>
                    <div class="hamburger" onClick={test}>
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </nav>
            </div>
        </header>
      );
      
}

export default Header
