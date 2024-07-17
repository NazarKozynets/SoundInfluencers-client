import React from "react";
import Header from "../components/Header";
import SignupSelect from "../components/layout/signup/SignupSelect";
import Background from "../components/Background";

const Signup = () => {
  return (
    <>
      <Header userType="client" page="signup" />
      <SignupSelect />
      <Background />
    </>
  );
};

export default Signup;
