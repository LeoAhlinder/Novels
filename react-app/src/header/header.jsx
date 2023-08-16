import React, { useEffect, useState } from 'react';
import "./headerStyle.css"
import { useNavigate } from "react-router-dom"

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
        closeMenu()
        if (token === "valid"){
            navigate("/Profile")
        }
        else{
            navigate("logIn")
        }

    }

    const home = () =>{
        navigate("/")
        setIsMenuOpen(false);
    }

    const create = () =>{
        navigate("/create")
        setIsMenuOpen(false);
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
                    <a onClick={home} className="nav-branding">Novels</a>
                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li className="nav-item">
                            <a className='nav-link' onClick={closeMenu}>Most Popular</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={create}>Create</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={closeMenu}>Search</a>
                        </li>
                        <li>
                            <a className='nav-link' onClick={profileButtonClicked}>
                                {loggedIn ? "Profile" : "Log In or create Account"}
                            </a>
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
