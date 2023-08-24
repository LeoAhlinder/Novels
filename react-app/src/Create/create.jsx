import React from "react";
import "./createstyle.css"
import { useNavigate } from "react-router";

const Create = () =>{

    const navigate = useNavigate()

    const CreateNew = () =>{
        navigate("./createNovel")
    }

    return(
        <div>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div className="sideNav">
                <h1>Dashboard</h1>
                <button className="button">WorkSpace</button>
                <button className="button" onClick={CreateNew}>New Novel</button>

            </div>
        </div>

    
    );
}

export default Create;