import { useState } from "react";
import "../Profile/profile.css"
import Library from "./Libary"
import { useNavigate } from "react-router-dom"
import NovelCreated from "./ProfileComponents/NovelsCreated";

const Profile = () => {
    const navigate = useNavigate();

    if (!localStorage.getItem("authToken")){
        logOut()
    }

    function logOut(){
        localStorage.removeItem("authToken")
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
                <h1 className='profileHeader'>Profile Page</h1>
                <button onClick={logOut} className='logout'>Log Out</button>
                <p className='userName'>Welcome {userName}</p>
                <button onClick={() => updatedSelected("1")}className={selected === "1" ? "InfobuttonClicked" : "InfoButton"}>Info</button>
                <button onClick={() => updatedSelected("2")} className={selected === "2" ? "CommentsbuttonClicked" : "Comments"}>Comments</button>
                <button onClick={() => updatedSelected("3")}className={selected === "3" ? "NovelsCreatedButtonClicked" : "NovelsCreated"}>Novels Created</button>
                <button onClick={() => updatedSelected("4")} className={selected === "4" ? "LibraryButtonClicked" : "LibraryButton"}>Library</button>
                <button onClick={() => updatedSelected("5")} className={selected === "5" ? "ReviewsButtonClicked" : "ReviewButton"}>Reviews</button>
            </div>
            <div className="profileHeaderSmall">

                <button onClick={() => updatedSelected("1")} className="item item-large">
                    Info
                </button>
                <button onClick={() => updatedSelected("2")}className="item item-large">
                    Comments
                </button>
                <button onClick={() => updatedSelected("3")} className="item">
                    Library
                </button>
                <button onClick={() => updatedSelected("4")} className="item">
                    Novels Created
                </button>
                <button onClick={() => updatedSelected("5")} className="item">
                    Reviews
                </button>
                <button className="item">
                    Log Out
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
