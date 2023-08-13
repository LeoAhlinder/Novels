import React, { useEffect} from 'react';
import "../Profile/profile.css"
import Library from "./Libary"
import { useNavigate } from "react-router-dom"

const Profile = () => {
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {

                const token = localStorage.getItem("authToken")

                const res = await fetch("http://localhost:3001/api/profile", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                const response = await res.json();
                //console.log(response.message)
                if (!response.ok) {
                    //console.log(response);
                } else {
                    //console.log(response.message)
                }
            } catch (err) {
                console.log("error"+err);
            }
        };

        fetchData();


        if (localStorage.getItem("authToken")){
            console.log("exist")
        }
        else{
            logOut()
        }

    },);

    function logOut(){
        localStorage.removeItem("authToken")
        localStorage.setItem("logIn_status","false")
        navigate("/")

    }

    return (
        <div>
            <div className='profileHeader'>
                <h1 className='profileHeader'>Profile Page</h1>
                <button onClick={logOut} className='logout'>Log Out</button>
            </div>
            <div>
                <Library/>
            </div>
        </div>
    );
}

export default Profile;
