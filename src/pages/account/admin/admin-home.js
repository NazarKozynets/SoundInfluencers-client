import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AdminHome from "../../../components/layout/account/admin/AdminHome";

const AccountAdminHome = () => {
    
    return (
        <>
            <Header path="Admin Panel"/>
            <AdminHome />
            <Background />
        </>
    );
};

export default AccountAdminHome;
