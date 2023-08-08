import React, { useEffect} from 'react';
import "../Profile/profile.css"
import Libary from "./Libary"

let i = 0


const Profile = () => {
    console.log(i)
    i++
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/profile", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const response = await res.json();
                //console.log(response.message)
                if (!response.ok) {
                    console.log(response);
                } else {
                    console.log(response.message)
                }
            } catch (err) {
                console.log("error"+err);
            }
        };

        fetchData();
    },);

    return (
        <div>
            <h1 className='profileHeader'>Profile Page</h1>
            <Libary/>
        </div>
    );
}

export default Profile;
