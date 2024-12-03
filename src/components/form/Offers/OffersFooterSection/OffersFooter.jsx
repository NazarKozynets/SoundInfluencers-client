import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import StandardButton from "../../StandardButton";
import {setCurrentWindow} from "../../../../redux/slice/create-promo";
import "./offersFooter.css";

const OffersFooter = ({nextForm}) => {
    const data = useSelector((state) => state.createPromo.data);
    
    const dispatch = useDispatch();
    
    const calculateActiveInfluencers = () => { 
        let activeInfluencers = 0;
        data.selectInfluencers.map((influencer) => {
            if (influencer.active) activeInfluencers++;
        });
        return activeInfluencers;
    }

    const returnOfferId = () => {
        return data.selectPrice?.variant && data.selectPrice?.variant !== 0 ? `IG ${data.selectPrice.variant}M` : 'No Offer Selected';
    }
    
    useEffect(() => {
        calculateActiveInfluencers()
        returnOfferId()
    }, [data])
    
    return (
        <div className="offers-footer">
            <div className="left-side">
                <p>{returnOfferId()}</p>
                <p>+</p>
                <p>{calculateActiveInfluencers()} NETWORKS</p>
            </div>
            <div className="right-side">
                <p>TOTAL: {
                    <span>{data.selectPrice.price}{data.currency}</span>
                }</p>
                <div className="right-side-button">
                    <StandardButton text="Continue" onClick={nextForm} style={{height: 40}}/>
                </div>
            </div>
        </div>
    );
}

export default OffersFooter;