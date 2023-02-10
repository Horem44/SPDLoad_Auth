import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Header from "./components/Header/Header";
import Profile from "./pages/Profile/Profile";
import SigninPage from "./pages/SigninPage/SigninPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import VerificationPage from "./pages/VerificationPage/VerificationPage";
import { authActions } from "./store/auth-slice";
import 'react-toastify/dist/ReactToastify.css';
import { showErrorNotification } from "./util/notifications";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/auth", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthenticated");
        }
        return res.json();
      })
      .then((res) => {
        if (res.isAuth) {
          dispatch(authActions.login());
          navigate('profile');
          return;
        }
        throw new Error("Unauthenticated");
      })
      .catch((err) => {
        if(err instanceof Error){
          showErrorNotification(err.message);
        }
      });
  }, [dispatch]);

  return (
    <>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/sign-in" element={<SigninPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verification/:token" element={<VerificationPage />} />
          <Route path="/*" element={<SignupPage />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
    </>
  );
}

export default App;
