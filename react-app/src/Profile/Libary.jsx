import React,{useEffect} from "react";
import "./Libary.css"

const Library = (userId) => {
  useEffect(() => {
    const userLibrary = async (userId) => {
      try {
        // Fetch Bookids from User
        const res = await fetch(`http://localhost:3001/api/library/${userId}`, {
          method: "GET",
          headers: 
          { "Content-Type": "application/json",
          'Accept': 'application/json', }
        });

        if (res.ok){
          const response = await res.json();
          console.log(response.data)
        }
        else{
          console.log("error")
        }


      } catch (err) {
        console.log(err);
      }
    };

    userLibrary(1);
  });


    return(
      <div className="Libary">
        <ul>
          <li className="BookList">TESTNNN</li>
        </ul>
      </div>  
    );    
};

//Logo,Title,TotalPages,CurrentPage
//Libary()


export default Library;

