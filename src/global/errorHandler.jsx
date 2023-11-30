const ErrorHandler = (error) => {

  if (error === 403) { // Forbidden
    return {message:"Something went wrong, please try again.",navigate:"/"}
  } else {
    return {message:"Something unexpected happend, please try again.",navigate:"/"}
  }
};

export default ErrorHandler;
