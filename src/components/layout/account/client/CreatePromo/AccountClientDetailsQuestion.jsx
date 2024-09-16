import React from "react";
import arrow from "../../../../../images/icons/arrow.svg";
import TitleSection from "../../../../TitleSection";
import FormContainer from "../../../../form/FormContainer";
import {setClearCampaignDetails, setCurrentWindow} from "../../../../../redux/slice/create-promo";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const AccountClientDetailsQuestion = () => {
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const nextFormForNoButton = () => {
        dispatch(setCurrentWindow(2));
    };

    const nextFormForYesButton = () => {
        dispatch(setCurrentWindow(3));
    };

    const nextFormForBackButton = () => {
        dispatch(setCurrentWindow(0));
        dispatch(setClearCampaignDetails());
    };

    return (
        <section className="account-client">
            <div className="account-client-back-button">
                <button style={{
                    position: "absolute", top: "195px", left: 50, width: 48, height: 48, cursor: "pointer",
                }} onClick={() => nextFormForBackButton()}>
                    <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                </button>
            </div>
            <div className="container-form-details-question">
                <div className="container-form-details-question-title">
                    <TitleSection title="post" span="this content"/>
                </div>
                <div className="container-form-details-question-form">
                    <FormContainer style={{marginTop: "60px"}} >
                        <form style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}>
                            <p style={{
                                fontFamily: "Geometria",
                                fontSize: "26px",
                                fontWeight: "700",
                                textAlign: "center",
                            }}>DO YOU HAVE THE CONTENT READY?</p>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "28px",
                                marginTop: "34px",
                            }}>
                                <button style={{
                                    boxShadow: "0px 4px 20px 0px #3330E4",
                                    width: 142,
                                    height: 80,
                                    borderRadius: "30px",
                                    fontFamily: "Geometria",
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    textAlign: "center",
                                    cursor: "pointer",
                                }} onClick={() => nextFormForYesButton()}>YES
                                </button>
                                <button style={{
                                    boxShadow: "0px 4px 20px 0px #3330E4",
                                    width: 142,
                                    height: 80,
                                    borderRadius: "30px",
                                    fontFamily: "Geometria",
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    textAlign: "center",
                                    cursor: "pointer",
                                }} onClick={() => nextFormForNoButton()}>NO
                                </button>
                            </div>
                        </form>
                    </FormContainer>
                </div>
            </div>
        </section>
    );
};

export default AccountClientDetailsQuestion;