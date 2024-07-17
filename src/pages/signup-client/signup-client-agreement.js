import React from "react";
import Header from "../../components/Header";
import Background from "../../components/Background";
import SignupClientAgreement from "../../components/layout/signup/SignupClientAgreement";

const SignupClientAgreementPage = () => {
  return (
    <>
      <Header userType="influencer" path="Sponsoring client" page="signup" />
      <SignupClientAgreement />
      <Background />
    </>
  );
};

export default SignupClientAgreementPage;
