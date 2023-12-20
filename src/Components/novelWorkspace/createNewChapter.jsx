import React from "react"

const CreateChapter = ({chapterContentLength,handleTextAreaLength,publishChapter,setConfirmation,confirmation,handleTitleChange}) =>{
    return(
        <>
        <input type="text" placeholder="Title" id="novelWorkspaceChapterTitleInput" onChange={handleTitleChange} />
        <h2 id="maxChaptersText">{chapterContentLength}/100000</h2>
        <textarea onChange={handleTextAreaLength} type="text" maxLength={100000} id="novelWorkspaceChapterInputText"/>
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