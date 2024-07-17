import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountClientInvoiceDetails from "../../../components/layout/account/client/AccountClientInvoiceDetails";

const AccountClientInvoiceDetailsPage = () => {
  return (
    <>
      <Header path="Sponsoring client / My account / My Invoice Details" />
      <AccountClientInvoiceDetails />
      <Background />
    </>
  );
};

export default AccountClientInvoiceDetailsPage;
