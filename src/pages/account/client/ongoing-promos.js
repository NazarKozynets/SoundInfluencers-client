import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AcountClientPastPromos from "../../../components/layout/account/client/AcountClientPastPromos";
import AcountClientOngoingPromos from "../../../components/layout/account/client/AccountClientOngoingPromos";

const AcountClientOngoingPage = () => {
  return (
    <>
      <Header path="Sponsoring client / My account / Ongoing promos" />
      <AcountClientOngoingPromos />
      <Background />
    </>
  );
};

export default AcountClientOngoingPage;
