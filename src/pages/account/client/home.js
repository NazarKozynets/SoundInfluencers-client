import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountClientHome from "../../../components/layout/account/client/AccountClientHome";

const AccountClientHomePage = () => {
  return (
    <>
      <Header path="Sponsoring client" />
      <AccountClientHome />
      <Background />
    </>
  );
};

export default AccountClientHomePage;
