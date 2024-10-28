import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminOffersNavigation from "../../../components/layout/account/admin/AdminOffersNavigation";

const AccountAdminOffers= () => {
    return (
        <>
            <Header path="Admin/Offers"/>
            <AdminOffersNavigation />
            <Background />
        </>
    );
};

export default AccountAdminOffers;
