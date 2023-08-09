import React,{useEffect} from "react";
import "./Libary.css"

const Libary =(bookIds) =>{


    useEffect(()=>{
      try{
        const userLibrary = async () =>{
          //Fetch Bookids from User
          const res = await fetch("http://localhost:3001/api/library",{
            method:"GET",
            headers:{"Content-Type":"application/json"}
          });
            const response = res.json();
            console.log(response)
          
        }
      }catch(err){
        console.log(err)
      }
    })

  


    return(
      <div className="Libary">
        <ul>
          <li className="BookList">TESTNNN</li>
        </ul>
      </div>  
    );
    
    
}

//Logo,Title,TotalPages,CurrentPage
//Libary()


export default Libary;

