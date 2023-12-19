import React from "react"

const CreateChapter = ({chapterContentLength,handleTextAreaLength,publishChapter,setConfirmation,confirmation}) =>{
    return(
        <>
        <h2 id="maxChaptersText">{chapterContentLength}/35000</h2>
        <textarea onChange={handleTextAreaLength} type="text" maxLength={35000} id="novelWorkspaceChapterInputText"/>
        {confirmation ? 
        <div>
          <button className="novelWorkshopPublishChapterButton" id="confirmButton" onClick={publishChapter}>
            Confirm
          </button > 
          <button className="novelWorkshopPublishChapterButton" id="rejectButton" onClick={() => setConfirmation(false)}>
            Reject
          </button> 
        </div>
          : 
        <button className="novelWorkshopPublishChapterButton" onClick={() => setConfirmation(true)}>
          Publish Chapter
        </button>
        }
      </>
    )
}

export default CreateChapter;