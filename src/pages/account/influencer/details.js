import React, {useEffect} from "react";
import Header from "../../../components/Header";
import Background from "../../../components/Background/index";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentWindow} from "../../../redux/slice/signup-influencer";
import AccountInfluencerAddNewBrand
    from "../../../components/layout/account/influencer/InfluencerAccountDetails/AccountInfluencerAddNewBrand";
import AccountInfluencerDetails
    from "../../../components/layout/account/influencer/InfluencerAccountDetails/AccountInfluencerDetails";

const AccountClientDetailsPage = () => {
    const dispatch = useDispatch();
    const currentWindow = useSelector((state) => state.signupInfluencer.currentWindow);

    useEffect(() => {
        return () => {
            dispatch(setCurrentWindow(0));
        };
    }, []);

    return (
        <>
            <Header path="Sponsoring client / My account / My Account Details" />
            {
                [
                    <AccountInfluencerDetails/>,
                    <AccountInfluencerAddNewBrand/>,
                ][currentWindow]
            }
            <Background/>
        </>
    );
};

export default AccountClientDetailsPage;

