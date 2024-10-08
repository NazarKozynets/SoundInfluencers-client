import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminOffers from "../../../components/layout/account/admin/AdminOffers";

const AccountAdminOffers= () => {
    return (
        <>
            <Header path="Admin/Offers"/>
            <AdminOffers />
            <Background />
        </>
    );
};

export default AccountAdminOffers;
