import React, { useState } from 'react';
import "./logIn.css"

const LogIn = () =>{



    const [inputFields, setInputFields] = useState([
        {placeholder:"Email", id:"email"},
        {placeholder:"Password", id:"password"},
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
            console.log(logins)
        }
    }


    //const 

    return (
        <div className="loginBox">
            {inputFields.map((field) => (
                <input className='input' placeholder={field.placeholder} id={field.id}/>
            ))}
            <button className="Button">Log In</button>
            <button className="Button" onClick={addInputFieldAllowed ? addInputField : createAccount}>Create Account</button>
        </div>
    );
}
export default LogIn;