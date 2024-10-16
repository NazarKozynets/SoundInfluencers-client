import React, {useEffect, useState} from "react";
import AccountClientOffers from "./AccountClientOffers";
import AccountClientPostContent from "./AccountClientPostContent";
import AccountClientPayment from "./AccountClientPayment";
import AccountClientDetailsQuestion from "./AccountClientDetailsQuestion";
import {useDispatch, useSelector} from "react-redux";
import AccountClientCampaignStrategy from "./AccountClientCampaignStrategy";
import AccountClientSaveAndEstimateCampaign from "./AccountClientSaveAndEstimateCampaign";
import {
    setCurrentWindow,
    setSelectAmount,
    setSelectInfluencer,
    setSelectPrice,
} from "../../../../../redux/slice/create-promo";

const CreatePromo = () => {
    const dispatch = useDispatch();
    const currentWindow = useSelector((state) => state.createPromo.currentWindow);

    useEffect(() => {
        return () => {
            dispatch(setSelectInfluencer([]));
            dispatch(
                setSelectPrice({
                    variant: 0,
                    price: 0,
                })
            );
            dispatch(setSelectAmount(0));
            dispatch(setCurrentWindow(0));
        };
    }, []);

    return (
        <>
            {
                [
                    <AccountClientOffers/>,
                    <AccountClientDetailsQuestion/>,
                    <AccountClientSaveAndEstimateCampaign/>,
                    <AccountClientPostContent/>,
                    <AccountClientCampaignStrategy/>,
                    <AccountClientPayment/>,
                ][currentWindow]
            }
        </>
    );
};

export default CreatePromo;
