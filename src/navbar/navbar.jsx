import React, { useEffect, useState } from 'react';
import "./navbarStyle.css"
import { useNavigate } from "react-router-dom"
import ErrorHandler from '../Global/errorHandler';
import Cookies from 'js-cookie'


const Header = () => {
   
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

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
            const token = Cookies.get("authToken");

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
                if (res.ok){
                    const response = await res.json();
                    if (response.message === "this is protected"){
                        return "valid"
                    }
                }else{
                    navigate("/error")
                }
            }
        } catch (err) {
            navigate("/error") 
        }
    };



    const profileButtonClicked = async () =>{
        const token = await checkToken()
        closeMenu()
        if (token === "valid"){
            navigate("/profile")
        }
        else{
            navigate("login")
        }

    }

    const create = () =>{
        if (loggedIn === true){
            navigate("/create")
            setIsMenuOpen(false);
        }else{
            navigate("login");
            alert("You need to sign in to start creating novels.")
            setIsMenuOpen(false);
        }
    }


    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(prevState => !prevState);
    };
  
    const closeMenu = () => {
      setIsMenuOpen(false);
    };



    return (
        <header className='layers'>
            <div className="container"> 
                <nav className="navbar" id='nav-menu'>
                    <a href="/" className="nav-branding">Novels</a>
                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li className="nav-item">
                            <a className='nav-link' href='./popular' onClick={closeMenu}>Most Popular</a>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={create}>Create</button>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href='./search' onClick={closeMenu}>Search</a>
                        </li>
                        <li className="nav-item">
                            <button className='nav-link' onClick={profileButtonClicked}>
                                {loggedIn ? "Profile" : "Log in / Create account"}
                            </button>
                        </li>
                    </ul>
                    <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} id='hamburger'>
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
