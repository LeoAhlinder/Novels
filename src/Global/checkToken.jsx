import APIURL from "./API-URL";

const CheckToken = async () => {
  try {

      const res = await fetch(`${APIURL}/api/protected/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Allow-Credentials": "true"
        },
        credentials: 'include',
      });
      if (res.ok) {
        const response = await res.json();
        if (response.message === "this is protected") {
          return "valid";
        }
        else if (response.message === "no token"){
          return "invalid"
        }
      } else {
        return "invalid";
      }
  } catch (err) {
    return "error"
  }
};

export default CheckToken;
