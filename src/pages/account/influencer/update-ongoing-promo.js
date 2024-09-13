import React from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
import AccountInfluencerCreateInvoice from "../../../components/layout/account/influencer/CreateInvoice";
import ReportCampaigns from "../../../components/layout/account/influencer/ReportCampaigns";
import UpdateOngoingPromo from "../../../components/layout/account/influencer/UpdateOngoingPromo";

const AccountInfluencerUpdateIngoingPromoPage = () => {
    return (
        <>
            <Header path="Influencer" />
            <UpdateOngoingPromo />
            <Background />
        </>
    );
};

export default AccountInfluencerUpdateIngoingPromoPage;
