import React , {useEffect,useState} from "react";

const BookListGrid = ({books,goToBook,bookCoverImages}) => {


    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoaded(true);
        }, 100); // 100 milliseconds = 0.1 seconds
    
        return () => clearTimeout(timer); // Clean up the timer
    }, []);


    return(
        <>
             {isLoaded ? 
            <>
            {books.length > 0 ? ( <>
                    <ul className="gridContainerHome">
                    {books.map((book, index) => (
                        <li key={index} className="gridItem">
                        <div onClick={() => goToBook(book)} className="book">
                            <img src={bookCoverImages[book.bookcover]} alt={book.bookcover} className="bookCover"/>
                            <p id="bookTitle">{book.title}<br/><span>Chapters: {book.totalpages === null ? "0" : book.totalpages}</span></p>
                        </div>
                        </li>
                    ))}
                    </ul>
                </>): 
                <div id="Error">
                <p id="errorTextHome">We had an error fetching the books; please try again!</p>
                </div>}
            </>
            : null};
        </>
    );
}

export default BookListGrid;