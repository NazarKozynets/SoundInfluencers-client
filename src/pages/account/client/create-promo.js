import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";

import CreatePromo from "../../../components/layout/account/client/CreatePromo";

const AccountClientCreatePromoPage = () => {
  return (
    <>
      <Header path="Sponsoring client" />
      <CreatePromo />
      <Background />
    </>
  );
};

export default AccountClientCreatePromoPage;
