import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountInfluencerHome from "../../../components/layout/account/influencer/AccountInfluencerHome";

const AccountInfluencerHomePage = () => {
  return (
    <>
      <Header path="Influencer" />
      <AccountInfluencerHome />
      <Background />
    </>
  );
};

export default AccountInfluencerHomePage;
