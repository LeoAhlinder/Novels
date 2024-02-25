import React from "react";

const BookList = ({books,openBook,bookCoverImages,showPageProgress,showText,textIfEmpty,loading}) => {
    return(
        <>  
            <div id="tableHeadContainer">
                {loading === true ? (
                    <p id="loadingText">Loading...</p>
                ) : (
                    <>
                    <div id="tableHead">
                        {books.length > 0 && (
                        <>
                            <p id="tableText">{showText === false ? "" : "Novel Title"}</p>
                            <p id="progessText">
                            {showPageProgress === true ? <span> Your Progess </span> : ""}
                            </p>
                        </>
                        )}
                    </div>
                    </>
                )}
                </div>

                <div className="Library">
                {books === "error" ? (
                    <p id="noBooksText">We had error fetching your books</p>
                ) : books.length > 0 ? (
                    <ul>
                    {books.map((book) => (
                        <button
                        className="bookItem"
                        onClick={() => openBook(book)}
                        key={book.bookid}
                        >
                        <div id="novelTitleAndPicture">
                            <img
                            src={bookCoverImages[book.bookcover]}
                            alt={book.bookcover}
                            id="libraryBookPicture"
                            />
                            <p id="libraryBookTitle">{book.title}</p>
                        </div>
                        <span id="pageInfo">
                            {showPageProgress === true
                            ? `Page: ${book.currentPage}/${
                                book.totalpages === null ? "0" : book.totalpages
                                }`
                            : ""}
                        </span>
                        </button>
                    ))}
                    </ul>
                ) : (
                    <p id="noBooksText">{loading === false ? textIfEmpty : ""}</p>
                )}
            </div>
        </>
    );
}

export default BookList;