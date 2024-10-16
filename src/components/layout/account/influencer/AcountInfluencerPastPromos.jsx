import React, {useEffect, useState} from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import AltButton from "../../../form/AltButton";
import UseVerify from "../../../../hooks/useVerify";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import arrow from "../../../../images/icons/arrow.svg";
import instagram from "../../../../images/icons/socialMedias/instagram.png";

function formatDate(inputDate) {
    const date = new Date(inputDate);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    const formattedDate = `${formattedDay}.${formattedMonth}.${year}`;

    return formattedDate;
}

const AccountInfluencerPastPromos = () => {
    const navigation = useNavigate();
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();
            const result = await axios(
                `${process.env.REACT_APP_SERVER}/promos/history-influencer?id=${dataFetch._id}`
            );
            if (result.data.code === 200) {
                setData(result.data.promos);
            }
        } catch (err) {
            console.log(err);
        }
    };

    function getBackgroundColor(statusPromo) {
        switch (statusPromo) {
            case "wait":
                return "#FF7A09";
            case "estimate":
                return "#FF3509";
            case "work":
                return "#3330E4";
            case "po waiting":
                return "#17A937";
            default:
                return "#3330E41A";
        }
    }

    const returnStatus = (statusPromo) => {
        if (statusPromo === "wait") {
            return "pending";
        } else if (statusPromo === "work") {
            return "distributing";
        } else if (statusPromo === "estimate") {
            return "estimating";
        } else if (statusPromo === "po waiting") {
            return "po waiting";
        } else {
            return "confirmed";
        }
    };
    
    useEffect(() => {
        getData();
    }, []);
    return (
        <section className="account-client-past-promos">
            <div className="container-form">
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


                    <p className="account-client-past-promos-second">Past promos</p>

                    <FormContainer
                        style={{
                            marginTop: "70px",
                            display: data.length !== 0 ? "block" : "none",
                        }}
                    >
                        <div className="account-client-past-promos-form">
                            <ul className="account-client-past-promos-form-list">
                                {data.map((item, index) => (
                                    <li
                                        className="account-client-past-promos-form-item"
                                        key={item._id}
                                    >
                                        <div>
                                            <button
                                                onClick={() => navigation(`/account/influencer/past-promos/${item._id}`)}
                                                className="account-client-past-promos-form-item-button">
                                                <div
                                                    className="account-client-past-promos-form-item-button-inner-content">
                                                    <img src={instagram} alt={"inst"}/>
                                                    <p>{item?.campaignName?.length > 10 ? `${item.campaignName.slice(0, 10)}...` : item.campaignName}</p>
                                                </div>
                                                <span
                                                    style={{background: getBackgroundColor(item.statusPromo)}}>{returnStatus(item.statusPromo)}</span>
                                            </button>
                                        </div>
                                        <p style={{
                                            fontFamily: "Geometria",
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            color: "#00000080",
                                        }}>{formatDate(item.createdAt)}</p>
                                        <p className="account-client-past-promos-form-text">
                                            Promo {index + 1}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            {/* {data.length > 20 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "45px",
                  }}
                >
                  <AltButton text="See more" />
                </div>
              )} */}
                        </div>
                    </FormContainer>
                </div>
            </div>
        </section>
    );
};

export default AccountInfluencerPastPromos;
