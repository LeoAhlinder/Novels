import React, { useState } from "react";
import "./createnewstyle.css"

const CreateNew = () =>{

    const [bookName,changeBookName] = useState("")
    const [summary,changeSummary] = useState("")


    const handleInputChangeBookName = (e) => {
        changeBookName(e.target.value)
    }
    
    const handleSummaryChange = (e) =>{
        changeSummary(e.target.value)
    }

    return(
    <>
        <div className="CreateNovelsContainer"> 
            <div className="bookContent" >

                <label htmlFor="bookName" className="Label">Book Name {bookName.length}/20</label>
                <input type="text" className="bookNameInput" maxLength="20"placeholder="20 letters max" onChange={handleInputChangeBookName}/>
                <label htmlFor="" className="Label">Synopsis {summary.length}/750</label>
                <textarea type="text" name="" placeholder="Make a awesome synopsis to attract viewers!" maxLength="750" className="summaryInput" onChange={handleSummaryChange}/>
                <label htmlFor="" className="Label">Genre</label>
                <select name="Genre" className="Selector" id="genreSelect">
                    <option>Select</option>
                    <option>Mystery</option>
                    <option>Romance</option>
                    <option>Science Fiction</option>
                    <option>Fantasy</option>
                    <option>Thriller</option>
                    <option>Historical Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Biography</option>
                    <option>Self-Help</option>
                    <option>Horror</option>
                    <option>Adventure</option>
                    <option>Dystopian</option>
                    <option>Young Adult</option>
                    <option>Memoir</option>
                    <option>Comedy</option>
                    <option>Sport</option>
                    <option>Games</option>
                </select>

                <label htmlFor="" className="Label">Language</label>
                <input type="text" className="bookNameInput" placeholder="Language" maxLength="25"/>

                <label htmlFor="" className="Label">Custom Tags</label>
                <input type="text" className="bookNameInput" placeholder="Tags are seperated by spaces. ex 'tag1 tag2 tag3-tag3'" />

                <label htmlFor="" className="Label">Warnings</label>
                <select name="Warnings" className="Selector">
                    <option value="">Select</option>
                    <option value="">For everyone</option>
                    <option value="">PG-13</option>
                    <option>Guardian guidance recommended</option>
                    <option>18+</option>
                </select>

                <button className="publishButton">Publish now</button>

            </div>
        </div>
    </>
    )
}

export default CreateNew