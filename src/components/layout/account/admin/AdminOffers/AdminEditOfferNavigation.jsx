import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import AdminEditNewOffer from "./offersComponents/AdminEditNewOffer";
import AdminEditOldOffer from "./offersComponents/AdminEditOldOffer";
import axios from "axios";  

const AdminEditOfferNavigation = () => {
    const [influencers, setInfluencers] = useState(null);
    const isNew = useSelector((state) => state.adminOffers.isNew);
    
    const getData = async () => {
        const result = await axios(
            `${process.env.REACT_APP_SERVER}/auth/influencers`
        );

        if (result.status === 200) {
            setInfluencers(result.data.influencers);
        }
    }

    useEffect(() => {
        getData();
    }, []);
    
    if (influencers) {
        return (
            <>
                {isNew ? (
                    <AdminEditNewOffer influencers={influencers}/>
                ) : (
                    <AdminEditOldOffer influencers={influencers}/>
                )}
            </>
        )
    }
};

export default AdminEditOfferNavigation;