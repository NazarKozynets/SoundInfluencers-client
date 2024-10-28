import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentWindow} from "../../../../redux/slice/admin-offers";
import AdminOffers from "./AdminOffers/AdminOffers";
import AdminEditOfferNavigation from "./AdminOffers/AdminEditOfferNavigation";

const AdminOffersNavigation = () => {
    const dispatch = useDispatch();
    const currentWindow = useSelector((state) => state.adminOffers.currentWindow);

    useEffect(() => {
        return () => {
            dispatch(setCurrentWindow(0));
        };
    }, []);

    return (
        <>
            {
                [
                    <AdminOffers/>,
                    <AdminEditOfferNavigation/>
                ][currentWindow]
            }
        </>
    )
};

export default AdminOffersNavigation;