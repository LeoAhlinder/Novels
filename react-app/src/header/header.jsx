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


    useEffect(() => {
        const hamburger = document.querySelector(".hamburger"); // Assuming you have an element with the ID "hamburger"
        const navMenu = document.querySelector(".nav-menu");     // Assuming you have an element with the ID "nav-menu"
    
        console.log(hamburger,navMenu)

        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
          })
        },);

        document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    ))

    return (
        <header>
            <div className="container"> 
                <nav className="navbar" id='nav-menu'>
                    <a onClick={home} className="nav-branding">Novels</a>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <a className='nav-link'>Hits</a>
                        </li>
                        <li className="nav-item">
                            <a className='nav-link'>Most Popular</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Create</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Search</a>
                        </li>
                        <li>
                            <a className='nav-link' onClick={profileButtonClicked}>
                                {loggedIn ? "Profile" : "Log In or create Account"}
                            </a>
                        </li>
                    </ul>
                    <div className="hamburger" id='hamburger'>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </nav>
            </div>
        </header>
      );
      
}

export default Header
