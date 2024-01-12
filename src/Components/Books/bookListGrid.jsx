import React from "react";


const BookListGrid = ({books,goToBook,bookCoverImages,noBooksFoundText}) => {

    return(
        <>
            {books.length > 0 ? ( <>
                <ul className="gridContainerHome">
                    {books.map((book, index) => (
                        <li key={index} className="gridItem">
                        <div onClick={() => goToBook(book)} className="book">
                            <img src={bookCoverImages[book.bookcover]} alt={bookCoverImages[book.bookcover]} className="bookCover"/>
                            <p id="bookTitle">{book.title}<br/><span>Chapters: {book.totalpages === null ? "0" : book.totalpages}</span></p>
                        </div>
                        </li>
                    ))}
                </ul>
                </>)
            : 
            <div id="Error">
                <p id="errorTextHome">{noBooksFoundText}</p>
            </div>}
        </>
    );
}

export default BookListGrid;