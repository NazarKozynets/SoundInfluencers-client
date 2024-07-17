import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AcountClientPastPromosCurrent from "../../../components/layout/account/client/AcountClientPastPromosCurrent";
import { useParams } from "react-router-dom";

const AcountClientPastPromosCurrentPage = () => {
  const params = useParams();
  return (
    <>
      <Header
        path={`Sponsoring client / My account / Past promos / ${params.id}`}
      />
      <AcountClientPastPromosCurrent />
      <Background />
    </>
  );
};

export default AcountClientPastPromosCurrentPage;
