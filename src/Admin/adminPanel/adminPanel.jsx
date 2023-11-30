import { use } from "chai";
import React from "react";

const AdminPanel = () => {

    useEffect(()=>{
        const checkAuthorization = async () =>{
            try{
                const res = await fetch("http://localhost:3001/api/admin/access",{
                    method:"GET",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.ok){
                    const response = await res.json()
                    console.log(response)
                }
            }
            catch(err){
                console.log(err)
            }
        }
        checkAuthorization()
    },[])


    return(
        <div>
            <h1>Admin Panel</h1>
        </div>
    )
}

export default AdminPanel;