import React from 'react';
import "./headerStyle.css"

const Header = () =>{
    return(
        <div className="headerDesign">
            <div className="header">
                <button className='button'>Hits</button>
                <button className='button'>Best Selling</button>
                <button className='button'>Create</button>
                <button className='button'>Search</button>
                <button className='profileButton'>Profile</button>
                <button className='profileButton'>Libary</button>
            </div>
        </div>
    )
}

export default Header;