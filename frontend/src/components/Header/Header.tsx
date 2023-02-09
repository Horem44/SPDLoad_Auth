import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { authActions } from "../../store/auth-slice";
import classes from "./Header.module.css";

const Header = () => {
  const isAuth = useSelector<RootState, boolean>((state) => state.auth.isAuth);
  const dispatch = useDispatch();

  return (
    <header className={classes.header}>
      <h1>SPDLoad Authenticator App</h1>
      <div className={classes.header_links}>
        {!isAuth && (
          <>
            <Link to="/sign-up">Sign up</Link>
            <Link to="/sign-in">Sign in</Link>
          </>
        )}
        {isAuth && (
          <>
            <Link to="/profile">My profile</Link>
            <Link
              to="/"
              onClick={() => {
                localStorage.removeItem("token");
                dispatch(authActions.logout());
              }}
            >
              Logout
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
