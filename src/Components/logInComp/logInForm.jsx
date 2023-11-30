import React from "react";

const LoginForm = ({ boxClass, inputFields, logIn, addInputFieldAllowed, addInputField, createUser, changeClass, removeInputField, alerts,type }) => {
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
      <p id="alert">{alerts}</p>
    </div>
  );
};

export default LoginForm;