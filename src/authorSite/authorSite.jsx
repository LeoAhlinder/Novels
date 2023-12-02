import React, {useEffect ,useState}from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router";

import "./authorSiteStyle.css"
import forestpic from "../Pictures/forest.webp"


const AuthorSite = () =>{

    const navigate = useNavigate()

    const [authorInfo,setAuthorInfo] = useState([])
    const { authorName } = useParams();
    const [authorFound,changeAuthorFound] = useState(true)  

    useEffect(()=>{

        const fetchAuthorInfo = async () =>{
            try{
                const res = await fetch(`http://localhost:3001/api/authorInfo?authorName=${authorName}`,{
                    method:"GET",
                    headers:{    
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    }
                });
                if (res.ok){
                    const response = await res.json()
                    if (response.message === "no author found"){
                        changeAuthorFound(false)
                        setAuthorInfo([])
                    }
                    else{
                        setAuthorInfo(response.books)
                        changeAuthorFound(true)
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
        fetchAuthorInfo()
        

    },[authorName])

    const goToBook = (book) =>{
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
    }

    return(
        <div className="authorInfoContainer">
          {authorFound === false ? <h1 id="noAuthorFound">No author found</h1> : authorInfo.map((book,index) => (
              <li key={index} className="authorBookItem" onClick={() => goToBook(book)}>
                <h3 id="Title">{book.title}</h3>

                <div id="bookContainer">
                    <img id="bookPicture" src={forestpic} alt="Book picture" />
                </div>
              </li>
          ))}
        </div>
      )
}


export default AuthorSite;