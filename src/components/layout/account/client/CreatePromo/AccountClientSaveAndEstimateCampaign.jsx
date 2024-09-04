import React, {useEffect, useState} from 'react';
import TitleSection from "../../../../TitleSection";
import FormContainer from "../../../../form/FormContainer";
import StandardButton from "../../../../form/StandardButton";
import UseVerify from "../../../../../hooks/useVerify";
import axios from "axios";
import {setClearForm, setCurrentWindow} from "../../../../../redux/slice/create-promo";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import arrow from "../../../../../images/icons/arrow.svg";
const AccountClientSaveAndEstimateCampaign = () => {
    // const [data, setData] = useState(null);
    
    const navigation = useNavigate();

    const dispatch = useDispatch();

    const dataPromo = useSelector((state) => state.createPromo.data);

    // const getData = async () => {
    //     try {
    //         const { dataFetch } = await UseVerify();
    //
    //         setData(dataFetch);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    //
    // useEffect(() => {
    //     getData();
    // }, []);
    
    const createPromoEstimate = async () => {
        try {
            const { dataFetch } = await UseVerify();
            const result = await axios.post(
                `${process.env.REACT_APP_SERVER}/promos/estimate`,
                { ...dataPromo, userId: dataFetch._id }
            );

            if (result.data.code === 201) {
                if (result.data.code === 201) {
                    navigation("/");
                }
                window.sessionStorage.setItem("isPopup", 1);
                dispatch(setClearForm());
                dispatch(setCurrentWindow(0));
            }
        } catch (err) {
            console.log(err);
        }
    };
    
    return (
        <section className="account-client">
            <div className="container-form">
                <div className="account-client-back-button">
                    <button style={{
                        position: "absolute", top: 200, left: 100, width: 48, height: 48, cursor: "pointer",
                    }} onClick={() => dispatch(setCurrentWindow(1))}>
                        <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                    </button>
                </div>
                <TitleSection title="post" span="this content"/>
                <FormContainer style={{marginTop: "60px"}}>
                    <form style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }} className="account-client-save-and-estimate-form">
                        <div className="account-client-save-and-estimate-form-first-block"
                             style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "flex", gap: 28}}>
                                <span>#1</span>
                                <p>SAVE & SEND ESTIMATE</p>
                                <StandardButton text={"Send"} onClick={() => createPromoEstimate()}/>
                            </div>
                            <div style={{display: "flex", gap: 28}}>
                                <span>#2</span>
                                <p>BOOK A STRATEGY MEETING</p>
                            </div>
                            <div>
                                <iframe className="account-client-save-and-estimate-form-meetfox"
                                        src="https://meetfox.com/en/e/napoleonpr/borderless?l=napoleon-pr-intro-meeting"/>
                            </div>
                        </div>
                    </form>
                </FormContainer>
            </div>
        </section>
    );
}

export default AccountClientSaveAndEstimateCampaign;