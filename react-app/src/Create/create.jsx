import React, { useState } from "react";
import "./createstyle.css"
import { useNavigate } from "react-router";

const Create = () =>{

    const [sidebarActive,setbarActive] = useState(false)

    function sideNavBar(){
        setbarActive(!sidebarActive)
        console.log(sidebarActive)
    }

    const navigate = useNavigate()

    const CreateNew = () =>{
        navigate("./createNovel")
    }

    return(
        <div>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div className={`sideNav ${sidebarActive ? 'active' : ''}`}>
                <h1 className="title">Dashboard</h1>
                <button className="button" id="workspace">WorkSpace</button>
                <button className="button" id="new" onClick={CreateNew}>New Novel</button>
            </div>
            <div className="sideNavBar">
                <button type="button" className="sidebar" onClick={() =>sideNavBar()}></button>

            </div>
        </div>

    
    );
}

export default Create;