import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountInfluencerInvoices from "../../../components/layout/account/influencer/AccountInfluencerInvoices";

const AccountInfluencerInvoicesPage = () => {
  return (
    <>
      <Header path="Influencer / My account / My Invoices" />
      <AccountInfluencerInvoices />
      <Background />
    </>
  );
};

export default AccountInfluencerInvoicesPage;
