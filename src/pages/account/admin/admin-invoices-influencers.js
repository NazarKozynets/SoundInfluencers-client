import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminInvoicesInfluencers from "../../../components/layout/account/admin/AdminInvoicesInfluencers";

const AccountAdminInvoicesInfluencers = () => {
    return (
        <>
            <Header path="Admin/Invoices Influencers"/>
            <AdminInvoicesInfluencers />
            <Background />
        </>
    );
};

export default AccountAdminInvoicesInfluencers;
