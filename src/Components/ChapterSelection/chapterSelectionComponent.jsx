import React from "react";

const SelectChapter = ({ chapters, goToChapterPage,loading }) => {

    const chapterStylings ={
        transparent: "1px solid transparent",
    }

    return(
        <div id="chaptersContainer">
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
                        Chapter {chapter.chapterNumber}: {chapter.chapterTitle}
                    </li>
                    ))
                )}
                </>
            )}
        </div>
    )
};

export default SelectChapter;