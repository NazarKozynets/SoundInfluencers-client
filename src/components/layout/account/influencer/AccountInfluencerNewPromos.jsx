import React, {useEffect, useState} from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import UseVerify from "../../../../hooks/useVerify";
import acceptIcon from "../../../../images/icons/accept.svg";
import ResponseButton from "../../../form/ResponseButton";
import ModalWindow from "../../../ModalWindow";
import StandardButton from "../../../form/StandardButton";
import ImageWithFallback from "../../../ImageWithFallback";
import altLogo from "../../../../images/alt-logo.jpg";

import arrow from "../../../../images/icons/arrow.svg";

const AcountInfluencerNewPromos = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModalReject, setIsOpenModalReject] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [templateDate, setTemplate] = useState();
    const navigation = useNavigate();
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const { dataFetch } = await UseVerify();
            const result = await axios(
                `${process.env.REACT_APP_SERVER}/promos/get-new-promos?influencerId=${dataFetch._id}`
            );

            const filterData = result.data.promos.filter((item) => item);

            const updatedData = filterData.map(promo => {
                if (promo.videos && promo.selectedVideo) {
                    const video = promo.videos.find(videoItem => videoItem.videoLink === promo.selectedVideo);
                    return {
                        ...promo,
                        video: video || null, 
                        videos: undefined      
                    };
                }
                return promo;
            });

            setData(updatedData);
            console.log(updatedData);

        } catch (err) {
            console.log(err);
        }
    };



    const responsePromo = async (id, res, instagramUsername) => {
        if (!id || !res || !instagramUsername || isProcessing) return;
        setIsProcessing(true);
        try {
            const {dataFetch} = await UseVerify();
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/promos/update-response?influencerId=${dataFetch._id}&instagramUsername=${instagramUsername}&promoId=${id}&promoResponse=${res}`
            );

            if (result.data.code === 200) {
                getData();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    return (
        <section className="account-client-past-promos">
            <div className="container">
                <div className="account-client-past-promos-block" style={{position: "relative"}}>
                    <div className="account-client-past-promos-block-title">
                        <TitleSection title="MY" span="account"/>
                    </div>
                    <button
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 50,
                            height: 50,
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            navigation("/account/influencer")
                        }}
                    >
                        <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                    </button>

                    <p className="account-client-past-promos-second">New promos</p>

                    {data.map((item, index) => (
                        <FormContainer
                            style={{
                                marginTop: "70px",
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                paddingTop: 30,
                                gap: 0,
                            }}
                        >
                            <div className="account-client-past-promos-form-current">
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingLeft: 80,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "45%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: "20px"
                                        }}
                                    >
                                        <ImageWithFallback
                                            style={{width: "100%", maxWidth: 300}}
                                            src={item?.clientLogo ? item.clientLogo : ""}
                                            fallbackSrc={altLogo}
                                        />
                                    </div>
                                    <div
                                        className="account-client-past-promos-form-current-content"
                                        style={{padding: "0 20px 30px 20px"}}
                                    >
                                        <h2 className="account-client-past-promos-form-current-content-title">
                                            Promo {index + 1}
                                        </h2>
                                        <p className="account-client-past-promos-form-current-content-client">
                                            Instagram:{" "}
                                            <span
                                                className="account-client-past-promos-form-current-content-client-value">
                        {item ? item.instagramUsername : "No Data"}
                      </span>
                                        </p>
                                        <p className="account-client-past-promos-form-current-content-client">
                                            Client:{" "}
                                            <span
                                                className="account-client-past-promos-form-current-content-client-value">
                        {item ? item.client : "No Data"}
                      </span>
                                        </p>
                                        <p className="account-client-past-promos-form-current-content-link">
                                            Videolink:{" "}
                                            <a
                                                href={item ? item.video.videoLink : "No Data"}
                                                className="account-client-past-promos-form-current-content-link-value"
                                                target="_blank"
                                            >
                                                {item ? item.video.videoLink : "No Data"}
                                            </a>
                                        </p>

                                        <p className="account-client-past-promos-form-current-content-desc">
                                            Description:{" "}
                                            <span
                                                className="account-client-past-promos-form-current-content-desc-value">
                        {item ? item.video.postDescription : "No Data"}
                      </span>
                                        </p>
                                        <p className="account-client-past-promos-form-current-content-desc">
                                            Story Link:{" "}
                                            <span
                                                className="account-client-past-promos-form-current-content-desc-value">
                        {item ? item.video.swipeUpLink : "No Data"}
                      </span>
                                        </p>
                                        <p className="account-client-past-promos-form-current-content-desc">
                                            Story Tag:{" "}
                                            <span
                                                className="account-client-past-promos-form-current-content-desc-value">
                        {item ? item.video.storyTag : "No Data"}
                      </span>
                                        </p>
                                        <p className="account-client-past-promos-form-current-content-date">
                                            Date Request:{" "}
                                            <span
                                                className="account-client-past-promos-form-current-content-date-value">
                        {item ? item.dateRequest : "No Data"}
                      </span>
                                        </p>
                                        <p className="account-client-past-promos-form-current-content-wish">
                                            Special Requests:{" "}
                                            <span
                                                className="account-client-past-promos-form-current-content-wish-value">
                        {item ? item.video.specialWishes : "No Data"}
                      </span>
                                        </p>
                                    </div>
                                </div>
                                <ResponseButton
                                    onClickYes={() => {
                                        if (!isProcessing) {
                                            setIsOpenModal(true);
                                            responsePromo(item._id, "accept", item.instagramUsername);
                                        }
                                    }}
                                    onClickNo={() => {
                                        if (!isProcessing) {
                                            setIsOpenModalReject(true);
                                            setTemplate({
                                                id: item._id,
                                                res: "refusing",
                                                instagramUsername: item.instagramUsername,
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </FormContainer>
                    ))}

                    {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <a
              href="mailto:admin@soundinfluencers.com?subject=Support%20Request"
              className="account-client-past-promos-current-report"
            >
              Click here for Report
            </a>
          </div> */}
                </div>
            </div>

            <ModalWindow isOpen={isOpenModal} setClose={setIsOpenModal}>
                <div className="signup-client-modal">
                    <img className="signup-client-modal-icon" src={acceptIcon}/>

                    <h2 className="signup-client-modal-title">Congratulations!</h2>

                    <p className="signup-client-modal-second">
                        Your Promo Information is Now Live in the{" "}
                        <button
                            className="signup-client-modal-second"
                            style={{
                                color: "#3330E4",
                                textDecorationLine: "underline",
                                cursor: "pointer",
                            }}
                            onClick={() => navigation("/account/influencer/ongoing-promos")}
                        >
                            "Ongoing Promo"
                        </button>
                        {" "}
                        Section!
                    </p>

                    <p className="signup-client-modal-desc">
                        Kindly proceed from there to fulfil the content distribution.
                    </p>

                    <StandardButton
                        text="Ok"
                        style={{
                            padding: "8px 80px",
                            marginTop: "30px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        onClick={() => navigation("/signup/influencer/agreement")}
                    />
                </div>
            </ModalWindow>
            <ModalWindow isOpen={isOpenModalReject} setClose={setIsOpenModalReject}>
                <div className="signup-client-modal">
                    <p className="signup-client-modal-desc">
                        You agree that your brand WILL NOT take part of promoting this
                        content as provided by us here.
                    </p>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <StandardButton
                            text="NOT TAKE PART OF THE CAMPAIGN"
                            style={{
                                padding: "8px 20px",
                                marginTop: "30px",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            onClick={() => {
                                responsePromo(
                                    templateDate.id,
                                    templateDate.res,
                                    templateDate.instagramUsername
                                );
                                setIsOpenModalReject(false);
                                setTemplate({});
                            }}
                        />
                        <StandardButton
                            text="GO BACK TO CAMPAIGN DETAILS"
                            style={{
                                padding: "8px 20px",
                                marginTop: "30px",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            onClick={() => {
                                setIsOpenModalReject(false);
                                setTemplate({});
                            }}
                        />
                    </div>
                </div>
            </ModalWindow>
        </section>
    );
};

export default AcountInfluencerNewPromos;
