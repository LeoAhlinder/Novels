import React, {useEffect} from "react";
import { get } from "../../server";

const ChapterPage = () => {


    useEffect(()=>{
        const getChapterInfo = async () =>{
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chapterInfo`,{
                method:"GET",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            const response = await res.json();

            console.log(response)
        }

        getChapterInfo();
    },[])


    return(
        <div>
            <h1>Chapter Page</h1>
        </div>
    )
}

export default ChapterPage;