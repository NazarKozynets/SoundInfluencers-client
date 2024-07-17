import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountInfluencerDetails from "../../../components/layout/account/influencer/AccountInfluencerDetails";

const AccountInfluencerDetailsPage = () => {
  return (
    <>
      <Header path="Influencer / My account / My account details" />
      <AccountInfluencerDetails />
      <Background />
    </>
  );
};

export default AccountInfluencerDetailsPage;
