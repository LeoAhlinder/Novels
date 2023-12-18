import React , {useEffect,useState} from "react";


const BookListGrid = ({books,goToBook,bookCoverImages,noBooksFoundText}) => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoaded(true);
        }, 100); 
    
        return () => clearTimeout(timer); 
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
                <p id="errorTextHome">{noBooksFoundText}</p>
                </div>}
            </>
            : null}
        </>
    );
}

export default BookListGrid;