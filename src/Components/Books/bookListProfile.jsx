import React , {useState,useEffect} from "react";

const BookList = ({books,openBook,bookCoverImages,showPageProgress}) => {


    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoaded(true);
        }, 100); // 100 milliseconds = 0.1 seconds
    
        return () => clearTimeout(timer); // Clean up the timer
    }, []);


    return(
        <>
        {isLoaded ? (
        <>
            <div id="tableHeadContainer">
            <div id="tableHead">
                <p id="tableText">Novel Title</p>
                <p id="progessText">{showPageProgress === true ? <span> Your Progess </span> : ""}</p>
            </div>
            </div>
            
            <div className="Library">
            {books === "error" ? <p id="noBooksText">We had error fetching your books</p> :
            books.length > 0 ? (
                <ul>
                {books.map((book) => (
                    <button className="bookItem" onClick={() => openBook(book)} key={book.bookid}>
                    <div id="novelTitleAndPicture">
                        <img src={bookCoverImages[book.bookcover]} alt={book.bookcover} id="libraryBookPicture" />
                        <p id="libraryBookTitle">{book.title}</p>
                    </div>
                    <span id="pageInfo">
                        {showPageProgress === true ? `Page: ${book.currentPage}/${book.totalpages === null ? "0" : book.totalpages}` : ""}
                    </span>                    
                    </button>
                ))}
                </ul>
            ) : (
                <p id="noBooksText">Add your favorite books to your library so you never forget them!</p>
            )
            }
            </div>
        </>
        ) : null}
    </>
    );
}

export default BookList;