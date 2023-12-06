import React from "react";
import "./createstyle.css"
import { useNavigate } from "react-router";

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

const Create = () =>{

    ChangeDocumentTitle("Create")

    const navigate = useNavigate()

    const CreateNew = () =>{
        navigate("/createnovel")
    }

    return(
        <div>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div className={`sideNav`}>
                <h1 className="title">Dashboard</h1>
                <button className="button" id="workspace">WorkSpace</button>
                <button className="button" id="new" onClick={CreateNew}>New Novel</button>
            </div>
        </div>
    );
}

export default Create;