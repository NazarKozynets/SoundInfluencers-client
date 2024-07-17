import React from "react";
import Header from "../../components/Header";
import Background from "../../components/Background";
import ForgotPasswordCode from "../../components/layout/login/ForgotPasswordCode";

const ForgotPasswordCodePage = () => {
  return (
    <>
      <Header path="Sponsoring client" />
      <ForgotPasswordCode />
      <Background />
    </>
  );
};

export default ForgotPasswordCodePage;
