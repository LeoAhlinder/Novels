import React,{useEffect,useMemo,useState} from "react";
import "./bookpageStyle.css"
import { useNavigate } from "react-router-dom";

import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import FetchComments from "../Components/CommentField/APIs/fetchCommentAPI";
import PostComment from "../Components/CommentField/APIs/postCommentAPI";

import Comment from "../Components/CommentField/Comment"

import pinkForest from "../picturesForBooks/pinkForestBig.webp"
import Moon from "../picturesForBooks/moonBig.webp"
import forest from "../picturesForBooks/forestBig.webp"
import forestHut from "../picturesForBooks/hutInForestBig.webp"

const BookPage = () =>{

    const bookCoverImages = {
        Moon, Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
      };

    const navigate = useNavigate()

    const amountOfComments = 9;

    const bookName = window.location.pathname.split("/")[2].replaceAll("-", " ");
 
    const [bookInfo, setBookInfo] = useState([])
    const [authorName,setAuthor] = useState("")
    const [bookId,setID] = useState(0)
    const [LibraryAddButton,LibraryChange] = useState("")
    const [buttonState,changeButtonState] = useState(true)
    const [checkBookInLibrary,changeCheckBookInLibrary] = useState(false)
    const [bookExtraInfo,changeBookExtraInfo] = useState([])
    const [tags,changeTags] = useState([])
    const [currentPage, changeCurrentPage] = useState(0);
    const [writeCommentView,changeWriteCommentView] = useState(false)
    const [comments,changeComments] = useState([])
    const [postCommentText,changePostCommentText] = useState("")
    const [postCommentAlert,changePostCommentAlert] = useState("")
    const [Username,changeUsername] = useState("")
    const [givenFeedback,changeGivenFeedback] = useState([])
    const [loadSet,changeLoadSet] = useState(0)
    const [moreCommentsExist,changeMoreCommentsExist] = useState(false)

    useEffect(() =>{
        const bookInfo = async (bookName) =>{
        try
        {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/book?title=${bookName}`,{
                method:"GET",
                headers: {  
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                  }
             });
            if (res.ok){
                const response = await res.json();
                setBookInfo(response.data)
                if (response.author[0] !== undefined){
                    setAuthor(response.author[0].userName)
                }
                else{
                    setAuthor("Not Found")
                }
                setID(response.data[0].bookid)
                ChangeDocumentTitle(response.data[0].title + " | Novels")
                changeCheckBookInLibrary(true)
                changeBookExtraInfo(response.bookInfoData[0])
                changeTags(response.bookInfoData[0].tags.split(" "))
            }else{
                navigate("/error")
            }
        }
        catch(err){
            navigate("/error")
        }
    }
        bookInfo(bookName)
    },[]);

    useEffect(() =>{
        const isBookInLibrary = async () =>{
            try
            {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/checkLibrary`,{
                    method:"POST",
                    headers: {  
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true"
                      },
                      credentials: 'include',
                      body: JSON.stringify({id:bookId})
                });
                if (res.ok){
                    const response = await res.json()
                        if (response.message === "no token"){
                        LibraryChange("Not Login in")
                    }
                    if (response.message === "exist"){
                        LibraryChange("Remove from Library")
                        if (response.currentPage !== 0){
                            changeCurrentPage(response.currentPage)
                        }
                    }
                    else if (response.message === "does not exist"){
                        LibraryChange("Add to Library")
                    }
                }else{
                    navigate("/error")
                }
            }
            catch(err){
                navigate("/error")
            }
        }
        if (checkBookInLibrary === true)
            isBookInLibrary();
    },[checkBookInLibrary])

    const addToLibrary = async () =>{
        if (buttonState === true){
            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/AddToLibrary`,{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true"
                    },
                    credentials: 'include',
                    body: JSON.stringify({id:bookId})
                });

                if (res.ok){
                    LibraryChange("Success!")
                    buttonColdDown("add")
                }
                else{
                    navigate("/error")

                }
            }catch(err){
                navigate("/error")
            }
        }
    }
    
    const buttonColdDown = (action) => {
        document.getElementById("addButton").setAttribute("class", "bookCD");
        changeButtonState(false);
    
        setTimeout(() => {
            if (window.location.pathname.includes("book")){
                document.getElementById("addButton").classList.remove("bookCD");
                changeButtonState(true);
                
                if (action === "add") {
                    LibraryChange("Remove from Library");
                } else {
                    LibraryChange("Add to library");
                }
            }
        }, 8000);
    }

    const removeFromLibrary = async () =>{
        if (buttonState === true){
            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/RemoveFromLibrary`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true",
                        },
                    credentials: 'include',
                    body: JSON.stringify({id:bookId})
                });

                if (res.ok){
                    LibraryChange("Removed")
                    buttonColdDown("remove")
                }
                else{
                    navigate("/error")
                }
            }catch(err){
                navigate("/error")
            }
        }
    }

    const goToAuthor = () =>{
        if (authorName !== "" && authorName !== "Not Found"){
            navigate({pathname:`/author/${authorName}`})
        }    
    }

    const postCommentHandler = async () =>{
        try{
            const didCommentPost = await PostComment({
                bookId:bookId,
                postCommentText:postCommentText,
                navigate:navigate,
                changePostCommentAlert:changePostCommentAlert
            })
            if (didCommentPost === true){
                changePostCommentText("")
                changePostCommentAlert("Comment posted")
                changeComments(prevState => [
                    ...prevState,
                    {likes:0, dislikes:0, comment:postCommentText, userName:"You",commentid:prevState.length+1}
                ]);
            }
            if (didCommentPost !== false && didCommentPost !== true){
                changePostCommentAlert("Error posting comment")
            }
        }catch(err){
            navigate("/error")
        }
    }

    useEffect(() => {
        if (bookId !== 0) {
            FetchComments({
                bookId: bookId,
                changeComments: changeComments,
                navigate: navigate,
                changeUsername: changeUsername,
                changeGivenFeedback:changeGivenFeedback,
                loadSet: 0,
                changeMoreCommentsExist:changeMoreCommentsExist
            });
        }
    }, [bookId]);

    const goToChapterPage = () => {
        navigate({pathname:`/chapters/${bookInfo[0].title}`})
    }

    const goToChapter = () => {
        navigate({pathname:`/chapters/${bookInfo[0].title}/${Number(currentPage) === 0 ? 1 : currentPage}`})
    }

    function adjustHeight(e) {
        e.target.style.height = "1px";
        e.target.style.height = (25+e.target.scrollHeight)+"px";
    }

    const MemorizedComments = useMemo(() => {
        if (comments.length > 0) {
            return comments.map((comment, index) => (
                <Comment
                    id={comment.commentid}
                    key={index}
                    value={comment.commentid}
                    likes={comment.likes}
                    dislikes={comment.dislikes}
                    commentText={comment.comment}
                    recievedFeedback={givenFeedback !== null ? givenFeedback : null}
                    viewingUser={Username}
                    Username={comment.userName === Username ? "You" : comment.userName}
                />  
            ));
        } else {
            return <p>No comments</p>;
        }
    }, [comments]);

    function onChangeHandler(e){
        changePostCommentText(e.target.value)
        adjustHeight(e)
    }

    const fetchMoreComments = async () =>{
        try{
            let newComments = await FetchComments({
                onlyReturn: true,
                bookId: bookId,
                changeComments: changeComments,
                navigate: navigate,
                changeUsername: changeUsername,
                changeGivenFeedback:changeGivenFeedback,
                loadSet: loadSet + 1,
                changeMoreCommentsExist:changeMoreCommentsExist
            });
            changeLoadSet(loadSet + 1)
    
            if (newComments !== undefined){
                changeComments(prevState => [
                    ...prevState,
                    ...newComments
                ]);
            }
        }catch(err){
            navigate("/error")
        }
        
    }

    const goToRatingSite = () =>{
        navigate("./rating")
    }

    return(
        <>
        {bookInfo.length > 0 ? (
            <>  
            <img id="backgroundImage" src={bookCoverImages[bookInfo[0].bookcover]} alt={bookInfo.bookcove} />
                <div className="Wrapper">
                    <div id="desktop">
                        <div id="bookPagePictureContainer">
                            <img src={bookCoverImages[bookInfo[0].bookcover]} alt={bookInfo.bookcover} className="novelCover"/>
                        </div>
                        <div className="bookPagebookInfo">
                            <h1 className="title">{bookInfo[0].title}</h1>
                            <h2 className="genre">Genre: {bookExtraInfo.genres}</h2>
                            <h5 className="author"><button id="authorButton" onClick={() => goToAuthor()} >Author: {authorName} </button></h5>
                            <h5 className="chapters">Chapters: {bookInfo[0].totalpages === null ? "0" : bookInfo[0].totalpages}</h5>
                            <h3 className="rating">{bookInfo[0].rating === null ? "No Rating" : bookInfo[0].rating} <button className="rateButton" onClick={() => goToRatingSite()}>Rate</button></h3>
                            <div id="buttonContainer">
                                <button className="readButton" onClick={() => goToChapter()}>{Number(currentPage) !== 0 ? "Continue Reading: " + currentPage : "Start Reading"}</button>
                                <button className="readButton" onClick={() => goToChapterPage()}>View Chapters</button>
                                <button id="addButton" className={LibraryAddButton === "Not Login in" ? "notLoginIn" : ""} onClick={LibraryAddButton === "Remove from Library" ? () => removeFromLibrary(): () => addToLibrary()}>{LibraryAddButton}</button>
                            </div>
                        </div>
                        <div className="bookExtraInfo">
                            <div className="bookExtraInfoText">
                                <h1>Summary</h1>
                                <p>{bookExtraInfo.synopsis}</p>
                            </div>
                            <div className="bookExtraInfoText">
                                <h2>Overall Information</h2>
                                <div className="extraInfoRow">
                                    <div id="coloum">
                                        <p className="bookExtraRowText">Recommended Age:&nbsp;{bookExtraInfo.warnings}</p>
                                        <p className="bookExtraRowText">Language:&nbsp;{bookExtraInfo.language}</p>
                                    </div>
                                    <div className="bookExtraInfoTags">
                                        Tags:
                                        {tags.map((tag,index)=>{
                                            return <p key={index} className="bookExtraInfoTag" >{tag}</p>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <div className="commentContainer">
                                <div className="headerContainer">
                                    <h2>Comments</h2>
                                    <button className="writeCommentButton" onClick={() => changeWriteCommentView(!writeCommentView)}>{writeCommentView === false ? "Write a Comment" : "Stop Writing Comments"}</button>
                                </div>
                                {writeCommentView === true ? 
                                <>
                                    <div className="writeCommentContainer">
                                        <textarea className="writeCommentTextArea" onChange={(e) => onChangeHandler(e)} value={postCommentText} placeholder="Write a comment"></textarea>
                                        <button className="submitCommentButton" onClick={() => postCommentHandler()}>Submit</button>
                                    </div>
                                    {postCommentAlert !== "" ? <p className="commentAlert" style={postCommentAlert === "Comment posted" ? {color:"green"} : {color:"red"}}>{postCommentAlert}</p> : null}
                                </> 
                                : null
                                }
                                <div className="commentField">
                                   {MemorizedComments}
                                </div>
                                {moreCommentsExist === true ? <button className="loadMoreButton" onClick={() => fetchMoreComments()}>Load More</button> : null}
                        </div>
                        <div id="footer"></div>
                    </div>
                        <div id="phone">
                            <div id="phoneItemsWrapper">
                                <div id="bookPagePictureContainer">
                                    <img src={bookCoverImages[bookInfo[0].bookcover]} alt="cutecat" id="novelCoverPhone" />
                                </div>
                                <div id="bookInfoPhone">
                                        <h1 className="titlePhone">{bookInfo[0].title}</h1>
                                        <h4 className="genrePhone">Genre: {bookExtraInfo.genres}</h4>
                                        <h5 id="authorPhone"><button id="authorButton" onClick={() => goToAuthor()} >Author: {authorName} </button></h5>
                                        <h5 id="chaptersPhone">Chapters: {bookInfo[0].totalpages === null ? "0" : bookInfo[0].totalpages}</h5>
                                        <h3 className="ratingPhone">{bookInfo[0].rating === null ? "No Rating" : bookInfo[0].rating}<button className="rateButton">Rate</button></h3>
                                    <div id="phoneButtonContainer">
                                        <button className="readButtonPhone" onClick={() => goToChapter()}>{currentPage != 0 ? "Continue Reading: " + currentPage : "Start Reading"}</button>
                                        <button className="readButtonPhone" onClick={() => goToChapterPage()}>View Chapters</button>
                                        <button id="addButtonPhone" className={LibraryAddButton === "Not Login in" ? "notLoginIn" : ""} onClick={LibraryAddButton === "Remove from Library" ? () => removeFromLibrary(): () => addToLibrary()}>{LibraryAddButton}</button>
                                    </div>
                                </div>
                                <div className="bookExtraInfo">
                                    <div className="bookExtraInfoText">
                                        <h1>Summary</h1>
                                        <p>{bookExtraInfo.synopsis}</p>
                                    </div>
                                    <div className="bookExtraInfoText">
                                        <h2>Overall Information</h2>
                                        <div className="extraInfoRow">
                                            <p className="bookExtraRowText">Recommended Age:&nbsp;{bookExtraInfo.warnings}</p>
                                            <p className="bookExtraRowText">Language:&nbsp;{bookExtraInfo.language}</p>
                                            <div className="bookExtraInfoTags">
                                                Tags:
                                                {tags.map((tag,index)=>{
                                                    return <p key={index} className="bookExtraInfoTag" >{tag}</p>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                                <div className="commentContainer">
                            <div className="headerContainer">
                                <h2 id="commentsTitle">Comments</h2>
                                <button className="writeCommentButton" onClick={() => changeWriteCommentView(!writeCommentView)}>{writeCommentView === false ? "Write a Comment" : "Stop Writing Comments"}</button>
                            </div>
                            {writeCommentView === true ? 
                            <>
                                <div className="writeCommentContainer">
                                    <textarea className="writeCommentTextArea" onChange={(e) => onChangeHandler(e)} placeholder="Write a comment"></textarea>
                                    <button className="submitCommentButton" onClick={() => postCommentHandler()}>Submit</button>
                                </div>
                                {postCommentAlert !== "" ? <p className="commentAlert" style={postCommentAlert === "Comment posted" ? {color:"green"} : {color:"red"}}>{postCommentAlert}</p> : null}

                            </> 
                            : null
                            }
                            <div className="commentField">
                                   {MemorizedComments}
                            </div>
                            {moreCommentsExist === true ? <button className="loadMoreButton" onClick={() => fetchMoreComments()}>Load More</button> : null}

                        </div>
                        <div id="footer"></div>
                            </div>
                        </div>
                </div> 
            </>
        ) : null}
    </>    
    );
}

export default BookPage;