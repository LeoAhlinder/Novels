import Cookies from "js-cookie";

const CheckToken = async () => {

  try {
    const token = Cookies.get("authToken");

    if (!token) {
      return "invalid";
    } else {
      const res = await fetch(`http://localhost:3001/api/protected/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const response = await res.json();
        if (response.message === "this is protected") {
          return "valid";
        }
      } else {
        return "invalid";
      }
    }
  } catch (err) {
    return "error"
  }
};

export default CheckToken;
