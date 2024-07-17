import React from "react";
import Header from "../../components/Header";
import Background from "../../components/Background";
import LoginInfluencer from "../../components/layout/login/LoginInfluencer";

const LoginInfluencerPage = () => {
  return (
    <>
      <Header userType="client" page="login" path="Influencer" />
      <LoginInfluencer />
      <Background />
    </>
  );
};

export default LoginInfluencerPage;
