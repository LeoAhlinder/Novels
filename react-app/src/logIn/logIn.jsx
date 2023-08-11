import React, { useState } from 'react';
import "./logIn.css"
import { loggedIn } from '../header/header';


const LogIn = () =>{



    const [inputFields, setInputFields] = useState([
        {placeholder:"Email", id:"email"},
        {placeholder:"Password", id:"password",type:"password"},
    ])

    const maxInputFields = 3;
    const addInputFieldAllowed = inputFields.length < maxInputFields;

    //Add a input field
    const addInputField = () =>{
        setInputFields([
            ...inputFields,
            {placeholder:"User Name",id:"userName"}
        ])
    }

    const createAccount = () =>
    {
        const logIn = inputFields.map((i) =>{
            const field = document.getElementById(i.id);
            return (field.id,field.value)
        })
    
    
        //Check if any of them are empty
        logIn[0] = logIn[0].length > 0 ? logIn[0] : "Empty";
        logIn[1] = logIn[1].length > 0 ? logIn[1] : "Empty";
        logIn[2] = logIn[2].length > 0 ? logIn[2] : "Empty";

        const requirments = ["Email","Password","Username"]
        var missingList = [];
        var missing = 0;

        const logins = []

        for (let i = 0;i < logIn.length;i++){
            if (logIn[i] === "Empty"){
                missing++
                missingList.push(requirments[i])
            }
            else{
                logins.push(logIn[i])
            }
        }

        var message = "";

        if (missing === 1){
            message = "Please fill in the " + missingList[0] + " input field"
        }
        else if(missing === 2){
            message = "Please fill in the " + missingList[0] + " and " + missingList[1] + " input fields"
        }
        else if(missing === 3){
            message = "Please fill the " + missingList[0] + ", " + missingList[1] + " and " + missingList[2] + " input fields"
        }
        if (message !== "")
            alert(message)
        else{
            createUser(logins)
        }
    }


    const createUser = async (logIns) =>{
        const user = {
            email:logIns[0],
            password:logIns[1],
            username:logIns[2]
        }
        try{
            const res = await fetch("http://localhost:3001/api/createaccount",{
                method:"POST",
                headers: {  
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body:JSON.stringify(user)
            });
            if (res.ok){
                const response = await res.json();
                console.log(response)
            }else{
                console.log("ERROR")
            }
        }catch(err){
            console.log(err)
        }
    }

    async function logInF(){

        const logIn = inputFields.map((i) =>{
            const field = document.getElementById(i.id);
            return (field.value)
        })
        
        try{
            const res = await fetch("http://localhost:3001/api/logIn",{
                method:"POST",
                headers: {  
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body:JSON.stringify(logIn)
            })
            if (res.ok){
                const response = await res.json()
                if (response.message === "user exist"){
                    loginDetailsCookies(response.token)
                }
                if (response.message === "no user exist"){
                    alert("No user with those loggins exist")
                }
            }
            else{
                console.log("error or some")
            }
        }catch(err)
        {
            console.log(err)
        }
    }

    function loginDetailsCookies(token){
       
        console.log(token);

        document.cookie = `authToken=${token}; path=/; secure; HttpOnly; SameSite=Strict`;

        function hasAuthTokenCookie() {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'authToken') {
                    return true;
                }
            }
            return false;
        }
        
        if (hasAuthTokenCookie()) {
            console.log("cookie in bannk")
        } else {
            // The client does not have the token
            // The user might not be logged in
            console.log("no cookie")
        }


    }


    return (
        <div className="loginBox">
            {inputFields.map((field) => (
                <input className='input' placeholder={field.placeholder} id={field.id} type={field.type} key={field.id}/>
            ))}
            <button className="Button" onClick={() =>logInF()}>Log In</button>
            <button className="Button" onClick={addInputFieldAllowed ? addInputField : createAccount}>Create Account</button>
        </div>
    );
}
export default LogIn;