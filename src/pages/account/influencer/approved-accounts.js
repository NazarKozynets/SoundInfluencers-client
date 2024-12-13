import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import ApprovedAccounts
    from "../../../components/layout/account/influencer/InfluencerAccountDetails/AccountInfluencerApprovedAccounts";

const AccountInfluencerApprovedAccounts = () => {
    return (
        <>
            <Header path="Influencer" />
            <ApprovedAccounts />
            <Background />
        </>
    );
};

export default AccountInfluencerApprovedAccounts;
