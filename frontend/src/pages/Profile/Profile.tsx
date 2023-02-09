import React, { useEffect, useRef, useState } from "react";
import { Blocks } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { authActions } from "../../store/auth-slice";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../util/notifications";
import classes from "./Profile.module.css";

const Profile = () => {
  const [img, setImg] = useState<Blob>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    isVerificated: boolean;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    imgUrl: string;
  }>({
    isVerificated: false,
    lastName: "",
    email: "",
    id: "",
    firstName: "",
    imgUrl: "",
  });

  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImg(e.target.files![0]);
    setIsEditing(true);
  };

  const editUserInfoHandler = () => {
    setIsEditing((prevState) => !prevState);
  };

  const saveUserChangesHandler = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("firstName", firstNameInputRef.current!.value);
    formData.append("lastName", lastNameInputRef.current!.value);
    formData.append("file", img!);
    console.log(img);

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/users/edit", {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (res.status === 401) {
      showErrorNotification("Session expired, please sign-in");
      navigate("/sign-in");
      return;
    }

    const editedUser = await res.json();
    setUser(editedUser);
    showSuccessNotification("Changes successfully saved!");
    setIsEditing(false);
    setIsLoading(false);
    console.log(editedUser);
  };

  const getUserData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/users/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const userData = await res.json();

    if (userData.message) {
      console.log(userData.message);
      showErrorNotification("Session expired, please sign-in");
      navigate("/sign-in");
      setIsLoading(false);
      return;
    }

    setUser(userData);
    setIsLoading(false);
    console.log(userData);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const sendVerificationEmailHandler = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/email/send-verification", {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email }),
    });

    if (res.status === 401) {
      showErrorNotification("Session expired, please sign-in");
      navigate("/sign-in");
      setIsLoading(false);
      return;
    }

    const resJson = await res.json();
    showSuccessNotification(resJson.message);
    console.log(resJson);
    setIsLoading(false);
    return;
  };
  return (
    <div className={classes.profile_container}>
      <Blocks
        visible={isLoading}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
      />
      {!isLoading && (
        <>
          <h2>My Profile</h2>
          <div className={classes.profile_info}>
            <div className={classes.profile_img}>
              <img
                src={
                  user.imgUrl ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="profile_pic"
              />
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={changeFileHandler}
              ></input>
            </div>

            <input type="file" id="my_file" style={{ display: "none" }} />
            <div className={classes.profile_info_data}>
              <span>First name:</span>
              {!isEditing && <span>{user.firstName}</span>}
              {isEditing && (
                <input
                  type="text"
                  defaultValue={user.firstName}
                  ref={firstNameInputRef}
                ></input>
              )}
              <hr />
              <span>Last name:</span>
              {!isEditing && <span>{user.lastName}</span>}
              {isEditing && (
                <input
                  type="text"
                  defaultValue={user.lastName}
                  ref={lastNameInputRef}
                ></input>
              )}
              <hr />
              <span>Email:</span>
              <span>{user.email}</span>
              <button onClick={editUserInfoHandler}>Edit</button>
            </div>
          </div>
          {!user.isVerificated && (
            <button
              className={classes.profile_btn}
              onClick={sendVerificationEmailHandler}
            >
              <Blocks
                visible={isLoading}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
              />
              {!isLoading && <span>Send email verification</span>}
            </button>
          )}
          {isEditing && (
            <button
              className={classes.profile_btn}
              onClick={saveUserChangesHandler}
            >
              Save changes
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
