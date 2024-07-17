import React from "react";
import Header from "../../components/Header";
import ForgotPasswordEmail from "../../components/layout/login/ForgotPasswordEmail";
import Background from "../../components/Background";

const ForgotPasswordEmailPage = () => {
  return (
    <>
      <Header path="Sponsoring client" />
      <ForgotPasswordEmail />
      <Background />
    </>
  );
};

export default ForgotPasswordEmailPage;
