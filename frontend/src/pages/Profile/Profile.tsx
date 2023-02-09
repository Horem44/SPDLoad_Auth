import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Profile.module.css";

const Profile = () => {
  const [img, setImg] = useState<Blob>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  }>({ lastName: "", email: "", id: "", firstName: "" });

  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImg(e.target.files![0]);
  };

  const editUserInfoHandler = () => {
    setIsEditing((prevState) => !prevState);
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
      navigate('/sign-in');
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
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
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
            <input type="text" defaultValue={user.firstName}></input>
          )}
          <hr />
          <span>Last name:</span>
          {!isEditing && <span>{user.lastName}</span>}
          {isEditing && (
            <input type="text" defaultValue={user.lastName}></input>
          )}
          <hr />
          <span>Email:</span>
          <span>{user.email}</span>
          <button onClick={editUserInfoHandler}>Edit</button>
        </div>
      </div>
      <button className={classes.profile_btn}>Save changes</button>
    </div>
  );
};

export default Profile;
