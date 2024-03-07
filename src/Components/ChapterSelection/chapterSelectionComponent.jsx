import React from "react";

import "./chapterSelectionStyle.css";

const SelectChapter = ({ chapters, goToChapterPage,loading }) => {

    const chapterStylings ={
        transparent: "1px solid transparent",
    }

    return(
        <div id="chaptersContainer" style={chapters.length === 0 ? {placeContent:"center"} : {}}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                {chapters.length === 0 ? (
                    <h1 id="noChaptersTitle">No chapters found</h1>
                ) : (
                    chapters.map((chapter, index) => (
                    <li
                        key={index}
                        id="chapterItem"
                        onClick={() => goToChapterPage(chapter.chapterNumber)}
                        style={
                        chapters.length <= 2 // Removes the bordertop if its not needed
                            ? {}
                            : index === chapters.length - 1
                            ? { borderTop: chapterStylings.transparent }
                            : chapters.length >= 4
                            ? index === 0 || index === 1
                            ? {}
                            : { borderTop: chapterStylings.transparent }
                            : {}
                        }
                    >
                        <p className="chapterSelectionText">Chapter {chapter.chapterNumber}: {chapter.chapterTitle}</p>
                    </li>
                    ))
                )}
                </>
            )}
        </div>
    )
};

export default SelectChapter;