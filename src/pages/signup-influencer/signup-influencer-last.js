import React from "react";
import Header from "../../components/Header";
import Background from "../../components/Background";
import SignupInfluencerLast from "../../components/layout/signup/SignupInfluencerLast";

const SignupInfluencerLastPage = () => {
  return (
    <>
      <Header userType="client" path="Influencer" page="signup" />
      <SignupInfluencerLast />
      <Background />
    </>
  );
};

export default SignupInfluencerLastPage;
