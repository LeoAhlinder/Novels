import { useState } from "react";
import "../Profile/profileStyle.css"
import Library from "./Library"
import { useNavigate } from "react-router-dom"
import NovelCreated from "./profileComponents/novelsCreated";
import Cookies from 'js-cookie'


const Profile = () => {
    const navigate = useNavigate();

    if (!Cookies.get("authToken")){
        logOut()
    }

    function logOut(){
        Cookies.remove("authToken")
        localStorage.removeItem("userName")
        navigate("/")
    }

    const userName = localStorage.getItem("userName")

    const [selected,changeSelected] = useState(localStorage.getItem("selectedProfile"))

    localStorage.setItem("selectedProfile",selected)

    const updatedSelected = (test) =>{
        changeSelected(test)
    }
  
    return (
        <div>
            <div className='profileHeader'>
                <h1 id="profilePageText">Profile Page</h1>

                <button onClick={logOut} className='logout'>Log Out</button>
                <p className='userName'>Welcome {userName}</p>
                <button onClick={() => updatedSelected("1")}className={selected === "1" ? "buttonClicked" : "profileButton"} id="infoButton">Info</button>
                <button onClick={() => updatedSelected("2")} className={selected === "2" ? "buttonClicked" : "profileButton"} id="commentsButton">Comments</button>
                <button onClick={() => updatedSelected("3")}className={selected === "3" ? "buttonClicked" : "profileButton"} id="novelsCreatedButton">Novels Created</button>
                <button onClick={() => updatedSelected("4")} className={selected === "4" ? "buttonClicked" : "profileButton"} id="libraryButton">Library</button>
                <button onClick={() => updatedSelected("5")} className={selected === "5" ? "buttonClicked" : "profileButton"} id="reviewButton">Reviews</button>
            </div>
            <div className="profileHeaderSmall">

                <button onClick={() => updatedSelected("1")} className="item">
                    <p>Info</p>             
                </button>
                <button onClick={() => updatedSelected("2")}className="item">
                    <p>Comments</p>
                </button>
                <button onClick={() => updatedSelected("3")} className="item">
                    <p>Library</p>                
                </button>
                <button onClick={() => updatedSelected("4")} className="item">
                   <p> Novels Created</p>
                </button>
                <button onClick={() => updatedSelected("5")} className="item">
                    <p>Reviews</p>
                </button>
                <button className="item">
                    <p>Log Out</p>
                </button>
            </div>
            <div>
                {selected === "4" ? <Library/>: ""}
                {selected === "3" ? <NovelCreated/>:""}
            </div>
        </div>
    );
}

export default Profile;
