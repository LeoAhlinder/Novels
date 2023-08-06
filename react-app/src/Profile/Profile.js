import React, { useEffect} from 'react';

let i = 0


const Profile = () => {
    console.log(i)
    i++
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/profile", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const response = await res.json();
                console.log(response.message)
                if (!response.ok) {
                    console.log(response);
                } else {
                    console.log(response.message)
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    },);

    return (
        <div>
            <h1>Profile Page</h1>
            <p>test</p>
        </div>
    );
}

export default Profile;
