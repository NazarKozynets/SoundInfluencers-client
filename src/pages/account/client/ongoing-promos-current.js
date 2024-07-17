import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AcountClientPastPromos from "../../../components/layout/account/client/AcountClientPastPromos";
import AcountClientOngoingPromos from "../../../components/layout/account/client/AccountClientOngoingPromos";
import ReportCampaigns from "../../../components/layout/account/influencer/ReportCampaigns";

const AcountClientOngoingCurrentPage = () => {
  return (
    <>
      <Header path="Sponsoring client / My account / Ongoing promos" />
      <ReportCampaigns />
      <Background />
    </>
  );
};

export default AcountClientOngoingCurrentPage;
