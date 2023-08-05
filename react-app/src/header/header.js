import React from 'react';
import "./headerStyle.css"

const Header = () =>{

    const profileButtonClicked = async () =>{
        try{
            const respone = await fetch("/api/profile",{
                method:"GET",
                headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }});
        }
        catch(err){
            console.log(err)
        }
    }



    return(
        <div className="headerDesign">
            <div className="header">
                <button className='button'>Hits</button>
                <button className='button'>Best Selling</button>
                <button className='button'>Create</button>
                <button className='button'>Search</button>
                <button className='profileButton' onClick={profileButtonClicked}>Profile</button>
                <button className='profileButton'>Libary</button>
            </div>
        </div>
    )
}

export default Header;