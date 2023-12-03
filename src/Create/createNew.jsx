import React, { useState } from "react";
import "./createnewstyle.css"
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

const CreateNew = () =>{

    const navigate = useNavigate()

    const [summaryLength,changeSummaryLength] = useState(0)
    const [titleLength,changeTitleLength] = useState(0)
    const [tagsLength,changeTagsLength] = useState(0)

    const [bookName,changeBookName] = useState("")
    const [summary,changeSummary] = useState("")
    const [genre,setGenre] = useState("")
    const [language,changeLanguage] = useState("")
    const [tags,changeTags] = useState("")
    const [warnings,changeWarnings] = useState("")
    const [alert,changeAlert] = useState("")
    const [alertColor,changeAlertColor] = useState({})

    const handleInputChangeBookName = (e) => {
        changeTitleLength(e.target.value.length)
        changeBookName(e.target.value)
    }
    
    const handleSummaryChange = (e) =>{
        changeSummaryLength(e.target.value.length)
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
        let tags = e.target.value.split(" ")

        changeTagsLength(tags.length)
        if (e.target.value === ""){
            changeTagsLength(0)
        }
        changeTags(e.target.value)
    
    }

    const checkBookInfo = () =>{

        let allInfoFilled = true

        const bookInfo = {
            bookTitle: bookName,
            Synopsis:summary,
            inputGenre:genre,
            Language:language,
            Tags:tags,
            Warnings:warnings,
        }

        // Check if any inputs are to long
        

        for (let i = 0;i < Object.keys(bookInfo).length;i++){
            if (Object.values(bookInfo)[i] === ""){
                document.getElementById(Object.keys(bookInfo)[i]).style.border = "2px solid red"
                allInfoFilled = false
            }
            else{
                document.getElementById(Object.keys(bookInfo)[i]).style.border = "1.5px solid black"
            }
        }

        if (allInfoFilled === false){
            changeAlert("Fill in all the missing input fields")
            changeAlertColor("red")
            return
        }

        if (tagsLength > 3){
            changeAlert("You can only have 3 tags")
            changeAlertColor("red")
            return
        }
        for (let i = 0;i < tags.length;i++){
            if (tags[i].length > 10){
                changeAlert("Your tags are too long")
                changeAlertColor("red")
                return
            }
        }
        if (summaryLength > 300){
            changeAlert("Your summary is too long")
            changeAlertColor("red")
            allInfoFilled = false
            return
        }
        if (titleLength > 20){
            changeAlert("Your title is too long")
            changeAlertColor("red")
            allInfoFilled = false
            return
        }
        changeAlert("")
        changeAlertColor("")
        createNewBook(bookInfo)

    }

    async function createNewBook(bookInfo){

        const token = Cookies.get("authToken")

        try{
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/createNewBook`,{
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
                navigate("/error")
            }

        }catch(error){
            navigate("/error")
        }
    }

    return(
    <>
        <div className="CreateNovelsContainer"> 
            <div className="bookContent" >          
                <h2 id="headerTextForCN">Create your own novel</h2>

                <label htmlFor="bookTitle" className="Label">Book Name {bookName.length}/20</label>
                <input type="text" className="bookNameInput" maxLength="20"placeholder="20 letters max" id="bookTitle" onChange={handleInputChangeBookName}/>
                <label htmlFor="Synopsis" className="Label">Synopsis {summary.length}/300</label>
                <textarea type="text" id="Synopsis" placeholder="Make a awesome synopsis to attract viewers!" maxLength="300" className="summaryInput" onChange={handleSummaryChange}/>
                <label htmlFor="inputGenre" className="Label">Genre</label>

                <select 
                    name="inputGenre" 
                    className="Selector" 
                    id="inputGenre" 
                    value={genre} 
                    onChange={handleGenreChange}
                >
                    <option value="Select">Select</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Thriller">Thriller</option>§
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

                <label htmlFor="Tags" className="Label">Custom Tags {tagsLength}/3</label>
                <input type="text" id="Tags" onChange={handleCustomTags} className="bookNameInput" placeholder="Tags are seperated by spaces. ex 'tag1 tag2'. Tags can be 10 characters long max!" />

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

export default CreateNew;