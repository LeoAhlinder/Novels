import React, { useState } from 'react';
import "./logIn.css"

const LogIn = () =>{



    const [inputFields, setInputFields] = useState([
        {placeholder:"Email", id:"email"},
        {placeholder:"Password", id:"password"},
    ])

    const maxInputFields = 3;
    const addInputFieldAllowed = inputFields.length < maxInputFields;

    const addInputField = () =>{
        setInputFields([
            ...inputFields,
            {placeholder:"User Name",id:"userName"}
        ])
    }

    const createAccount = () =>{
        console.log("create account")

        const logIn = inputFields.map((i) =>{
            const value = document.getElementById(i.id)
            return (value.id,value.value)
        })
    console.log(logIn)
    }

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