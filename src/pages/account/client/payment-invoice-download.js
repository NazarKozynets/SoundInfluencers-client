import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountClientDownloadInvoice from "../../../components/layout/account/client/AccountClientDownloadInvoice";

const PaymentInvoiceDownload = () => {
    return (
        <>
            <Header/>
            <AccountClientDownloadInvoice />
            <Background />
        </>
    );
};

export default PaymentInvoiceDownload;
