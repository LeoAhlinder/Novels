import React from "react"

const CreateChapter = ({chapterContentLength,handleTextAreaLength,publishChapter,setConfirmation,confirmation,handleTitleChange,chapterContent,titleContent}) =>{
    return(
        <>
        <input value={titleContent} type="text" placeholder="Title" id="novelWorkspaceChapterTitleInput" onChange={handleTitleChange} maxLength={25} />
        <h2 id="maxChaptersText">{chapterContentLength}/50000</h2>
        <textarea value={chapterContent} onChange={handleTextAreaLength} type="text" maxLength={50000} id="novelWorkspaceChapterInputText"/>
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