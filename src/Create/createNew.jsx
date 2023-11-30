import React, { useState } from "react";
import "./createnewstyle.css"
import ErrorHandler from "../Global/errorHandler";
import { useNavigate } from "react-router-dom";

const CreateNew = () =>{

    const navigate = useNavigate()

    const [bookName,changeBookName] = useState("")
    const [summary,changeSummary] = useState("")
    const [genre,setGenre] = useState("")
    const [language,changeLanguage] = useState("")
    const [tags,changeTags] = useState("")
    const [warnings,changeWarnings] = useState("")
    const [alert,changeAlert] = useState("")
    const [alertColor,changeAlertColor] = useState({})

    const handleInputChangeBookName = (e) => {
        changeBookName(e.target.value)
    }
    
    const handleSummaryChange = (e) =>{
        changeSummary(e.target.value)
    }

    const handleLanguage = (e) =>{
        changeLanguage(e.target.value)
    }

    const handleGenreChange = (e) =>{
        setGenre(e.target.value)
    }

    const handleWarnings = (e) =>{
        changeWarnings(e.target.value)
    }

    const handleCustomTags = (e) =>{
        changeTags(e.target.value)
    }

    const checkBookInfo = () =>{

        let allInfoFilled = true

        const bookInfo = {
            Title: bookName,
            Synopsis:summary,
            Genre:genre,
            Language:language,
            Tags:tags,
            Warnings:warnings,
        }

        for (let i = 0;i < Object.keys(bookInfo).length;i++){
            if (Object.values(bookInfo)[i] === ""){
                document.getElementById(Object.keys(bookInfo)[i]).style.border = "2px solid red"
                allInfoFilled = false
            }
            else{
                document.getElementById(Object.keys(bookInfo)[i]).style.border = "1.5px solid black"

            }
        }

        if (allInfoFilled === true){
            createNewBook(bookInfo)
        }
        else{
            changeAlert("Fill in all the missing input fields")
            changeAlertColor("red")
        }
    }

    async function createNewBook(bookInfo){

        const token = localStorage.getItem("authToken")

        try{
            const res = await fetch("http://localhost:3001/api/createNewBook",{
                method:"POST",
                headers:{
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(bookInfo)
            }); 

            if (res.ok){
                const response = await res.json()
                if (response.message === "Title exists"){
                    changeAlert("The requested title is already in use. Please select a different one.")
                    changeAlertColor("red")
                }
                else if (response.message === "Synopsis exists"){
                    changeAlert("The requested synopsis is already in use. Please select a different one. ")
                    changeAlertColor("red")
                }
                else if (response.message === "New book inserted"){
                    changeAlert("Your book is now live")
                    changeAlertColor("green")
                }
            }
            else{
                let error = ErrorHandler(res)
                alert(error.message)
                if (error.navigate.length > 0){
                    navigate(error.navigate)
                }
            }

        }catch(error){
            let errorCatch = ErrorHandler(error)
            alert(errorCatch.message)
            if (errorCatch.navigate.length > 0){
                navigate(errorCatch.navigate)
            }
        }
    }

    return(
    <>
        <div className="CreateNovelsContainer"> 
            <div className="bookContent" >

                <label htmlFor="Title" className="Label">Book Name {bookName.length}/20</label>
                <input type="text" className="bookNameInput" maxLength="20"placeholder="20 letters max" id="Title" onChange={handleInputChangeBookName}/>
                <label htmlFor="Synopsis" className="Label">Synopsis {summary.length}/750</label>
                <textarea type="text" id="Synopsis" placeholder="Make a awesome synopsis to attract viewers!" maxLength="750" className="summaryInput" onChange={handleSummaryChange}/>
                <label htmlFor="Genre" className="Label">Genre</label>

                <select 
                    name="Genre" 
                    className="Selector" 
                    id="Genre" 
                    value={genre} 
                    onChange={handleGenreChange}
                >
                    <option value="Select">Select</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Historical Fiction">Historical Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Biography">Biography</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Horror">Horror</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Dystopian">Dystopian</option>
                    <option value="Young Adult">Young Adult</option>
                    <option value="Memoir">Memoir</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Sport">Sport</option>
                    <option value="Games">Games</option>
                </select>

                <label htmlFor="Language" className="Label">Language</label>
                <input type="text" id="Language" className="bookNameInput" placeholder="Language" maxLength="25" onChange={handleLanguage}/>

                <label htmlFor="Tags" className="Label">Custom Tags 0/10</label>
                <input type="text" id="Tags" onChange={handleCustomTags} className="bookNameInput" placeholder="Tags are seperated by spaces. ex 'tag1 tag2 tag3-tag3'" />

                <label htmlFor="Warnings" className="Label">Warnings</label>
                <select 
                    name="Warnings" 
                    className="Selector" 
                    value={warnings} 
                    id="Warnings"
                    onChange={handleWarnings}
                    >
                    <option value="">Select</option>
                    <option value="For everyone">For everyone</option>
                    <option value="PG-13">PG-13</option>
                    <option value="Guardian guidance recommended">Guardian guidance recommended</option>
                    <option value="18+">18+</option>
                </select>
                <button className="publishButton" onClick={checkBookInfo}>Publish now</button>
                <p style={{color:alertColor}}>{alert}</p>
            </div>
        </div>
    </>
    )
}

export default CreateNew