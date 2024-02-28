import React, { useEffect, useState } from 'react';
import "./navbarStyle.css"
import { Link, useNavigate } from "react-router-dom"

import checkToken from "../Global/checkToken";

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
                    <Link to="/" className="nav-branding" onClick={closeMenu}>Novels</Link>
                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li className="nav-item">
                            <Link className='nav-link' to='/popular' onClick={closeMenu}>Most Popular</Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={create}>Create</button>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/search' onClick={closeMenu}>Search</Link>
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
