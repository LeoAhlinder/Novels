import React ,{useState} from "react";
import "./infoStyle.css"

import removeHttpCookie from "../../../Global/removeHttpCookie";
import { useNavigate } from "react-router";

const Info = () =>{

    const [deleteAccountAlertVisible,changeDeleteAccountAlertVisible] = useState(false)

    const navigate = useNavigate()

    async function logOut(){
        const res = await removeHttpCookie()
        if (res === true){
            navigate("/")
            localStorage.removeItem("userName")
        }
    }


    return (
        <>
            <div id="infoContainer">
                <h1 id="infoHeader">Profile Info</h1>
                <div id="profileInfoColumn">
                    <div className="profileInfo">
                        <div className="infoType">Username</div>
                        <div className="Info">1</div>
                    </div>
                    <div className="profileInfo">
                        <div className="infoType">Email</div>
                        <div className="Info">1</div>
                    </div> <div className="profileInfo">
                        <div className="infoType">Account created</div>
                        <div className="Info">1</div>
                    </div> <div className="profileInfo">
                        <div className="infoType">Books created</div>
                        <div className="Info">1</div>
                    </div>
                    <div id="profileButtonContainer">
                        <button className="profileInfoButton" id="logOutButton" onClick={() => logOut()}>Log out</button>
                        <button className="profileInfoButton" id="deleteAccountButton" onClick={() => changeDeleteAccountAlertVisible(true)}>Delete Account</button>
                    </div>
                    {deleteAccountAlertVisible === true ? <>
                    <p id="deleteAccountAlertText">Are you sure you want to delete your account?</p> 
                    <div id="deleteAccountButtonContainer">
                        <button className="deleteAccountConfirmButtons" onClick={() => logOut()}>Yes</button>
                        <button className="deleteAccountConfirmButtons" onClick={() => changeDeleteAccountAlertVisible(true)}>No</button>
                    </div> </>  : ""}

                </div>
            </div>
        </>
    )
}

export default Info;