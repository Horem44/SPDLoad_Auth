import { utimes } from "fs";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../util/notifications";
import classes from "./Form.module.css";

interface FormProps {
  isSigningUp: boolean;
}

const Form: React.FC<FormProps> = ({ isSigningUp }) => {
  const firsNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const url =
      "http://localhost:8080/auth/" + (isSigningUp ? "sign-up" : "sign-in");

    const userData = isSigningUp
      ? {
          firstName: firsNameInputRef.current!.value,
          lastName: lastNameInputRef.current!.value,
          email: emailInputRef.current!.value,
          password: passwordInputRef.current!.value,
        }
      : {
          email: emailInputRef.current!.value,
          password: passwordInputRef.current!.value,
        };

    try {
      const res = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if(res.status === 400){
        showErrorNotification("Write correct email!");
        return;
      }

      const jwt = await res.json();

      if(jwt.message){
        showErrorNotification(jwt.message);
        return;
      }

      window.localStorage.setItem("token", jwt.access_token);
      dispatch(authActions.login());
      navigate("/profile");

      showSuccessNotification(
        "You have signed-" + (isSigningUp ? "up " : "in ") + "successfully!"
      );

      if (res.status !== 200) {
        throw new Error("Unauthorized");
      }
    } catch (err) {
      if (err instanceof Error) {
        showErrorNotification(err.message);
      }
    }
  };

  return (
    <div className={classes.form_container}>
      <form className={classes.form} onSubmit={formSubmitHandler}>
        {isSigningUp && (
          <>
            <label>First name</label>
            <input type="text" ref={firsNameInputRef}></input>
            <label>Last name</label>
            <input type="text" ref={lastNameInputRef}></input>
          </>
        )}
        <label>Email</label>
        <input type="email" ref={emailInputRef}></input>
        <label>Password</label>
        <input type="password" ref={passwordInputRef}></input>

        <button type="submit">{isSigningUp ? "Sign up" : "Sign in"}</button>
      </form>
    </div>
  );
};

export default Form;
