import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AcountInfluencerPastPromos from "../../../components/layout/account/influencer/AccountInfluencerPastPromos/AcountInfluencerPastPromos";
import AcountClientOngoingCurrent from "../../../components/layout/account/influencer/AccountInfluencerOngoingPromos/AccountOngoingCurrent";
import AccountInfluencerOngoingPromos from "../../../components/layout/account/influencer/AccountInfluencerOngoingPromos/AccountInfluencerOngoingPromos";

const AccountInfluencerOngoingPromosPage = () => {
  return (
    <>
      <Header path="Influencer / My account / Ongoing Promo" />
      <AccountInfluencerOngoingPromos />
      <Background />
    </>
  );
};

export default AccountInfluencerOngoingPromosPage;
