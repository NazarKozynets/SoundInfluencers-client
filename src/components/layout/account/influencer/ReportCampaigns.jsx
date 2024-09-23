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
import imgIcon from "../../../../images/icons/iconsForCampaignReport/image- 1.svg";
import instaIcon from "../../../../images/icons/iconsForCampaignReport/instagram 1.svg";
import linkIcon from "../../../../images/icons/iconsForCampaignReport/link 1.svg";
import videoIcon from "../../../../images/icons/iconsForCampaignReport/video 1.svg";

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

    const [cpmObj, setCpmObj] = useState({
        cpm: 0,
        avgCpm: '',
        result: '',
    });

    useEffect(() => {
        editCPMO();
    }, [dataPromo])

    const editCPMO = () => {
        if (dataPromo?.selectInfluencers?.find(influencer => influencer.impressions > 0)) {
            const cpm = dataPromo?.selectPrice.price / totalImpressions() * 1000;
            let avgCpm;

            if (cpm < 3) {
                avgCpm = '0 to 3€';
            } else if (cpm < 5) {
                avgCpm = '3€ to 5€';
            } else if (cpm < 9) {
                avgCpm = '5€ to 9€';
            } else if (cpm < 12) {
                avgCpm = '9€ to 12€';
            } else {
                avgCpm = '>12€';
            }

            let result;
            if (avgCpm === '0 to 3€') {
                result = 'Excellent';
            } else if (avgCpm === '3€ to 5€') {
                result = 'Highly Above Average';
            } else if (avgCpm === '5€ to 9€') {
                result = 'Above Average';
            } else if (avgCpm === '9€ to 12€') {
                result = 'Average';
            } else if (avgCpm === '> 12€') {
                result = 'Below Average';
            } else {
                result = 'Poor';
            }

            setCpmObj({
                cpm,
                avgCpm,
                result,
            });
        }
    }

    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();
            const result = await axios(
                `${process.env.REACT_APP_SERVER}/promos/ongoing/one?id=${params.id}&userId=${dataFetch._id}`
            );
            setCompany(dataFetch);

            if (result.data.code === 200) {
                setDataPromo(result.data.promo);

                const resultInfluencers = result.data.promo.selectInfluencers.map((influencer) => {
                    if (result.data.promo.videos && influencer.selectedVideo) {
                        const video = result.data.promo.videos.find(videoItem => videoItem.videoLink === influencer.selectedVideo);

                        return {
                            ...influencer,
                            video: video || null
                        };
                    }
                    return influencer;
                });

                setData(resultInfluencers);
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
            {dataPromo?.paymentType === "PO request" && (dataPromo?.statusPromo === 'po waiting' || dataPromo?.statusPromo === 'estimate') && (
                <div className='report-po-form'>
                    <button
                        style={{
                            position: "absolute",
                            top: '22%',
                            left: '18%',
                            display: window.innerWidth > 768 ? '' : "none",
                            width: 50,
                            height: 50,
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            navigator("/account/client/ongoing-promos");
                        }}
                    >
                        <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <FormContainer style={{padding: '30px 0 20px 0', marginTop: window.innerWidth > 768 ? '' : '40px'}}>
                        <div className="report-po-form-title">
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
                                        style={{marginTop: 10}}
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
                                    width: 300,
                                    height: 60,
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
                <div className="report-campaign-strategy-title"
                     style={{marginTop: (dataPromo?.statusPromo === 'po waiting' || dataPromo?.statusPromo === 'estimate') ? '100px' : '0'}}>
                    {(dataPromo?.statusPromo !== 'po waiting' && dataPromo?.statusPromo !== 'estimate') && window.innerWidth > 768 && (
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
                    )}
                    <TitleSection title="Report" span="of the campaign"/>
                    <p>{dataPromo?.campaignName}</p>
                </div>

                <div className="report-details">
                    <div className="report-details-first">
                        <p>Date Submitted: <span>{new Date(dataPromo?.createdAt).toLocaleDateString('en-GB')}</span></p>
                        <p>Price: <span>{dataPromo?.amount}{dataPromo?.currency}</span></p>
                        <p>Posts & Stories: <span>{dataPromo?.selectInfluencers.length}</span></p>
                    </div>
                    <div className="report-details-second">
                        <p>Combined Followers: <span>{totalFollowers()}</span></p>
                        <p>Impressions: <span>{totalImpressions()}</span></p>
                        <p>Likes: <span>{totalLikes()}</span></p>
                    </div>
                    <div className="report-details-third">
                        <p>CPM: <span>{cpmObj.cpm.toFixed(2)}€</span></p>
                        <p>Average Instagram CPM: <span>9€ to 12€</span></p>
                        <p>Result: <span>{cpmObj.result}</span></p>
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
                                {item.instagramUsername ? item.instagramUsername : "N/A"}
                            </td>
                            <td className="report-table-body-row-item" style={{width: '8%'}}>
                                {item.followersNumber ? item.followersNumber : "N/A"}
                            </td>
                            <td className="report-table-body-row-item-second">
                                {item.dateRequest ? item.dateRequest : "N/A"}
                            </td>
                            <td className="report-table-body-row-item" style={{width: 74}}>
                                <button
                                    onClick={() => {
                                        window.open(item.video.videoLink, '_blank');
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: 52,
                                        height: 28,
                                        borderRadius: "10px",
                                        paddingLeft: 3,
                                        paddingRight: 3,
                                        border: "2px solid black",
                                        boxSizing: 'border-box',
                                        margin: '0 auto',
                                        cursor: 'pointer',
                                    }}>
                                    <img src={videoIcon} alt="watch"/>
                                    <img src={linkIcon} alt="edit"/>
                                </button>
                            </td>
                            <td className="report-table-body-row-item-second" style={{width: '10%'}}>
                                {item.video ? item.video.postDescription : "N/A"}
                            </td>
                            <td className="report-table-body-row-item" style={{width: '10%'}}>
                                {item.video ? item.video.storyTag : "N/A"}
                            </td>
                            <td className="report-table-body-row-item-second" style={{width: '7%'}}>
                                {item.video.swipeUpLink ? (
                                    <a href={
                                        'https://' + item.video.swipeUpLink
                                    } target="_blank" rel="noopener noreferrer" title={item.video.swipeUpLink}>
                                        {item.video.swipeUpLink.slice(0, 10) + '...'}
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </td>
                            <td className="report-table-body-row-item" style={{width: 90}}>
                                {item.postLink ? <button
                                    onClick={() => {
                                        window.open(item.postLink, '_blank');
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: 52,
                                        height: 28,
                                        borderRadius: "10px",
                                        paddingLeft: 3,
                                        paddingRight: 3,
                                        border: "2px solid black",
                                        boxSizing: 'border-box',
                                        margin: '0 auto',
                                        cursor: 'pointer',
                                    }}>
                                    <img src={instaIcon} alt="watch"/>
                                    <img src={linkIcon} alt="edit"/>
                                </button> : "N/A"}
                            </td>
                            <td className="report-table-body-row-item-second" style={{width: 90}}>
                                {item.screenshot ? <button
                                    onClick={() => {
                                        window.open(item.screenshot, '_blank');
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: 52,
                                        height: 28,
                                        borderRadius: "10px",
                                        paddingLeft: 3,
                                        paddingRight: 3,
                                        border: "2px solid black",
                                        boxSizing: 'border-box',
                                        margin: '0 auto',
                                        cursor: 'pointer',
                                    }}>
                                    <img src={imgIcon} alt="watch"/>
                                    <img src={linkIcon} alt="edit"/>
                                </button> : "N/A"}
                            </td>
                            <td className="report-table-body-row-item" style={{width: '8%'}}>
                                {item.impressions ? item.impressions : "N/A"}
                            </td>
                            <td className="report-table-body-row-item-second">
                                {item.like ? item.like : "N/A"}
                            </td>
                        </tr>))}
                    </>) : null}
                    <tr className="report-table-body-total">
                        <td className="report-table-body-total-price">
                            TOTAL: {dataPromo ? dataPromo.selectPrice.price : 0}€
                        </td>

                        <td className="report-table-body-total-row-item" style={{
                            fontFamily: "Geometria",
                            fontSize: "16px",
                            fontWeight: 800,
                            textAlign: "center",
                        }}>
                            {totalFollowers()}
                        </td>
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
                    {dataPromo && (
                        data.map((item, indexRow) => (
                            <div className="report-mobile-item">
                                <div className="report-mobile-item-first">
                                    <p>{item.instagramUsername}</p>
                                </div>
                                <div className="report-mobile-item-second">
                                    <div className="report-mobile-item-second-item">
                                        <span>{item.followersNumber}</span>
                                        <p>Total Followers</p>
                                    </div>
                                    <div className="report-mobile-item-second-item">
                                        <span>{item.dateRequest ? item.dateRequest : "N/A"}</span>
                                        <p>Date Post</p>
                                    </div>
                                    <div className="report-mobile-item-second-item">
                                        <span>{item.selectedVideo ? item.selectedVideo : 'N/A'}</span>
                                        <p>Video</p>
                                    </div>
                                    <div className="report-mobile-item-second-item">
                                        <span>{item.video.postDescription ? item.video.postDescription.slice(0, 15) + '...' : 'N/A'}</span>
                                        <p>Description</p>
                                    </div>
                                    <div className="report-mobile-item-second-item">
                                        <span>{item.video ? item.video.storyTag : "N/A"}</span>
                                        <p>Story Tag</p>
                                    </div>
                                    <div className="report-mobile-item-second-item">
                                        <span>{item.video.swipeUpLink ? (
                                            <a href={
                                                'https://' + item.video.swipeUpLink
                                            } target="_blank" rel="noopener noreferrer" title={item.video.swipeUpLink}>
                                                {item.video.swipeUpLink.slice(0, 10) + '...'}
                                            </a>
                                        ) : (
                                            "N/A"
                                        )}
                                        </span>
                                        <p>Story Link</p>
                                    </div>
                                    <div className="report-mobile-item-second-item">
                                        <span>
                                            {item.postLink ? <button
                                                onClick={() => {
                                                    window.open(item.postLink, '_blank');
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: 52,
                                                    height: 28,
                                                    borderRadius: "10px",
                                                    paddingLeft: 3,
                                                    paddingRight: 3,
                                                    border: "2px solid black",
                                                    boxSizing: 'border-box',
                                                    margin: '0 auto',
                                                    cursor: 'pointer',
                                                }}>
                                                <img src={instaIcon} alt="watch"/>
                                                <img src={linkIcon} alt="edit"/>
                                            </button> : "N/A"}
                                        </span>
                                        <p>Post Link</p>
                                    </div>
                                    <div className="report-mobile-item-second-item">
                                        <span>
                                            {item.screenshot ? <button
                                                onClick={() => {
                                                    window.open(item.screenshot, '_blank');
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: 52,
                                                    height: 28,
                                                    borderRadius: "10px",
                                                    paddingLeft: 3,
                                                    paddingRight: 3,
                                                    border: "2px solid black",
                                                    boxSizing: 'border-box',
                                                    margin: '0 auto',
                                                    cursor: 'pointer',
                                                }}>
                                                <img src={imgIcon} alt="watch"/>
                                                <img src={linkIcon} alt="edit"/>
                                            </button> : "N/A"}
                                        </span>
                                        <p>Screenshot</p>
                                    </div>  
                                    <div className="report-mobile-item-second-item">
                                        <span>{item.impressions ? item.impressions : 'N/A'}</span>
                                        <p>Impressions</p>
                                    </div>  
                                    <div className="report-mobile-item-second-item">
                                        <span>{item.like ? item.like : 'N/A'}</span>
                                        <p>Likes</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <ModalWindow isOpen={isPopup} setClose={setIsPopup}>
                <div className="signup-client-modal">
                    <img className="signup-client-modal-icon" src={acceptIcon}/>

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
