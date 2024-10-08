import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminInvoicesClients from "../../../components/layout/account/admin/AdminInvoicesClients";

const AccountAdminInvoicesClients = () => {
    return (
        <>
            <Header path="Admin/Invoices Clients"/>
            <AdminInvoicesClients />
            <Background />
        </>
    );
};

export default AccountAdminInvoicesClients;
