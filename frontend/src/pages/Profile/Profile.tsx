import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Profile.module.css";

const Profile = () => {
  const [img, setImg] = useState<Blob>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    imgUrl: string;
  }>({ lastName: "", email: "", id: "", firstName: "", imgUrl: "" });

  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImg(e.target.files![0]);
  };

  const editUserInfoHandler = () => {
    setIsEditing((prevState) => !prevState);
  };

  const saveUserChangesHandler = async () => {
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

    const editedUser = await res.json();
    setUser(editedUser);
    setIsEditing(false);
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

  return (
    <div className={classes.profile_container}>
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
      <button className={classes.profile_btn} onClick={saveUserChangesHandler}>
        Save changes
      </button>
    </div>
  );
};

export default Profile;
