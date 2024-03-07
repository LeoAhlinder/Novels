import React from "react";

import yellowStar from "../../Icons/star-yellow.svg"
import whiteStar from "../../Icons/star-white.svg"

const BookListGrid = ({books,goToBook,bookCoverImages,noBooksFoundText}) => {

    return(
        <>
            {books.length > 0 ? ( <>
                <ul className="gridContainerHome">
                    {books.map((book, index) => (
                        <li key={index} className="gridItem">
                        <div onClick={() => goToBook(book)} className="book">
                            <img src={bookCoverImages[book.bookcover]} alt={bookCoverImages[book.bookcover]} className="bookCover"/>
                            <div>
                                <img className="starRating" src={book.averageRating !== null ? yellowStar : whiteStar} alt="star" />
                                <img className="starRating" src={book.averageRating >= 2 ? yellowStar : whiteStar} alt="star" />
                                <img className="starRating" src={book.averageRating >= 3 ? yellowStar : whiteStar} alt="star" />
                                <img className="starRating" src={book.averageRating >= 4 ? yellowStar : whiteStar} alt="star" />
                                <img className="starRating" src={book.averageRating >= 5 ? yellowStar : whiteStar} alt="star" />

                            </div>
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