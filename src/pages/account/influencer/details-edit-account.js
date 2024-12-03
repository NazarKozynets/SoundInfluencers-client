import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountInfluencerEditAccount
    from "../../../components/layout/account/influencer/InfluencerAccountDetails/AccountInfluencerEditAccount";

const InfluencerEditAccount = () => {
    return (
        <>
            <Header path="Influencer / My account / My account details" />
            <AccountInfluencerEditAccount />
            <Background />
        </>
    );
};

export default InfluencerEditAccount;
