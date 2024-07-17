import React from "react";
import Header from "../components/Header";
import Background from "../components/Background";
import TermsInfluencer from "../components/layout/TermsInfluencer";

const TermsInfluencerPage = () => {
  return (
    <>
      <Header />
      <TermsInfluencer />
      <Background theme={"dark"} />
    </>
  );
};

export default TermsInfluencerPage;
