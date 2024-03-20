import React, { useEffect, useState } from 'react';
import "./logIn.css"
import { useNavigate } from "react-router-dom"
import validator from "email-validator";

import LoginForm from '../Components/logInComp/logInForm';
import ChangeDocumentTitle from '../Global/changeDocumentTitle';
import CheckToken from '../Global/checkToken';

const LogIn = () =>{

    ChangeDocumentTitle("Log In | Novels")

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

    useEffect(() => {
        const check = async () => {
            const token = await CheckToken();
            if (token === "valid") {
                navigate("/Profile");
            }
        }
        check();
    }, []);

    const createUser = async () =>{
        try{
        const logIns = inputFields.map((i) => document.getElementById(i.id).value);

        if (checkInputFields() === true)
        {
            const user = {
                username:logIns[0],
                password:logIns[1],
                email:logIns[2]
            }
            if (checkEmail(user.email) === true){
                
                    if (termsOfService === false){
                        changeAlerts("Please accept the terms of service")
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
                        if (response.error) {
                            switch(response.error) {
                                case "Invalid email":
                                    changeAlerts("Please enter a valid email");
                                    break;
                                case "Invalid username":
                                    changeAlerts("Please enter a valid username, no special characters allowed");
                                    break;
                                case "Empty input fields":
                                    changeAlerts("Please fill in all the fields");
                                    break;
                                case "Password is too long":
                                    changeAlerts("Password is too long, max 20 characters");
                                    break;
                                case "Password is too short":
                                    changeAlerts("Password is too short, minimum 5 characters");
                                    break;
                                case "Username is too long":
                                    changeAlerts("Username is too long, maxixmum 20 characters");
                                    break;
                                default:
                                    changeAlerts("An error occurred, please try again");
                            }
                        } else if (response.message) {
                            switch(response.message) {
                                case "both exist":
                                    changeAlerts("The email and username are already in use");
                                    break;
                                case "email exist":
                                    changeAlerts("Email already in use");
                                    break;
                                case "userName exist":
                                    changeAlerts("Username already in use");
                                    break;
                                case "user created":
                                    logIn();
                                    break;
                                default:
                                    changeAlerts("An error occurred, please try again");
                            }
                        } else {
                            changeAlerts("An error occurred, please try again")
                        }

                    }else{
                        changeAlerts("An error occurred, please try again")
                    }                
                }else{
                    changeAlerts("Please enter a valid email")
                }
            }
            else{
                changeAlerts("Please fill in all the input fields")
            }
        }catch(err){
            navigate("/error")
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
            changeAlerts(message)
        }
        else{
            return true
        }
    }

    window.addEventListener("keypress", (e) => {
        if (e.key === "Enter"){
            logIn()
        }
    });

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
                        changeAlerts("No user with those login details exist")
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
