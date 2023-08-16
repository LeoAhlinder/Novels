import React from "react";
import "./createstyle.css"
import { useNavigate } from "react-router";

const Create = () =>{

    const navigate = useNavigate()

    const CreateNew = () =>{
        navigate("./createNovel")
    }

    return(
        <div className="sideBar">
            <h1 >Dashboard</h1>
            <button className="button">WorkSpace</button>
            <br />
            <button className="button" onClick={CreateNew}>New Novel</button>

        </div>
    );
}

export default Create;