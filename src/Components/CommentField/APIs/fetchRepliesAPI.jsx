const FetchRepliesAPI = async ({bookId,changeReplies}) =>{
    try{
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/getReplies?bookId=${bookId}`,{
            method :"GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Allow-Credentials": "true",
            },
            credentials: 'include',
        });
        const response = await res.json();
        if (response.error){
            changeReplies([])
        }
        else if (response.message === "No replies found"){
            changeReplies([])
        }
        else if (response.replies.length > 0){
            changeReplies(response.replies)
        }
        else{
            changeReplies([])
        }
    }catch(err){
        console.log(err);
        changeReplies([])
    }
}

export default FetchRepliesAPI;