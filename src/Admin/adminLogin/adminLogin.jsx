import React, {useState} from "react";

import LoginForm from "../../Components/logInComp/logInForm";
import ErrorHandler from "../../Global/errorHandler";

const AdminLogin = () =>{

    const boxClass = "loginBox"

    const inputFields = [
        {placeholder:"Email", id:"email"},
        {placeholder:"Password", id:"password",type:"password"}
    ]


    const logIn = async () =>{
        try{
            const res = await fetch("http://localhost:3001/api/admin/login",{
                method:"POST",
                headers: {  
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body:JSON.stringify(logIn)
            })
            if (res.ok){
                const response = await res.json()
                if (response.message === "admin exist"){
                    
                }
                if (response.message === "no admin exist"){
                    alert("No admin with those login details exist")
                }
            }
            else{
                let error = ErrorHandler(res)
                alert(error.message)
            }
        }catch(err)
        {
            let error = ErrorHandler(err)
            alert(error.message)
        }
    }


    return(
        <LoginForm
            boxClass={boxClass}
            logIn={logIn}
            inputFields={inputFields}
            type={"admin"}
      />
    )
}

export default AdminLogin;