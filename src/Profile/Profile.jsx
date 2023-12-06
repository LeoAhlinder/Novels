import { useEffect, useState } from "react";
import "../Profile/profileStyle.css"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import CheckToken from "../Global/checkToken";
import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import NovelCreated from "../Profile/profileComponents/novelsCreated"
import Library from "./Library"

const Profile = () => {

    ChangeDocumentTitle("Profile")

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

    useEffect(() => {
        const checkToken = async () => {
            const token = await CheckToken();
            if (token === "invalid") {
                navigate("/login")
            }
        }
        checkToken()
    },[])

    return (
        <div>
            <div className='profileHeader'>
                <h1 id="profilePageText">Profile Page</h1>

                <button onClick={logOut} className='logout'>Log Out</button>
                <p className='userName'>Welcome {userName}</p>
                <button onClick={() => changeSelected("Info")}className={selected === "Info" ? "buttonClicked" : "profileButton"} id="infoButton">Info</button>
                <button onClick={() => changeSelected("Comments")} className={selected === "Comments" ? "buttonClicked" : "profileButton"} id="commentsButton">Comments</button>
                <button onClick={() => changeSelected("NovelCreated")}className={selected === "NovelCreated" ? "buttonClicked" : "profileButton"} id="novelsCreatedButton">Novels Created</button>
                <button onClick={() => changeSelected("Library")} className={selected === "Library" ? "buttonClicked" : "profileButton"} id="libraryButton">Library</button>
                <button onClick={() => changeSelected("Reviews")} className={selected === "Reviews" ? "buttonClicked" : "profileButton"} id="reviewButton">Reviews</button>
            </div>
            <div className="profileHeaderSmall">
                <button onClick={() => changeSelected("Info")} className="item">
                    <p>Info</p>             
                </button>
                <button onClick={() => changeSelected("Comments")}className="item">
                    <p>Comments</p>
                </button>
                <button onClick={() => changeSelected("NovelsCreated")} className="item">
                   <p> Novels Created</p>
                </button>
                <button onClick={() => changeSelected("Library")} className="item">
                    <p>Library</p>                
                </button>
                <button onClick={() => changeSelected("Reviews")} className="item">
                    <p>Reviews</p>
                </button>
                <button className="item" onClick={logOut}>
                    <p>Log Out</p>
                </button>
            </div>
            <div>
                {selected === "NovelCreated" && <NovelCreated/>}
                {selected === "Library" && <Library/>}
            </div>
        </div>
    );
}

export default Profile;
