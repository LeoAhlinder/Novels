import React, { useState } from 'react';
import "./logIn.css"
import { useNavigate } from "react-router-dom"
import validator from "email-validator";

import LoginForm from '../Components/logInComp/logInForm';
import ChangeDocumentTitle from '../Global/changeDocumentTitle';

const LogIn = () =>{

    ChangeDocumentTitle("Log In")

    const navigate = useNavigate();

    const [inputFields, setInputFields] = useState([
        {placeholder:"Username", id:"userName"},
        {placeholder:"Password", id:"password",type:"password"},
    ])
    const [termsOfService,changeTermsOfService] = useState(false)
    const [alerts,changeAlerts] = useState("")

    const maxInputFields = 3;
    const addInputFieldAllowed = inputFields.length < maxInputFields;

    //Add a input field
    const addInputField = () =>{
        changeClass("createNew")
        setInputFields([
            ...inputFields,
            {placeholder:"Email",id:"userEmail"}
        ])
    }

    const removeInputField = () =>{
        setInputFields(inputFields.slice(0,-1))
    }

    const createUser = async () =>{

        const logIns = inputFields.map((i) => document.getElementById(i.id).value);

        if (checkInputFields() === true)
        {
            const user = {
                username:logIns[0],
                password:logIns[1],
                email:logIns[2]
            }
            if (checkEmail(user.email) === true){
                try{
                    if (termsOfService === false){
                        alert("Please accept the terms of service")
                        return
                    }
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/createaccount`,{
                        method:"POST",
                        headers: {  
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body:JSON.stringify(user)
                    });
                    if (res.ok){
                        const response = await res.json();
                        if (response.error){
                            changeAlerts("Please select another username and email")
                        }
                        else if (response.message === "both exist"){
                            changeAlerts("The email and username is already in use")
                        }
                        else if (response.message === "email exist"){
                            changeAlerts("Email already in use")
                        }
                        else if (response.message === "userName exist"){
                            changeAlerts("Username already in use")
                        }
                        else if (response.message === "user created"){
                            logIn()
                        }
                    }else{
                        navigate("/error")
                    }
                }catch(err){
                    navigate("/error") 
                }
            }else{
                alert("Please enter a valid email")
            }
        }
    }

    const checkEmail = (email) => {
        if (validator.validate(email) === true){
            return true
        }
        else{
            return false
        }
    }

    const checkInputFields = () =>{
        const logIns = inputFields.map((i) => document.getElementById(i.id).value);
        const missingList = inputFields
        .map((field, index) => (logIns[index].trim() === '' ? field.placeholder : ''))
        .filter((placeholder) => placeholder !== '');
        if (missingList.length > 0) {
            const message =
            missingList.length === 1
                ? `Please fill in the ${missingList[0]} input field`
                : `Please fill in the following input fields: ${missingList.join(', ')}`;
            alert(message)
        }
        else{
            return true
        }
    }

    async function logIn(){

        if (checkInputFields() === true){

            const logIn = inputFields.map((i) =>{
                const field = document.getElementById(i.id);
                return (field.value)
            })
            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/logIn`,{
                    method:"POST",
                    headers: {  
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true"
                    },
                    credentials: 'include',
                    body:JSON.stringify(logIn)
                })
                if (res.ok){
                    const response = await res.json()
                    if (response.message === "user exist"){
                        const userName = response.userName;
                        localStorage.setItem("userName",userName)
                        navigate("/Profile");
                    }
                    if (response.message === "no user exist"){
                        alert("No user with those login details exist")
                    }
                }
                else{
                    navigate("/error")
                }
            }catch(err)
            {
                navigate("/error")
            }
        }
    }

    const [boxClass,changeClass] = useState("loginBox")

    const termsOfServiceClick = (e) =>{
        changeTermsOfService(e.target.checked)
    }

    return (
        <LoginForm
            boxClass={boxClass}
            inputFields={inputFields}
            logIn={logIn}
            addInputFieldAllowed={addInputFieldAllowed}
            addInputField={addInputField}
            createUser={createUser}
            changeClass={changeClass}
            removeInputField={removeInputField}
            alerts={alerts}
            termsOfServiceClick={termsOfServiceClick}
      />
    );
}

export default LogIn;
