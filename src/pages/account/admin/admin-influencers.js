import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminInfluencers from "../../../components/layout/account/admin/AdminInfluencers";

const AccountAdminInfluencers = () => {
    return (
        <>
            <Header path="Admin/Influencers"/>
            <AdminInfluencers />
            <Background />
        </>
    );
};

export default AccountAdminInfluencers;
