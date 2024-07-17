import React from "react";
import Header from "../../components/Header";
import Background from "../../components/Background";
import SignupInfluencerAgreement from "../../components/layout/signup/SignupInfluencerAgreement";

const SignupInfluencerAgreementPage = () => {
  return (
    <>
      <Header userType="client" path="Influencer" page="signup" />
      <SignupInfluencerAgreement />
      <Background />
    </>
  );
};

export default SignupInfluencerAgreementPage;
