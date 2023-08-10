import React from "react";
import "./logIn.css"

const logIn = () =>{
    const createAccount = () =>{
        var inputBox = document.querySelector("loginBox")
        var newInput = document.createElement("input")
        newInput.setAttribute("className","input")
        newInput.setAttribute("type","text")

        inputBox.appendChild(newInput);
    }


    return (
        <div className="loginBox">
            <input type="text" className="input" placeholder="Email"/>
            <input className="input" type="password" placeholder="Password"/>
            <button className="Button">Log In</button>
            <button className="Button"onClick={createAccount} >Create Account</button>
        </div>
    );
}

export default logIn;