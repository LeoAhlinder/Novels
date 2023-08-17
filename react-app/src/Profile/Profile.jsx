import { useState } from "react";
import "../Profile/profile.css"
import Library from "./Libary"
import { useNavigate } from "react-router-dom"

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

    const info = () =>{
        changeSelected("1")
    }
    const Comments = () =>{
        changeSelected("2")
    }
    const NovelCreated = () =>{
        changeSelected("3")
    }
    const LibraryButton = () =>{
        changeSelected("4")
    }
    const Reviews = () =>{
        changeSelected("5")
    }
  
    return (
        <div>
            <div className='profileHeader'>
                <h1 className='profileHeader'>Profile Page</h1>
                <button onClick={logOut} className='logout'>Log Out</button>
                <p className='userName'>Welcome, {userName}</p>
                <button onClick={info}className={selected === "1" ? "InfobuttonClicked" : "InfoButton"}>Info</button>
                <button onClick={Comments} className={selected === "2" ? "CommentsbuttonClicked" : "Comments"}>Comments</button>
                <button onClick={NovelCreated}className={selected === "3" ? "NovelsCreatedButtonClicked" : "NovelsCreated"}>Novels Created</button>
                <button onClick={LibraryButton} className={selected === "4" ? "LibraryButtonClicked" : "LibraryButton"}>Library</button>
                <button onClick={Reviews} className={selected === "5" ? "ReviewsButtonClicked" : "ReviewButton"}>Reviews</button>
            </div>
            <div>
                {selected === "4" ? <Library/>: ""}
            </div>
        </div>
    );
}

export default Profile;
