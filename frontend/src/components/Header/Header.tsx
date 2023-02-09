import React from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.css";

const Header = () => {
  return (
    <header className={classes.header}>
      <Link to="/profile">
        <h1>SPDLoad Authenticator App</h1>
      </Link>
      <div className={classes.header_links}>
        <Link to="/sign-up">Sign up</Link>
        <Link to="/sign-in">Sign in</Link>
      </div>
    </header>
  );
};

export default Header;
