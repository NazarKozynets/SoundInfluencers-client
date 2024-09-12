import React, {useEffect, useState} from "react";
import TitleSection from "../../../TitleSection";
import {useTable} from "react-table";
import {Form, useParams} from "react-router-dom";
import axios, {get} from "axios";
import UseVerify from "../../../../hooks/useVerify";
import {
    extractNumber, formatDateString, formatDateStringReport,
} from "../../../../utils/validations";

import {useNavigate} from "react-router-dom";
import arrow from "../../../../images/icons/arrow.svg";
import TextInput from "../../../form/TextInput";
import StandardButton from "../../../form/StandardButton";
import {setClearCampaignDetails, setClearForm, setCurrentWindow} from "../../../../redux/slice/create-promo";
import FormContainer from "../../../form/FormContainer";
import ModalWindow from "../../../ModalWindow";
import acceptIcon from "../../../../images/icons/accept.svg";

const ReportCampaigns = () => {
    const params = useParams();

    const [company, setCompany] = useState({});
    const [dataPromo, setDataPromo] = useState(null);
    const [data, setData] = useState([{
        name: "Techno TV",
        score: "181000",
        brand: "Madrid Show",
        datePost: "1-7 April",
        caption: "@pegg...",
        video: "https:/driv...",
        swipeUpLink: "https:/link...",
        storyTag: "@circol...",
        postLink: "https:/ww...",
        screenshot: "https:/drive.g...",
        impressions: "5388",
        like: "46",
    },]);
    const [valueForSendingInvoiceWithoutPONumber, setValueForSendingInvoiceWithoutPONumber] = useState("");
    const [valueForSendingInvoiceWithPONumber, setValueForSendingInvoiceWithPONumber] = useState("");
    const [valueForPONumber, setValueForPONumber] = useState("");
    const [poNumber, setPoNumber] = useState("");
    const [isPopup, setIsPopup] = useState(false);

    const navigation = useNavigate();
    
    const [headers] = useState([{
        Header: "Date Post", accessor: "Date Post",
    }, {
        Header: "Video", accessor: "Video",
    }, {
        Header: "Post Description", accessor: "Post Description",
    }, {
        Header: "Story Tag", accessor: "Story Tag",
    }, {
        Header: "Story Link", accessor: "Story Link",
    }, {
        Header: "Post Link", accessor: "Post Link",
    }, {
        Header: "Screenshot", accessor: "Screenshot",
    }, {
        Header: "Impressions", accessor: "Impressions",
    }, {
        Header: "Likes", accessor: "Likes",
    }
    ]);

    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();
            const result = await axios(`${process.env.REACT_APP_SERVER}/promos/ongoing/one?id=${params.id}&userId=${dataFetch._id}`);
            console.log(result.data.promo);
            setCompany(dataFetch);
            if (result.data.code === 200) {
                console.log(result.data.promo, 'promo data')
                setDataPromo(result.data.promo);
                console.log(result.data.promo.selectInfluencers, 'influencers data')
                setData(result.data.promo.selectInfluencers);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const totalFollowers = () => {
        const total = data.reduce((prev, current) => {
            return prev + extractNumber(current.followersNumber);
        }, 0);

        return total;
    };

    const totalImpressions = () => {
        const total = data.reduce((prev, current) => {
            return prev + extractNumber(current.impressions);
        }, 0);

        return total;
    };

    const totalLikes = () => {
        const total = data.reduce((prev, current) => {
            return prev + extractNumber(current.like);
        }, 0);

        return total;
    };

    const navigator = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const createTransferForSendingInvoiceWithoutPO = async () => {
        const promoId = dataPromo?._id;
        try {
            const {dataFetch} = await UseVerify();
            if (!promoId) {
                console.error('promoId is not set');
                return;
            }
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/promos/update-estimate?isPoNeed=false`,
                null,
                {
                    params: {
                        promoId: promoId,
                    }
                }
            );
            if (result.data.status === 200) {
                const result = await axios.post(
                    `${process.env.REACT_APP_SERVER}/payment/create-order-tranfer`,
                    {
                        nameProduct: `Offers ${dataPromo.selectPrice.variant}`,
                        userId: dataFetch._id,
                        amount: dataPromo.selectPrice.price,
                        emailForSendingInvoice: valueForSendingInvoiceWithoutPONumber,
                    }
                );
                setIsPopup(true);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const createTransferForSendingInvoiceWithPO = async () => {
        try {
            const promoId = dataPromo?._id;
            const {dataFetch} = await UseVerify();
            if (!promoId) {
                console.error('promoId is not set');
                return;
            }
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/promos/update-estimate?isPoNeed=true`,
                null,
                {
                    params: {
                        promoId: promoId,
                    }
                }
            );
            if (result.data.status === 200) {
                const result = await axios.post(
                    `${process.env.REACT_APP_SERVER}/payment/create-order-tranfer`,
                    {
                        nameProduct: `Offers ${dataPromo.selectPrice.variant}`,
                        userId: dataFetch._id,
                        amount: dataPromo.selectPrice.price,
                        emailForSendingInvoice: valueForSendingInvoiceWithPONumber,
                        poNumber: valueForPONumber,
                    }
                );
                setIsPopup(true);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="report">
            {dataPromo?.paymentType === "PO request" && (dataPromo?.statusPromo === 'PO waiting' || dataPromo?.statusPromo === 'estimate') && (
                <div className='report-po-form'>
                    <button
                        style={{
                            position: "absolute", top: '22%', left: '18%', width: 50, height: 50, cursor: "pointer",
                        }}
                        onClick={() => {
                            navigator("/account/client/ongoing-promos");
                        }}
                    >
                        <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <FormContainer style={{padding: '30px 0 20px 0'}}>
                        <div>
                            <TitleSection title='PO' span='request'/>
                        </div>
                        <div className="account-client-payment-po">
                            <div className="account-client-payment-po-container">
                                <div className="account-client-payment-po-container-first">
                                    <span>#1</span>
                                    <p>SEND ORDER DETAILS TO: </p>
                                    <TextInput
                                        placeholder="Enter email"
                                        style={{marginTop: 10}}
                                        value={valueForSendingInvoiceWithoutPONumber}
                                        formError={false}
                                        setValue={setValueForSendingInvoiceWithoutPONumber}
                                        silverColor={true}
                                    />
                                    <StandardButton
                                        onClick={() => {
                                            if (valueForSendingInvoiceWithoutPONumber !== "") {
                                                createTransferForSendingInvoiceWithoutPO();
                                                getData();
                                            }
                                        }}
                                        style={{
                                            width: 102,
                                            height: 48,
                                            fontFamily: "Geometria",
                                            fontSize: "18px",
                                            marginTop: '13px',
                                            fontWeight: "700",
                                        }} text="SEND"/>
                                </div>
                                <div className="account-client-payment-po-container-first">
                                    <span>#2</span>
                                    <p>ADD PO NUMBER HERE: </p>
                                    <TextInput
                                        placeholder="Enter PO Number"
                                        style={{marginTop: 10, marginLeft: 16}}
                                        value={valueForPONumber}
                                        formError={false}
                                        setValue={setValueForPONumber}
                                        silverColor={true}
                                    />
                                    <StandardButton
                                        onClick={() => {
                                            setPoNumber(valueForPONumber);
                                        }}
                                        style={{
                                            width: 102,
                                            height: 48,
                                            fontFamily: "Geometria",
                                            fontSize: "18px",
                                            marginTop: '13px',
                                            fontWeight: "700",
                                        }} text="Add"/>
                                </div>
                                <div className="account-client-payment-po-container-first">
                                    <span>#3</span>
                                    <p>SEND ORDER DETAILS WITH PO TO: </p>
                                    <TextInput
                                        placeholder="Enter email"
                                        style={{marginTop: 10, width: 205}}
                                        value={valueForSendingInvoiceWithPONumber}
                                        formError={false}
                                        setValue={setValueForSendingInvoiceWithPONumber}
                                        silverColor={true}
                                    />
                                    <StandardButton
                                        onClick={() => {
                                            if (poNumber !== "" && valueForSendingInvoiceWithPONumber !== "") {
                                                createTransferForSendingInvoiceWithPO();
                                                getData();
                                            }
                                        }}
                                        style={{
                                            width: 102,
                                            height: 48,
                                            fontFamily: "Geometria",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            marginTop: '13px'
                                        }} text="SEND"/>
                                </div>
                            </div>
                        </div>
                        <div className="button-container"
                             style={{
                                 display: 'flex', justifyContent: 'center', marginTop: '57px'
                             }}>
                            <StandardButton
                                onClick={() => {
                                    // setIsPoRequestNeed(false);
                                    // setTranfertCurrent("");
                                    // dispatch(setClearForm());
                                    // dispatch(setClearCampaignDetails());
                                    // dispatch(setCurrentWindow(0));
                                    // navigation('/');
                                }}
                                text="Confirm Process Completed"
                                style={{
                                    width: 400,
                                    height: 40,
                                    fontFamily: "Geometria",
                                    fontSize: "22px",
                                    fontWeight: "700",
                                    marginBottom: 20,
                                }}
                            />
                        </div>
                    </FormContainer>
                </div>
            )}

            <div style={{position: "relative"}}>
                <div className="report-campaign-strategy-title">
                    <button
                        style={{
                            position: "absolute", top: '0%', left: '15%', width: 50, height: 50, cursor: "pointer",
                        }}
                        onClick={() => {
                            navigator("/account/client/ongoing-promos");
                        }}
                    >
                        <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title="Report" span="of the campaign"/>
                    <p>{dataPromo?.campaignName}</p>
                </div>

                <div className="report-details">
                    <div className="report-details-first">
                        <p>Date: <span>{new Date(dataPromo?.createdAt).toLocaleDateString('en-GB')}</span></p>
                        <p>Price: <span>{dataPromo?.amount}{dataPromo?.currency}</span></p>
                    </div>
                    <div className="report-details-second">
                        <p>Combined Followers: <span>{totalFollowers()}</span></p>
                        <p>Posts & Stories: <span>{dataPromo?.selectInfluencers.length}</span></p>
                    </div>
                    <div className="report-details-third">
                        <p>Video Options: <span>{dataPromo?.videos.length}</span></p>
                    </div>
                </div>

                <table className="report-table">
                    <thead className="report-table-header">
                    <tr>
                        <td></td>
                        <td className="report-table-header-item">Total Followers</td>
                        {headers.map((head) => (<td className="report-table-header-item">{head.Header}</td>))}
                    </tr>
                    </thead>
                    <tbody className="report-table-body">
                    {dataPromo ? (<>
                        {data.map((item, indexRow) => (<tr className="report-table-body-row">
                            <td className="report-table-body-row-item-first">
                                {item.instagramUsername ? item.instagramUsername : ""}
                            </td>
                            <td className="report-table-body-row-item">
                                {item.followersNumber ? item.followersNumber : ""}
                            </td>
                            <td className="report-table-body-row-item-second">
                                {dataPromo.createdAt ? formatDateStringReport(dataPromo.createdAt) : ""}
                            </td>
                            <td className="report-table-body-row-item">
                            </td>
                            <td className="report-table-body-row-item-second">
                            </td>
                            <td className="report-table-body-row-item">
                                
                            </td>
                            <td className="report-table-body-row-item-second">
                                
                            </td>
                            <td className="report-table-body-row-item">
                                
                            </td>
                            <td className="report-table-body-row-item-second">
                                {item.screenshot ? (<a target="_blank"
                                                       href={item.screenshot.toString().replace('dl.dropboxusercontent.com', 'www.dropbox.com')}>
                                    {item.screenshot.toString().replace('dl.dropboxusercontent.com', 'www.dropbox.com')}
                                </a>) : ("")}
                            </td>
                            <td className="report-table-body-row-item">
                                {item.impressions ? item.impressions : ""}
                            </td>
                            <td className="report-table-body-row-item-second">
                                {item.like ? item.like : ""}
                            </td>
                        </tr>))}
                    </>) : null}
                    <tr className="report-table-body-total">
                        <td className="report-table-body-total-price">
                            TOTAL: {dataPromo ? dataPromo.selectPrice.price : 0}€
                        </td>

                        <td className="report-table-body-total-row-item"></td>
                        <td className="report-table-body-total-row-item-second"></td>
                        <td className="report-table-body-total-row-item"></td>
                        <td className="report-table-body-total-row-item-second"></td>
                        <td className="report-table-body-total-row-item"></td>
                        <td className="report-table-body-total-row-item-second"></td>
                        <td className="report-table-body-total-row-item"></td>
                        <td className="report-table-body-total-row-item-second"></td>
                        <td className="report-table-body-total-row-item" style={{
                            fontFamily: "Geometria",
                            fontSize: "16px",
                            fontWeight: 800,
                            textAlign: "center",
                        }}>{totalImpressions()}</td>
                        <td className="report-table-body-total-row-item-second" style={{
                            fontFamily: "Geometria",
                            fontSize: "16px",
                            fontWeight: 800,
                            textAlign: "center",
                        }}>{totalLikes()}</td>
                    </tr>
                    </tbody>
                </table>

                <div className="report-mobile">
                    {dataPromo ? (<>
                        {" "}
                        {data.map((item) => (<div className="report-mobile-item">
                            <div className="report-mobile-item-influencer">
                                {item.instagramUsername ? item.instagramUsername : ""}
                            </div>
                            <div className="report-mobile-item-info">
                                <p className="report-mobile-item-info-followers">
                                    {" "}
                                    {item.followersNumber ? item.followersNumber : ""}
                                </p>
                                <div className="report-mobile-item-info-brand">
                                    <p className="report-mobile-item-info-value">
                                        {" "}
                                        {dataPromo.brand ? dataPromo.brand : ""}
                                    </p>
                                    <p className="report-mobile-item-info-title">Brand</p>
                                </div>
                                <div className="report-mobile-item-info-date-post">
                                    <p className="report-mobile-item-info-value">
                                        {" "}
                                        {dataPromo.createdAt ? formatDateStringReport(dataPromo.createdAt) : ""}
                                    </p>
                                    <p className="report-mobile-item-info-title">
                                        Date Post
                                    </p>
                                </div>
                                <div className="report-mobile-item-info-caption">
                                    <p className="report-mobile-item-info-value">
                                        {" "}
                                        {dataPromo.postDescription ? dataPromo.postDescription : ""}
                                    </p>
                                    <p className="report-mobile-item-info-title">Caption</p>
                                </div>
                                <div className="report-mobile-item-info-video">
                                    <a
                                        target="_blank"
                                        className="report-mobile-item-info-value"
                                        href={dataPromo.videoLink ? dataPromo.videoLink : ""}
                                    >
                                        {" "}
                                        {dataPromo.videoLink ? dataPromo.videoLink : ""}
                                    </a>

                                    <p className="report-mobile-item-info-title">Video</p>
                                </div>
                                <div className="report-mobile-item-info-swipe-up-link">
                                    <a
                                        target="_blank"
                                        className="report-mobile-item-info-value"
                                        href={dataPromo.swipeUpLink ? dataPromo.swipeUpLink : ""}
                                    >
                                        {dataPromo.swipeUpLink ? dataPromo.swipeUpLink : ""}
                                    </a>
                                    <p className="report-mobile-item-info-title">
                                        Swipe Up Link
                                    </p>
                                </div>
                                <div className="report-mobile-item-info-story-tag">
                                    <p className="report-mobile-item-info-value">
                                        {" "}
                                        {dataPromo.storyTag ? dataPromo.storyTag : ""}
                                    </p>
                                    <p className="report-mobile-item-info-title">
                                        Story Tag
                                    </p>
                                </div>
                                <div className="report-mobile-item-info-post-link">
                                    <a
                                        target="_blank"
                                        className="report-mobile-item-info-value"
                                        href={item.postLink ? item.postLink : ""}
                                    >
                                        {" "}
                                        {item.postLink ? item.postLink : ""}
                                    </a>
                                    <p className="report-mobile-item-info-title">
                                        Post Link
                                    </p>
                                </div>
                                <div className="report-mobile-item-info-screenshot">
                                    <a
                                        target="_blank"
                                        className="report-mobile-item-info-value"
                                        href={item.screenshot ? item.screenshot : ""}
                                    >
                                        {" "}
                                        {item.screenshot ? item.screenshot : ""}
                                    </a>
                                    <p className="report-mobile-item-info-title">
                                        Screenshot In
                                    </p>
                                </div>
                                <div className="report-mobile-item-info-impressions">
                                    <p className="report-mobile-item-info-value">
                                        {" "}
                                        {item.impressions ? item.impressions : ""}
                                    </p>
                                    <p className="report-mobile-item-info-title">
                                        Impressions
                                    </p>
                                </div>
                                <div className="report-mobile-item-info-like">
                                    <p className="report-mobile-item-info-value">
                                        {" "}
                                        {item.like ? item.like : ""}
                                    </p>
                                    <p className="report-mobile-item-info-title">Likes</p>
                                </div>
                            </div>
                        </div>))}
                    </>) : null}
                    <div
                        className="report-mobile-item"
                        style={{background: "#FF7A09"}}
                    >
                        <p className="report-mobile-item-total">
                            TOTAL Posts: {data.length}
                        </p>
                    </div>
                    <div
                        className="report-mobile-item"
                        style={{background: "#FF7A09"}}
                    >
                        <p className="report-mobile-item-total">
                            TOTAL Stories: {data.length}
                        </p>
                    </div>
                    <div
                        className="report-mobile-item"
                        style={{background: "#FF7A09"}}
                    >
                        <p className="report-mobile-item-total">
                            TOTAL Impressions: {totalImpressions()}
                        </p>
                    </div>
                    <div
                        className="report-mobile-item"
                        style={{background: "#FF7A09"}}
                    >
                        <p className="report-mobile-item-total">
                            TOTAL Likes: {totalLikes()}
                        </p>
                    </div>
                    {" "}
                    <div
                        className="report-mobile-item"
                        style={{background: "#FF7A09"}}
                    >
                        <p className="report-mobile-item-total">
                            TOTAL Followers: {totalFollowers()}
                        </p>
                    </div>
                    {" "}
                    <div
                        className="report-mobile-item"
                        style={{background: "#FF7A09"}}
                    >
                        <p className="report-mobile-item-total">
                            TOTAL: {dataPromo ? dataPromo.selectPrice.price : 0}€
                        </p>
                    </div>
                </div>
            </div>
            <ModalWindow isOpen={isPopup} setClose={setIsPopup}>
                <div className="signup-client-modal">
                    <img className="signup-client-modal-icon" src={acceptIcon} />

                    <h2 className="signup-client-modal-title">Congratulations!</h2>

                    <p className="signup-client-modal-second">
                        You can now check the status of your Promotion request in the{" "}
                        <button
                            className="signup-client-modal-second"
                            style={{
                                color: "#3330E4",
                                textDecorationLine: "underline",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setClearForm();
                                setCurrentWindow(0);
                                navigation("/account/client/ongoing-promos")
                            }}
                        >
                            "Ongoing Promo"
                        </button>
                    </p>

                    <StandardButton
                        text="Ok"
                        style={{
                            padding: "8px 80px",
                            marginTop: "30px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                        onClick={() => {
                            setIsPopup(false);
                        }}
                    />
                </div>
            </ModalWindow>
        </section>
    );
};

export default ReportCampaigns;
