import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountClientOffer from "../../../components/layout/account/client/AccountClientOffer";

const AccountClientListOffers = () => {
  return (
    <>
      <Header path="Choose offer" />
      <AccountClientOffer />
      <Background />
    </>
  );
};

export default AccountClientListOffers;
