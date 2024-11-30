import React, {useEffect, useState} from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import UseVerify from "../../../../hooks/useVerify";
import ResponseButton from "../../../form/ResponseButton";
import altLogo from "../../../../images/alt-logo.jpg";
import ImageWithFallback from "../../../ImageWithFallback";

import arrow from "../../../../images/icons/arrow.svg";
import {getSocialMedia} from "../../../../utils/typeOfSocialAccounts";


const AcountClientPastPromosCurrent = () => {
    const params = useParams();
    const navigation = useNavigate();
    const [data, setData] = useState({});
    const [dataInfluencer, setDataInfluencer] = useState({});

    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();
            const result = await axios(
                `${process.env.REACT_APP_SERVER}/promos/history/one?userId=${dataFetch._id}&promosId=${params.id}`
            );

            let promoData = result.data.promo;

            if (promoData.selectInfluencers && promoData.videos) {
                promoData.selectInfluencers = promoData.selectInfluencers.map((influencer) => {
                    const matchingVideo = promoData.videos.find(
                        (video) => video.videoLink.trim().toLowerCase() === influencer.selectedVideo.trim().toLowerCase()
                    );
                    return matchingVideo ? {...influencer, video: matchingVideo} : influencer;
                });

                const matchingInfluencer = promoData.selectInfluencers.find(
                    (influencer) => influencer.influencerId === dataFetch._id
                );

                if (matchingInfluencer) {
                    setDataInfluencer(matchingInfluencer);
                } else {
                    console.log("No matching influencer found for _id:", dataFetch._id);
                }
            }

            setData(promoData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const returnForm = () => {
        if (data?.socialMedia === 'spotify' || data?.socialMedia === 'soundcloud') {
            return (
                <div
                    className="account-client-past-promos-form-current-content"
                    style={{padding: "0 20px 30px 20px"}}
                >
                    <h2 className="account-client-past-promos-form-current-content-title">
                        {`${data.campaignName ? data.campaignName : "Promo 1"}`}
                    </h2>
                    <p className="account-client-past-promos-form-current-content-client">
                        {data ? getSocialMedia(data?.socialMedia) : "No Data"}:{" "}
                        <span
                            className="account-client-past-promos-form-current-content-client-value">
                        {dataInfluencer ? dataInfluencer.instagramUsername : "No Data"}
                      </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-client">
                        Client:{" "}
                        <span className="account-client-past-promos-form-current-content-client-value">
                      {data ? data.client : "No Data"}
                    </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-link">
                        {getSocialMedia(data?.socialMedia)} Track Link:{" "}
                        <a
                            href={dataInfluencer.video ? dataInfluencer.video.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {dataInfluencer.video ? dataInfluencer.video.videoLink.slice(0, 15) + '...' : "No Data"}
                        </a>
                    </p>
                    <p className="account-client-past-promos-form-current-content-date">
                        Date Request:{" "}
                        <span className="account-client-past-promos-form-current-content-date-value">
                      {dataInfluencer ? dataInfluencer.dateRequest : "No Data"}
                    </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-wish">
                        Special Requests:{" "}
                        <span className="account-client-past-promos-form-current-content-wish-value">
                      {dataInfluencer.video ? dataInfluencer.video.specialWishes : "No Data"}
                    </span>
                    </p>
                </div>
            );
        } else if (data.socialMedia === 'press') {
            console.log(data,  'data', dataInfluencer, 'dataInfluencer')
            return (
                <div
                    className="account-client-past-promos-form-current-content"
                    style={{padding: "0 20px 30px 20px"}}
                >
                    <h2 className="account-client-past-promos-form-current-content-title">
                        {data.campaignName ? data.campaignName : "Promo 1"}
                    </h2>
                    <p className="account-client-past-promos-form-current-content-client">
                        {data ? getSocialMedia(data?.socialMedia) : "No Data"}:{" "}
                        <span
                            className="account-client-past-promos-form-current-content-client-value">
                        {dataInfluencer ? dataInfluencer.instagramUsername : "No Data"}
                      </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-client">
                        Client:{" "}
                        <span
                            className="account-client-past-promos-form-current-content-client-value">
                        {data ? data.client : "No Data"}
                      </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-link">
                        Link To Music / Event / News:{" "}
                        <a
                            href={dataInfluencer ? dataInfluencer.video?.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {dataInfluencer ? dataInfluencer.video?.videoLink.slice(0, 10) + "..." : "No Data"}
                        </a>
                    </p>

                    <p className="account-client-past-promos-form-current-content-link">
                        Link To Artwork & Press Shots:{" "}
                        <a
                            href={dataInfluencer ? dataInfluencer.video?.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {dataInfluencer ? dataInfluencer.video?.postDescription.slice(0, 10) + "..." : "No Data"}
                        </a>
                    </p>
                    <p className="account-client-past-promos-form-current-content-link">
                        Link To Press Release:{" "}
                        <a
                            href={dataInfluencer ? dataInfluencer.video?.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {dataInfluencer ? dataInfluencer.video?.storyTag.slice(0, 10) + "..." : "No Data"}
                        </a>
                    </p>
                    <p className="account-client-past-promos-form-current-content-date">
                        Date Request:{" "}
                        <span
                            className="account-client-past-promos-form-current-content-date-value">
                        {dataInfluencer ? dataInfluencer.dateRequest : "No Data"}
                      </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-wish">
                        Special Requests:{" "}
                        <span
                            className="account-client-past-promos-form-current-content-wish-value">
                        {dataInfluencer ? dataInfluencer.video?.specialWishes : "No Data"}
                      </span>
                    </p>
                </div>
            );
        } else {
            return (
                <div
                    className="account-client-past-promos-form-current-content"
                    style={{padding: "0 20px 30px 20px"}}
                >
                    <h2 className="account-client-past-promos-form-current-content-title">
                        {`${data.campaignName ? data.campaignName : "Promo 1"}`}
                    </h2>
                    <p className="account-client-past-promos-form-current-content-client">
                        Client:{" "}
                        <span className="account-client-past-promos-form-current-content-client-value">
                      {data ? data.client : "No Data"}
                    </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-link">
                        Videolink:{" "}
                        <a
                            href={dataInfluencer.video ? dataInfluencer.video.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {dataInfluencer.video ? dataInfluencer.video.videoLink : "No Data"}
                        </a>
                    </p>
                    <p className="account-client-past-promos-form-current-content-desc">
                        Description:{" "}
                        <span className="account-client-past-promos-form-current-content-desc-value">
                      {dataInfluencer.video ? dataInfluencer.video.postDescription : "No Data"}
                    </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-date">
                        Date Request:{" "}
                        <span className="account-client-past-promos-form-current-content-date-value">
                      {dataInfluencer ? dataInfluencer.dateRequest : "No Data"}
                    </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-wish">
                        Special Requests:{" "}
                        <span className="account-client-past-promos-form-current-content-wish-value">
                      {dataInfluencer.video ? dataInfluencer.video.specialWishes : "No Data"}
                    </span>
                    </p>
                </div>
            );
        }
    }

    return (
        <section className="account-client-past-promos">
            <div className="container">
                <div className="account-client-past-promos-block" style={{position: "relative"}}>
                    <div className="account-client-past-promos-block-title">
                        <TitleSection title="MY" span="account"/>
                    </div>

                    <p className="account-client-past-promos-second">Past promos</p>

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
                            navigation("/account/influencer/past-promos")
                        }}
                    >
                        <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                    </button>

                    <FormContainer
                        style={{
                            marginTop: "70px",
                            paddingBottom: 0,
                            paddingLeft: 0,
                            paddingRight: 0,
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
                                        src={data ? data.logo : ""}
                                        style={{width: "100%", maxWidth: 300}}
                                        fallbackSrc={altLogo}
                                    />
                                </div>
                                {returnForm()}
                            </div>
                        </div>
                    </FormContainer>

                    <div
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
                            Click here for support
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AcountClientPastPromosCurrent;
