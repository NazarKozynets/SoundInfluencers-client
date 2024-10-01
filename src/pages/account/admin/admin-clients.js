import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminClients from "../../../components/layout/account/admin/AdminClients";

const AccountAdminClients = () => {
    return (
        <>
            <Header path="Admin/Clients"/>
            <AdminClients />
            <Background />
        </>
    );
};

export default AccountAdminClients;
