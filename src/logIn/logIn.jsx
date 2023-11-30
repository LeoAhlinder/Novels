import React, { useState } from 'react';
import "./logIn.css"
import { useNavigate } from "react-router-dom"
import ErrorHandler from '../global/errorHandler';
import setCookie from "../global/setCookie";

const LogIn = () =>{

    const navigate = useNavigate();

    const [inputFields, setInputFields] = useState([
        {placeholder:"Email", id:"email"},
        {placeholder:"Password", id:"password",type:"password"},
    ])

    const [alerts,changeAlerts] = useState("")

    const maxInputFields = 3;
    const addInputFieldAllowed = inputFields.length < maxInputFields;

    //Add a input field
    const addInputField = () =>{
        changeClass("createNew")
        setInputFields([
            ...inputFields,
            {placeholder:"User Name",id:"userName"}
        ])
    }
    const createAccount = () => {
        // Get values from input fields
        const logIns = inputFields.map((i) => document.getElementById(i.id).value);
      
        // Check if any input field is empty
        const missingList = inputFields
          .map((field, index) => (logIns[index].trim() === '' ? field.placeholder : ''))
          .filter((placeholder) => placeholder !== '');
      
        if (missingList.length > 0) {
          const message =
            missingList.length === 1
              ? `Please fill in the ${missingList[0]} input field`
              : `Please fill in the following input fields: ${missingList.join(', ')}`;
          alert(message);
        } else {
          createUser(logIns);
        }
      };

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
                if (response.message === "both exist"){
                    changeAlerts("The email and username is already in use")
                }
                else if (response.message === "email exist"){
                    changeAlerts("Email already in use")
                }
                else if (response.message === "userName exist"){
                    changeAlerts("Username already in use")
                }
                else if (response.message === "user created"){
                    logInF()
                }
            }else{
                let error = ErrorHandler(res)
                alert(error.message)
                if (error.navigate.length > 0){
                    navigate(error.navigate)
                }
            }
        }catch(err){
            let errorCatch = ErrorHandler(err)
            alert(errorCatch.message)
            if (errorCatch.navigate.length > 0){
                navigate(errorCatch.navigate)
            }   
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
                    setCookie("authToken",response.token,720) //Name,data,expire date in hours

                    const userName = response.userName;
                    localStorage.setItem("userName",userName)
                    //setLoggedIn(true);
                    navigate("/Profile");
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

    const [boxClass,changeClass] = useState("loginBox")


    return (
        <div className={boxClass}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            {inputFields.map((field) => (
                <input className='input' placeholder={field.placeholder} id={field.id} type={field.type} key={field.id}/>
            ))}
            <button type='button' className="Button" onClick={() =>logInF()}>Log In</button>
            <button type="button" className="Button" onClick={addInputFieldAllowed ? addInputField : createAccount}>Create Account</button>
            <p id='alert'>{alerts}</p>
        </div>
    );
}

export default LogIn;
