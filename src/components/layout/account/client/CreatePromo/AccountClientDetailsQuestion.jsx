import React from "react";
import arrow from "../../../../../images/icons/arrow.svg";
import TitleSection from "../../../../TitleSection";
import FormContainer from "../../../../form/FormContainer";
import {setCurrentWindow} from "../../../../../redux/slice/create-promo";
import {useDispatch, useSelector} from "react-redux";

const AccountClientDetailsQuestion = () => {
    const dispatch = useDispatch();
    
    const nextFormForNoButton = () => {
        dispatch(setCurrentWindow(2));
    };

    const nextFormForYesButton = () => {
        dispatch(setCurrentWindow(3));
    };
    
    return (
        <section className="account-client">
            <div className="container-form">
                {/*<div className="account-client-back-button">*/}
                {/*    <button style={{*/}
                {/*        position: "absolute", top: 200, left: 50, width: 48, height: 48, cursor: "pointer",*/}
                {/*    }} onClick={() => navigation("/account/client/list-promo")}>*/}
                {/*        <img src={arrow} style={{transform: "rotate(180deg)"}}/>*/}
                {/*    </button>*/}
                {/*</div>*/}
                <TitleSection title="post" span="this content"/>
                <FormContainer style={{marginTop: "60px"}}>
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
        </section>
    );
};

export default AccountClientDetailsQuestion;