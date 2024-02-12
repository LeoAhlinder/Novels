const FetchComments = async ({bookId,changeComments,navigate,changeUserId}) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/comments?bookid=${bookId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });
        if (res.ok) {
            const response = await res.json();
            if (response.noComment){
                changeComments([])
            }
            else if (response.error){
                changeComments([])
            }
            else if (response.comment.length > 0){
                changeComments(response.comment)
                changeUserId(response.userId)          
            }
        } else {
            navigate("/error");
        }
    } catch (err) {
        navigate("/error");
    }
}

export default FetchComments;