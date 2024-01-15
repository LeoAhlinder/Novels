import React, { useState } from "react";
import "./createnewstyle.css"
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import pinkForest from "../picturesForBooks/pinkForest.webp"
import moon from "../picturesForBooks/moon.webp"
import hutInForest from "../picturesForBooks/hutInForest.webp"
import forest from "../picturesForBooks/forest.webp"

const CreateNew = () =>{

    ChangeDocumentTitle("Create Novel")

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
    const [selectedPicture,changePicture] = useState("")

    const genres = [
        'Select', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Thriller',
        'Historical Fiction', 'Non-Fiction', 'Biography', 'Self-Help', 'Horror',
        'Adventure', 'Dystopian', 'Young Adult', 'Memoir', 'Comedy', 'Sport', 'Games'
    ];

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

    const handlePictureChange = (e) =>{
        const pictureId = e.target.id;
        changePicture(pictureId)
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
            picture:selectedPicture
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

        if (allInfoFilled === false){
            changeAlert("Fill in all the missing input fields")
            changeAlertColor("red")
            return
        }

        // Check if any inputs are to long
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/createNewBook`,{
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
                console.log(response)
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
                else if (response.message === "Maximum of 10 books allowed"){
                    changeAlert("You have reached the maximum amount of books you can create")
                    changeAlertColor("red")
                }
                else if (response.error){
                    changeAlert(response.error);
                    changeAlertColor("red")
                }
                else {
                    changeAlert("Something went wrong, please try again later")
                    changeAlertColor("red")
                }
            }
            else{
                console.log(res)
                navigate("/error")
            }

        }catch(error){
            console.log(error)
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
                    {genres.map((genre, index) => <option key={index} value={genre}>{genre}</option>)}
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
                <h4 id="pictureSelectionText" className="Label">Select the picture that best represents your novel!</h4>
                <div id="picture" className="picturesOption"> 
                    <img src={forest} alt="Forest" className={selectedPicture === "Forest" ? "pictureToSelect selectedPicture" : "pictureToSelect"} id="Forest" onClick={handlePictureChange}/>
                    <img src={pinkForest} alt="A pink forest" className={selectedPicture === "pinkForest" ? "pictureToSelect selectedPicture" : "pictureToSelect"} id="pinkForest" onClick={handlePictureChange}/>
                    <img src={moon} alt="Moon" className={selectedPicture === "Moon" ? "pictureToSelect selectedPicture" : "pictureToSelect"} id="Moon" onClick={handlePictureChange}/>
                    <img src={hutInForest} alt="A hut in the forest" className={selectedPicture === "hutInForest" ? "pictureToSelect selectedPicture" : "pictureToSelect"} id="hutInForest" onClick={handlePictureChange}/>
                </div>
                <button className="publishButton" onClick={checkBookInfo}>Publish now</button>
                <p style={{color:alertColor}}>{alert}</p>
            </div>
        </div>
    </>
    )
}

export default CreateNew;