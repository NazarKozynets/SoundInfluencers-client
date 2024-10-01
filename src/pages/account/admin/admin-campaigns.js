import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminCampaigns from "../../../components/layout/account/admin/AdminCampaigns";

const AccountAdminCampaigns = () => {
    return (
        <>
            <Header path="Admin/Campaigns"/>
            <AdminCampaigns />
            <Background />
        </>
    );
};

export default AccountAdminCampaigns;
