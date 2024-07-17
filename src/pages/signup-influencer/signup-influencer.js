import React from "react";
import Header from "../../components/Header";
import SignupInfluencer from "../../components/layout/signup/SignupInfluencer";
import Background from "../../components/Background";

const SignupInfluencerPage = () => {
  return (
    <>
      <Header userType="client" path="Influencer" page="signup" />
      <SignupInfluencer />
      <Background />
    </>
  );
};

export default SignupInfluencerPage;
