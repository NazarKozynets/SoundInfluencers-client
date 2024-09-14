import React, {useEffect} from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header";
import Background from "../../../components/Background";
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
