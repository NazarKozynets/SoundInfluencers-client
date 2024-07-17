import React from "react";
import Header from "../../components/Header";
import SignupClient from "../../components/layout/signup/SignupClient";
import Background from "../../components/Background";

const SignupClientPage = () => {
  return (
    <>
      <Header userType="influencer" page="signup" path="Sponsoring client" />
      <SignupClient />
      <Background />
    </>
  );
};

export default SignupClientPage;
