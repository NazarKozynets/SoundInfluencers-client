import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AcountClientPastPromos from "../../../components/layout/account/client/AcountClientPastPromos";

const AcountClientPastPromosPage = () => {
  return (
    <>
      <Header path="Sponsoring client / My account / Past promos" />
      <AcountClientPastPromos />
      <Background />
    </>
  );
};

export default AcountClientPastPromosPage;
