import React from "react";
import "./logInForm.css"

const LoginForm = ({ boxClass, inputFields, logIn, addInputFieldAllowed, addInputField, createUser, changeClass, removeInputField, alerts,type,termsOfServiceClick }) => {
  return (
    <div className={boxClass}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {inputFields.map((field) => (
        <input className="input" placeholder={field.placeholder} id={field.id} type={field.type} key={field.id} />
      ))}
      <button
        type="button"
        id={boxClass === "createNew" ? "doNotShow" : ""}
        className="Button"
        onClick={() => logIn()}
      >
        Log In
      </button>
      {type === "admin" ? "" :<button
        type="button"
        id="createUser"
        className="Button"
        onClick={addInputFieldAllowed ? addInputField : createUser}
      >
        Create Account
      </button>}
      <button
        type="button"
        id={boxClass === "createNew" ? "goBackToLogin" : "doNotShow"}
        onClick={() => {
          changeClass("loginBox");
          removeInputField();
        }}
      >
        Back
      </button>
      {boxClass === "createNew" ? 
      <>
        <a href="/terms-of-service" target="_blank" id="termsOfServiceText">Terms of service</a>
        <input id="termsOfService" type="checkBox" onChange={e => termsOfServiceClick(e)}></input>
      </> 
      : 
      null
      }
      <p id="alert">{alerts}</p>
    </div>
  );
};

export default LoginForm;