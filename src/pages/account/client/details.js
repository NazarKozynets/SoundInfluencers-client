import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountClientDetails from "../../../components/layout/account/client/AccountClientDetails";

const AccountClientDetailsPage = () => {
  return (
    <>
      <Header path="Sponsoring client / My account / My Account Details" />
      <AccountClientDetails />
      <Background />
    </>
  );
};

export default AccountClientDetailsPage;
