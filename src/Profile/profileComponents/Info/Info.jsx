import React ,{useState,useEffect} from "react";
import "./infoStyle.css"

import removeHttpCookie from "../../../Global/removeHttpCookie";
import { useNavigate } from "react-router";
import ChangeDocumentTitle from "../../../Global/changeDocumentTitle";

const Info = () =>{

    ChangeDocumentTitle("Profile Info | Novels")

    const [deleteAccountAlertVisible,changeDeleteAccountAlertVisible] = useState(false)
    const [userName,changeUserName] = useState("")
    const [email,changeEmail] = useState("")
    const [accountCreated,changeAccountCreated] = useState("")
    const [booksCreated,changeBooksCreated] = useState("")

    const navigate = useNavigate()

    async function logOut(){
        try{
            const res = await removeHttpCookie()
            if (res === true){
                navigate("/")
                localStorage.removeItem("userName")
            }
        }
        catch(error){
            navigate("/error")
        }
    }

    async function deleteAccount (){
        try
        {
            const res = await fetch (`http://152.42.128.44:3001/api/deleteAccount`,{
                method:"DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Allow-Credentials": "true"
                },
                credentials:"include"
            });
            const response = await res.json();
            if (response.message === "Account deleted"){
                logOut()
            }
            else{
                navigate("/error")
            }
        }catch(error){
            navigate("/error")
        }
    }

    useEffect(() => {
        const getProfileInfo = async () => 
        {
            try{
                const res = await fetch(`http://152.42.128.44:3001/api/getUserInfo`,{
                    method:"GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true"
                    },
                    credentials:"include"
                });
                if (res.ok){
                    const response = await res.json();
                    if (response.message === "success")
                    {
                        changeUserName(response.userData.userName)
                        changeEmail(response.userData.userEmail)
                        changeAccountCreated(response.userData.dateCreated.split("T")[0])
                        changeBooksCreated(response.books)
                    }
                    else{
                        noUserFound()
                    }
                    
                }
                else{
                    noUserFound()

                }
           }catch(error){
                noUserFound()
           }
        }
        getProfileInfo()
    },[])

    function noUserFound(){
        changeUserName("No user found")
        changeEmail("No Email found")
        changeAccountCreated("No Date found")
        changeBooksCreated("No Info found")
    }


    return (
        <>
            <div id="infoContainer">
                <h1 id="infoHeader">Profile Info</h1>
                <div id="profileInfoColumn">
                    <div className="profileInfo">
                        <div className="infoType">Username</div>
                        <div className="Info">{userName}</div>
                    </div>
                    <div className="profileInfo">
                        <div className="infoType">Email</div>
                        <div className="Info">{email}</div>
                    </div> <div className="profileInfo">
                        <div className="infoType">Account created</div>
                        <div className="Info">{accountCreated}</div>
                    </div> <div className="profileInfo">
                        <div className="infoType">Books created</div>
                        <div className="Info">{booksCreated}</div>
                    </div>
                    <div id="profileButtonContainer">
                        <button className="profileInfoButton" id="logOutButton" onClick={() => logOut()}>Log out</button>
                        <button className="profileInfoButton" id="deleteAccountButton" onClick={() => changeDeleteAccountAlertVisible(true)}>Delete Account</button>
                    </div>
                    {deleteAccountAlertVisible === true ? <>
                    <p id="deleteAccountAlertText">Are you sure you want to delete your account?</p> 
                    <div id="deleteAccountButtonContainer">
                        <button className="deleteAccountConfirmButtons" onClick={() => deleteAccount()}>Yes</button>
                        <button className="deleteAccountConfirmButtons" onClick={() => changeDeleteAccountAlertVisible(false)}>No</button>
                    </div> </>  : ""}
                </div>
            </div>
        </>
    )
}

export default Info;