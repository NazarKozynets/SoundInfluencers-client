import React, {useEffect, useState} from "react";
import TitleSection from "../../../../TitleSection";
import FormContainer from "../../../../form/FormContainer";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import UseVerify from "../../../../../hooks/useVerify";
import StandardButton from "../../../../form/StandardButton";
import ImageWithFallback from "../../../../ImageWithFallback";
import altLogo from "../../../../../images/alt-logo.jpg";
import arrow from "../../../../../images/icons/arrow.svg";
import {getSocialMedia} from "../../../../../utils/typeOfSocialAccounts";

const AcountInfluencerOngoingCurrent = () => {
    const params = useParams();
    const navigation = useNavigate();
    const [data, setData] = useState({});
    const [dataInfluencer, setDataInfluencer] = useState({});
    
    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();
            const result = await axios(
                `${process.env.REACT_APP_SERVER}/promos/get-ongoing-promo-one?influencerId=${dataFetch._id}&promoId=${params.id}&instagramUsername=${params.instagram}`
            );

            if (result.data.code === 200) {
                setData(result.data.promo);
                const resultInfluencers = result.data.promo.selectInfluencers.map((influencer) => {
                    if (result.data.promo.videos && influencer.selectedVideo) {
                        const video = result.data.promo.videos.find(videoItem => videoItem.videoLink === influencer.selectedVideo);

                        return {
                            ...influencer,
                            video: video || null,
                            campaignName: result.data.promo.campaignName,
                            socialMedia: result.data.promo.socialMedia,
                            client: result.data.promo.client,
                        };
                    }
                    return influencer;
                });

                const filteredInfluencers = resultInfluencers.filter(influencer => influencer.instagramUsername === params.instagram);

                setDataInfluencer(filteredInfluencers);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    
    const returnPostContent = (item) => {
        if (item?.socialMedia === 'spotify' || item?.socialMedia === 'soundcloud') {
            return (
                <div
                    className="account-client-past-promos-form-current-content"
                    style={{padding: "0 20px 30px 20px"}}
                >
                    <h2 className="account-client-past-promos-form-current-content-title">
                        {item.campaignName ? item.campaignName : "Promo 1"}
                    </h2>
                    <p className="account-client-past-promos-form-current-content-client">
                        {item ? getSocialMedia(item?.socialMedia) : "No Data"}:{" "}
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
                        {getSocialMedia(item?.socialMedia)} Track Link:{" "}
                        <a
                            href={item ? item.video?.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {item ? item.video?.videoLink.slice(0, 15) + "..." : "No Data"}
                        </a>
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
                        {item ? item.video?.specialWishes : "No Data"}
                      </span>
                    </p>
                </div>
            );
        } else if (item?.socialMedia === 'press') {
            return (
                <div
                    className="account-client-past-promos-form-current-content"
                    style={{padding: "0 20px 30px 20px"}}
                >
                    <h2 className="account-client-past-promos-form-current-content-title">
                        {item.campaignName ? item.campaignName : "Promo 1"}
                    </h2>
                    <p className="account-client-past-promos-form-current-content-client">
                        {item ? getSocialMedia(item?.socialMedia) : "No Data"}:{" "}
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
                        Link To Music / Event / News:{" "}
                        <a
                            href={item ? item.video?.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {item ? item.video?.videoLink.slice(0, 10) + "..." : "No Data"}
                        </a>
                    </p>

                    <p className="account-client-past-promos-form-current-content-link">
                        Link To Artwork & Press Shots:{" "}
                        <a
                            href={item ? item.video?.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {item ? item.video?.postDescription.slice(0, 10) + "..." : "No Data"}
                        </a>
                    </p>
                    <p className="account-client-past-promos-form-current-content-link">
                        Link To Press Release:{" "}
                        <a
                            href={item ? item.video?.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {item ? item.video?.storyTag.slice(0, 10) + "..." : "No Data"}
                        </a>
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
                        {item ? item.video?.specialWishes : "No Data"}
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
                        {item?.campaignName ? item.campaignName : "Promo 1"}
                    </h2>
                    <p className="account-client-past-promos-form-current-content-client">
                        {item ? getSocialMedia(item?.socialMedia) : "No Data"}:{" "}
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
                            href={item ? item.video?.videoLink : "No Data"}
                            className="account-client-past-promos-form-current-content-link-value"
                            target="_blank"
                        >
                            {item ? item.video?.videoLink : "No Data"}
                        </a>
                    </p>

                    <p className="account-client-past-promos-form-current-content-desc">
                        Description:{" "}
                        <span
                            className="account-client-past-promos-form-current-content-desc-value">
                        {item ? item.video?.postDescription : "No Data"}
                      </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-desc">
                        Story Link:{" "}
                        <span
                            className="account-client-past-promos-form-current-content-desc-value">
                        {item ? item.video?.swipeUpLink : "No Data"}
                      </span>
                    </p>
                    <p className="account-client-past-promos-form-current-content-desc">
                        Story Tag:{" "}
                        <span
                            className="account-client-past-promos-form-current-content-desc-value">
                        {item ? item.video?.storyTag : "No Data"}
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
                        {item ? item.video?.specialWishes : "No Data"}
                      </span>
                    </p>
                </div>
            );
        }
    };

    return (
        <>
            <section className="account-client-past-promos">
                <div className="container">
                    <div className="account-client-past-promos-block" style={{position: 'relative'}}>
                        <div className="account-client-past-promos-block-title">
                            <TitleSection title="MY" span="account"/>
                        </div>

                        <p className="account-client-past-promos-second">Ongoing promos</p>

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
                                navigation("/account/influencer/ongoing-promos")
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
                                    {returnPostContent(dataInfluencer[0])}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginBottom: 30,
                                    }}
                                >
                                    <StandardButton
                                        text="Submit Results & Get Paid"
                                        style={{padding: "9px 70px", width: window.innerWidth < 768 ? 300 : ""}}
                                        onClick={() => {
                                            navigation(
                                                `/account/influencer/update-ongoing-promos/${data._id}/${dataInfluencer[0].influencerId}/${params.instagram}`
                                            );
                                        }}
                                    />
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
        </>
    );
};

export default AcountInfluencerOngoingCurrent;
