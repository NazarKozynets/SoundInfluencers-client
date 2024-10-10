import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminCampaignManagement from "../../../components/layout/account/admin/AdminCampaignManagement";

const AccountAdminCampaignManagement = () => {
    return (
        <>
            <Header path="Admin/Campaigns/Campaign Management"/>
            <AdminCampaignManagement />
            <Background />
        </>
    );
};

export default AccountAdminCampaignManagement;
