import React, {useEffect} from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ChangeDocumentTitle from "../../Global/changeDocumentTitle";

const AdminPanel = () => {

    ChangeDocumentTitle("Admin Panel")

    const navigate = useNavigate()

    useEffect(()=>{
        const checkAuthorization = async () =>{
            try{

                const token = Cookies.get("adminToken")

                const res = await fetch("${process.env.REACT_APP_API_URL}/api/admin/access",{
                    method:"GET",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.ok){
                    const response = await res.json()
                    if (response.message === "success"){
                    }
                    else{
                        navigate("/adminlogin")
                    }
                }
                else{
                    navigate("/error")
                }
            }
            catch(err){
                navigate("/error")
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