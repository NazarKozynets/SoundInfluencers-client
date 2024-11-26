import React, {useEffect} from "react";
import arrow from "../../../../../images/icons/arrow.svg";
import TitleSection from "../../../../TitleSection";
import FormContainer from "../../../../form/FormContainer";
import {
    setClearCampaignDetails,
    setCurrentWindow,
    setSelectAmount, setSelectInfluencer,
    setSelectPrice, setSelectPriceInfluencers
} from "../../../../../redux/slice/create-promo";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

const AccountClientDetailsQuestion = () => {
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const {socialMedia} = useParams();
    
    const selectPrice = useSelector((state) => state.createPromo.data.selectPrice);
    const data = useSelector((state) => state.createPromo.data);
    
    useEffect(() => {
        dispatch(setSelectAmount(selectPrice.price));
        
        const newSelectInfluencers = [...data.selectInfluencers, ...data.selectPriceInfluencers];
        dispatch(setSelectInfluencer(newSelectInfluencers));
        dispatch(setSelectPriceInfluencers([]));
    }, []);

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

    const returnTitle = () => {
        let obj = {title: '', span: ''};
        if (socialMedia === "spotify" || socialMedia === "soundcloud") {
            obj.title = 'submit';
            obj.span = 'this song';
        } else {
            obj.title = 'post';
            obj.span = 'this content';
        }
        return obj;
    }

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
                    <TitleSection title={returnTitle().title} span={returnTitle().span}/>
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