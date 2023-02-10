import React, { useEffect, useState } from "react";
import { Blocks } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { EmailApiService } from "../../services/email-api";
import { authActions } from "../../store/auth-slice";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../util/notifications";
import classes from "./VerificationPage.module.css";

const VerificationPage = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailApiService = new EmailApiService();

  const verificateEmail = async () => {
    try {
      if (!token) { 
        navigate('/sign-in');
        showErrorNotification('Unauthorized!');
        return;
      }

      const res = await emailApiService.verificate(token!);

      if (res.status === 401) {
        showErrorNotification("Session expired, please sign-in");
        navigate("/sign-in");
        return;
      }

      setIsLoading(false);
      dispatch(authActions.login());
      showSuccessNotification("Email successfully verificated!");
      navigate("/profile");
    } catch (err) {}
  };

  useEffect(() => {
    verificateEmail();
  }, []);

  return (
    <div>
      <Blocks
        visible={isLoading}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
      />
    </div>
  );
};

export default VerificationPage;
