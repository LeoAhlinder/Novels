import { useEffect, useState } from "react";
import "../Profile/profileStyle.css"
import { useNavigate } from "react-router-dom"
import CheckToken from "../Global/checkToken";
import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import removeHttpCookie from "../Global/removeHttpCookie";

import Library from "./Library"
import NovelCreated from "./profileComponents/novelsCreated/novelsCreated";
import Info from "./profileComponents/Info/Info";

const Profile = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    ChangeDocumentTitle("Profile | Novels")

    const navigate = useNavigate();

    async function logOut(){
        const res = await removeHttpCookie()
        if (res === true){
            navigate("/")
            localStorage.removeItem("userName")
        }
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
            else if (token === "valid") {
                setLoggedIn(true)
            }
        }
        checkToken()
    },[])

    return (
        <>
            {loggedIn === false ? "" : 
            <>
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
                    <button onClick={() => changeSelected("Info")} className="item" id={selected === "Info" ? "itemSelected" : ""}>
                        <p>Info</p>             
                    </button>
                    <button onClick={() => changeSelected("Comments")}className="item" id={selected === "Comments" ? "itemSelected" : ""}>
                        <p>Comments</p>
                    </button>
                    <button onClick={() => changeSelected("NovelCreated")} className="item" id={selected === "NovelCreated" ? "itemSelected" : ""}>
                    <p>Novels Created</p>
                    </button>
                    <button onClick={() => changeSelected("Library")} className="item" id={selected === "Library" ? "itemSelected" : ""}>
                        <p>Library</p>                
                    </button>
                    <button onClick={() => changeSelected("Reviews")} className="item" id={selected === "Reviews" ? "itemSelected" : ""}>
                        <p>Reviews</p>
                    </button>
                    <button className="item" onClick={logOut}>
                        <p>Log Out</p>
                    </button>
                </div>
                <div>
                    {selected === "NovelCreated" && <NovelCreated/>}
                    {selected === "Library" && <Library/>}
                    {selected === "Info" && <Info/>}
                </div>
            </>
            }
        </>
    );
}

export default Profile;
