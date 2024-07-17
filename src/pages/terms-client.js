import React from "react";
import Header from "../components/Header";
import Background from "../components/Background";
import TermsClient from "../components/layout/TermsClient";

const TermsClientPage = () => {
  return (
    <>
      <Header />
      <TermsClient />
      <Background theme={"dark"} />
    </>
  );
};

export default TermsClientPage;
