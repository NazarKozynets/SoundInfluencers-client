import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountClientOffers from "../../../components/layout/account/client/AccountClientOffers";

const AccountClientOffersPage = () => {
  return (
    <>
      <Header path="Sponsoring client" />
      <AccountClientOffers />
      <Background />
    </>
  );
};

export default AccountClientOffersPage;
