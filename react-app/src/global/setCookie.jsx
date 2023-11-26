const setCookie = (name,value,hours) =>{
    let expiration = new Date();
    expiration.setTime(expiration.getTime() + (hours * 60 * 60 * 1000)); // Convert hours to milliseconds
    let expires = "expires=" + expiration.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + "; " + expires + "; Secure; SameSite=Strict; HttpOnly;";
}

export default setCookie