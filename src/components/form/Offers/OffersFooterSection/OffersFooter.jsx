import React from "react";
import {useDispatch, useSelector} from "react-redux";
import StandardButton from "../../StandardButton";
import {setCurrentWindow} from "../../../../redux/slice/create-promo";
import "./offersFooter.css";

const OffersFooter = () => {
    const data = useSelector((state) => state.createPromo.data);
    
    const dispatch = useDispatch();
    
    const nextForm = () => {
        if (data.amount === 0 || data.selectInfluencers.length === 0) return;
        dispatch(setCurrentWindow(1));
    };
    
    return (
        <div className="offers-footer">
            <div className="left-side">
                <p>IG 3M</p>
                <p>+</p>
                <p>3 NETWORKS</p>
            </div>
            <div className="right-side">
                <p>TOTAL: {
                    <span>{data.amount}{data.currency}</span>
                }</p>
                <div className="right-side-button">
                    <StandardButton text="Continue" onClick={nextForm} style={{height: 40}}/>
                </div>
            </div>
        </div>
    );
}

export default OffersFooter;