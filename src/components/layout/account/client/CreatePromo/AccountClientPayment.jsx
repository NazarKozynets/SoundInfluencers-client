import React, {useEffect, useState} from "react";
import TitleSection from "../../../../TitleSection";
import paypal from "../../../../../images/icons/paypal.svg";
import mastercard from "../../../../../images/icons/company/mastercard.svg";
import visa from "../../../../../images/icons/company/visa.svg";
import discover from "../../../../../images/icons/company/discover.svg";
import american from "../../../../../images/icons/company/american.svg";
import jcb from "../../../../../images/icons/company/jcb.svg";
import unionPay from "../../../../../images/icons/company/union-pay.svg";
import ModalWindow from "../../../../ModalWindow";
import visaBank from "../../../../../images/icons/visa-bank.svg";
import StandardButton from "../../../../form/StandardButton";
import PaypalButton from "../../../../Payment/PaypalButton";
import {useDispatch, useSelector} from "react-redux";
import UseVerify from "../../../../../hooks/useVerify";
import axios from "axios";
import {
    setCampaignName, setClearCampaignDetails,
    setClearForm,
    setCurrentWindow, setPaymentType,
} from "../../../../../redux/slice/create-promo";
import {useNavigate} from "react-router-dom";

import arrow from "../../../../../images/icons/arrow.svg";
import TextInput from "../../../../form/TextInput";
import acceptIcon from "../../../../../images/icons/accept.svg";
import paypalLogo from "../../../../../images/icons/company/paypal-seeklogo.com 1.svg"

const AccountClientPayment = () => {
    const [data, setData] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenTransfer, setIsOpenTranfer] = useState(false);
    const [isOpenTransferPaypal, setIsOpenTranferPaypal] = useState(false);
    const [isOpenTransferCard, setIsOpenTranferCard] = useState(false);
    const [isPoRequestNeed, setIsPoRequestNeed] = useState(false);
    const [transferCurrent, setTranfertCurrent] = useState("");
    const [valueForSendingInvoiceWithoutPONumber, setValueForSendingInvoiceWithoutPONumber] = useState("");
    const [valueForSendingInvoiceWithPONumber, setValueForSendingInvoiceWithPONumber] = useState("");
    const [valueForPONumber, setValueForPONumber] = useState("");
    const [poNumber, setPoNumber] = useState("");
    const [promoId, setPromoId] = useState(null);
    const [isPopup, setIsPopup] = useState(false);

    const navigation = useNavigate();

    const dispatch = useDispatch();

    const dataPromo = useSelector((state) => state.createPromo.data);

    const createPromo = async () => {
        try {
            const {dataFetch} = await UseVerify();
            const result = await axios.post(
                `${process.env.REACT_APP_SERVER}/promos`,
                {...dataPromo, userId: dataFetch._id}
            );

            if (result.data.code === 201) {
                const result = await axios.post(
                    `${process.env.REACT_APP_SERVER}/payment/create-order-stripe`,
                    {
                        nameProduct: `Offers ${dataPromo.selectPrice.variant}`,
                        userId: dataFetch._id,
                        amount: dataPromo.selectPrice.price,
                    }
                );
                if (result.data.code === 201) {
                    document.location.href = result.data.paymentUrl;
                    window.sessionStorage.setItem("isPopup", 1);
                }
                dispatch(setClearForm());
                dispatch(setCurrentWindow(0));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const createPromoTranfer = async () => {
        try {
            const {dataFetch} = await UseVerify();
            const paymentType = checkWhatTypeOfPayment();
            const result = await axios.post(
                `${process.env.REACT_APP_SERVER}/promos`,
                {...dataPromo, userId: dataFetch._id, paymentType: paymentType}
            );

            if (result.data.code === 201) {
                const result = await axios.post(
                    `${process.env.REACT_APP_SERVER}/payment/create-order-tranfer`,
                    {
                        nameProduct: `Offers ${dataPromo.selectPrice.variant}`,
                        userId: dataFetch._id,
                        amount: dataPromo.selectPrice.price,
                        country: transferCurrent,
                        paymentType: checkWhatTypeOfPayment(),
                    }
                );
                if (result.data.code === 201) {
                    navigation("/");
                }
                window.sessionStorage.setItem("isPopup", 1);
                dispatch(setClearForm());
                dispatch(setClearCampaignDetails())
                dispatch(setCurrentWindow(0));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const createPromoEstimate = async (isPoRequest) => {
        try {
            const paymentType = checkWhatTypeOfPayment(isPoRequest);
            const {dataFetch} = await UseVerify();
            const result = await axios.post(
                `${process.env.REACT_APP_SERVER}/promos/estimate?isPO=true`,
                {...dataPromo, userId: dataFetch._id, paymentType: paymentType}
            );

            if (result.data.code === 201) {
                setIsPoRequestNeed(true);
                setTranfertCurrent('PO');
                setPromoId(result.data.result._id);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const createTransferForSendingInvoiceWithoutPO = async () => {
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
                        country: transferCurrent,
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
                        country: transferCurrent,
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

    const backForm = () => {
        if (isOpenTransfer || isOpenTransferPaypal || isOpenTransferCard) {
            if (isOpenTransferPaypal) setIsOpenTranferPaypal(false);
            if (isOpenTransferCard) setIsOpenTranferCard(false);
            if (transferCurrent === "") {
                setIsOpenTranfer(false);
            } else {
                setTranfertCurrent("");
            }
        } else {
            dispatch(setCurrentWindow(4));
        }
    };

    const returnTranferData = () => {
        if (transferCurrent === "uk") {
            return (
                <>
                    <p className="account-client-payment-select-transfer-data-title">
                        Beneficiary:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              TECHNO TV LTD
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Account number:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              17299128
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Sort code:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              04-00-75
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Beneficiary address:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              124 City Road, EC1V 2NX, London, United Kingdom
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Bank/Payment institution:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              Revolut Ltd
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Bank/Payment institution address:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              7 Westferry Circus, E14 4HD, London, United Kingdom
            </span>
                    </p>
                </>
            );
        } else if (transferCurrent === "eu") {
            return (
                <>
                    <p className="account-client-payment-select-transfer-data-title">
                        Beneficiary:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              TECHNO TV LTD
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        IBAN:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              GB91REVO00997094280983
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        BIC:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              REVOGB21
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Beneficiary address:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              124 City Road, EC1V 2NX, London, United Kingdom
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Bank/Payment institution:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              Revolut Ltd
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Bank/Payment institution address:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              7 Westferry Circus, E14 4HD, London, United Kingdom
            </span>
                    </p>
                </>
            );
        } else if (transferCurrent === "international") {
            return (
                <>
                    {" "}
                    <p className="account-client-payment-select-transfer-data-title">
                        Beneficiary:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              TECHNO TV LTD
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        IBAN:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              GB47REVO00996994280983
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        BIC:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              REVOGB21
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Intermediary BIC:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              CHASDEFX
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Beneficiary address:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              124 City Road, EC1V 2NX, London, United Kingdom
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Bank/Payment institution:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              Revolut Ltd
            </span>
                    </p>
                    <p className="account-client-payment-select-transfer-data-title">
                        Bank/Payment institution address:{" "}
                        <span className="account-client-payment-select-transfer-data-value">
              7 Westferry Circus, E14 4HD, London, United Kingdom
            </span>
                    </p>
                </>
            );
        } else {
            return "";
        }
    };

    const checkWhatTypeOfPayment = (isPoRequest) => {
        if (isOpenTransfer) {
            if (isPoRequest) {
                return "PO request";
            } else {
                return "Bank transfer";
            }
        } else if (isOpenTransferPaypal) {
            return "Paypal";
        } else if (isOpenTransferCard) {
            return "Bank card";
        }
    };

    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();

            setData(dataFetch);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <section className="account-client">
                {window.innerWidth > 768 ? (
                    <div className="account-client-back-button">
                        <button style={{
                            position: "absolute", top: "195px", left: 50, width: 48, height: 48, cursor: "pointer",
                        }} onClick={() => {
                            backForm();
                        }}>
                            <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                        </button>
                    </div>
                ) : (
                    <div>
                        <button style={{
                            position: "relative",
                            width: 35,
                            height: 35,
                            cursor: "pointer",
                            left: "50%",
                            marginTop: 30,
                            transform: "translate(-50%)"
                        }} onClick={() => {
                            backForm();
                        }}>
                            <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                        </button>
                    </div>
                )}

                <div className="container-form" style={{position: "relative"}}>
                    <div className="account-client-block">
                        <div className="account-client-payment">
                            <div className="account-client-payment-header">
                                <h2 className="account-client-payment-header-title">
                                    total: {dataPromo.selectPrice.price} €
                                </h2>
                            </div>

                            <div
                                className="account-client-payment-content"
                                style={{
                                    display:
                                        isOpenTransfer || isOpenTransferCard || isOpenTransferPaypal
                                            ? "none"
                                            : "block",
                                }}
                            >
                                <TitleSection title="pay" span="with"/>

                                <ul className="account-client-payment-content-methods">
                                    <li className="account-client-payment-content-methods-item">
                                        <button
                                            onClick={() => setIsOpenTranferCard(true)}
                                            className="account-client-payment-content-methods-button"
                                        >
                                            Bank card
                                        </button>
                                    </li>
                                    <li className="account-client-payment-content-methods-item">
                                        <button
                                            onClick={() => setIsOpenTranferPaypal(true)}
                                            className="account-client-payment-content-methods-button"
                                        >
                                            <img src={paypalLogo} alt={'s'}/>
                                        </button>
                                    </li>
                                    <li className="account-client-payment-content-methods-item">
                                        <button
                                            className="account-client-payment-content-methods-button"
                                            onClick={() => setIsOpenTranfer(true)}
                                        >
                                            Bank transfer
                                        </button>
                                    </li>
                                </ul>

                                <ul className="account-client-payment-content-company">
                                    <li className="account-client-payment-content-company-item">
                                        <img
                                            className="account-client-payment-content-company-logo"
                                            src={mastercard}
                                        />
                                    </li>
                                    <li className="account-client-payment-content-company-item">
                                        <img
                                            className="account-client-payment-content-company-logo"
                                            src={visa}
                                        />
                                    </li>
                                    <li className="account-client-payment-content-company-item">
                                        <img
                                            className="account-client-payment-content-company-logo"
                                            src={discover}
                                        />
                                    </li>
                                    <li className="account-client-payment-content-company-item">
                                        <img
                                            className="account-client-payment-content-company-logo"
                                            src={american}
                                        />
                                    </li>
                                    <li className="account-client-payment-content-company-item">
                                        <img
                                            className="account-client-payment-content-company-logo"
                                            src={jcb}
                                        />
                                    </li>
                                    <li className="account-client-payment-content-company-item">
                                        <img
                                            className="account-client-payment-content-company-logo"
                                            src={unionPay}
                                        />
                                    </li>
                                </ul>
                            </div>

                            <div>
                                {isOpenTransfer && (
                                    <div
                                        className="account-client-payment-select-transfer"
                                        style={{
                                            padding: "20px 0px 40px 0px",
                                        }}
                                    >
                                        {transferCurrent !== "PO" ? (<TitleSection
                                                title="Bank"
                                                span={`Transfer ${transferCurrent}`}
                                            />
                                        ) : (
                                            <TitleSection
                                                title="PO REQUEST" span="UK"
                                            />
                                        )}
                                        <ul
                                            className="account-client-payment-content-methods"
                                            style={{display: transferCurrent ? "none" : "flex"}}
                                        >
                                            <li
                                                className="account-client-payment-content-methods-item"
                                                style={{maxWidth: 250}}
                                            >
                                                <button
                                                    onClick={() => setTranfertCurrent("uk")}
                                                    className="account-client-payment-content-methods-button"
                                                >
                                                    UK
                                                </button>
                                            </li>
                                            <li
                                                className="account-client-payment-content-methods-item"
                                                style={{maxWidth: 250}}
                                            >
                                                <button
                                                    onClick={() => setTranfertCurrent("eu")}
                                                    className="account-client-payment-content-methods-button"
                                                >
                                                    EU
                                                </button>
                                            </li>
                                            <li
                                                className="account-client-payment-content-methods-item"
                                                style={{maxWidth: 250}}
                                            >
                                                <button
                                                    onClick={() => setTranfertCurrent("international")}
                                                    className="account-client-payment-content-methods-button"
                                                >
                                                    INTERNATIONAL
                                                </button>
                                            </li>
                                        </ul>

                                        {!isPoRequestNeed ? (
                                            <div
                                                className="account-client-payment-select-transfer-data"
                                                style={{
                                                    display: transferCurrent === "" ? "none" : "block",
                                                }}
                                            >
                                                {returnTranferData()}

                                                <p className="account-client-payment-select-transfer-data-warning">
                                                    ADD THIS PAYMENT REFERENCE NUMBER - *
                                                    {data && data.referenceNumber ? data.referenceNumber : ""}
                                                    *
                                                </p>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        marginTop: 30,
                                                    }}
                                                >
                                                    <StandardButton
                                                        text="Confirm Payment Sent"
                                                        onClick={() => createPromoTranfer()}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="account-client-payment-select-transfer-data"
                                                style={{
                                                    display: transferCurrent === "" ? "none" : "block",
                                                }}
                                            >
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
                                                                    }
                                                                }}
                                                                style={{
                                                                    width: 102,
                                                                    height: 48,
                                                                    fontFamily: "Geometria",
                                                                    fontSize: "18px",
                                                                    marginTop: '13px',
                                                                    fontWeight: "700",
                                                                }} 
                                                                text="SEND"/>
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
                                                         display: 'flex',
                                                         justifyContent: 'center',
                                                         marginTop: '57px'
                                                     }}>
                                                    <StandardButton
                                                        onClick={() => {
                                                            setIsPoRequestNeed(false);
                                                            setTranfertCurrent("");
                                                            dispatch(setClearForm());
                                                            dispatch(setClearCampaignDetails());
                                                            dispatch(setCurrentWindow(0));
                                                            navigation('/');
                                                        }}
                                                        text="Confirm Process Completed"
                                                        style={{
                                                            width: 400,
                                                            height: 60,
                                                            fontFamily: "Geometria",
                                                            fontSize: "22px",
                                                            fontWeight: "700",
                                                            marginBottom: 20,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isOpenTransferPaypal && (
                                <div
                                    className="account-client-payment-select-transfer"
                                    style={{
                                        padding: "20px 0px 40px 0px",
                                    }}
                                >
                                    <TitleSection title="Paypal"/>
                                    <div
                                        className="account-client-payment-select-transfer-data"
                                        style={{
                                            display: "block",
                                        }}
                                    >
                                        <>
                                            <p className="account-client-payment-select-transfer-data-title">
                                                Please send the funds to:{" "}
                                                <span className="account-client-payment-select-transfer-data-value">
                          technotvchannel@gmail.com
                        </span>
                                            </p>
                                        </>

                                        <p className="account-client-payment-select-transfer-data-warning">
                                            In the "NOTE" section, enter the PAYMENT REFERENCE NUMBER
                                            - *P
                                            {data
                                                ? data.referenceNumber
                                                    ? data.referenceNumber
                                                    : ""
                                                : ""}
                                            *
                                        </p>
                                        <p className="account-client-payment-select-transfer-data-title">
                      <span className="account-client-payment-select-transfer-data-value">
                        If possible, send the payment as “Friends & Family”
                      </span>
                                        </p>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: 30,
                                            }}
                                        >
                                            {" "}
                                            <StandardButton
                                                text="Confirm Payment Sent"
                                                onClick={() => createPromoTranfer()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isOpenTransferCard && (
                                <div
                                    className="account-client-payment-select-transfer"
                                    style={{
                                        padding: "20px 0px 40px 0px",
                                    }}
                                >
                                    <TitleSection
                                        title="Bank"
                                        span={`Transfer ${transferCurrent}`}
                                    />

                                    <div
                                        className="account-client-payment-select-transfer-data"
                                        style={{
                                            display: "block",
                                        }}
                                    >
                                        <>
                                            <p className="account-client-payment-select-transfer-data-title">
                                                Go On:{" "}
                                                <span className="account-client-payment-select-transfer-data-value">
                          <a
                              href="https://revolut.me/technotvltd"
                              target="_blank"
                          >
                            https://revolut.me/technotvltd
                          </a>
                        </span>
                                            </p>
                                            <p className="account-client-payment-select-transfer-data-title">
                                                Select{" "}
                                                <span className="account-client-payment-select-transfer-data-value">
                          the currency “EURO” and Enter the amount due, showing
                          here on top
                        </span>
                                            </p>
                                            <p className="account-client-payment-select-transfer-data-title">
                                                In the "NOTE"{" "}
                                                <span className="account-client-payment-select-transfer-data-value">
                          section, enter the PAYMENT REFERENCE NUMBER *C
                                                    {data
                                                        ? data.referenceNumber
                                                            ? data.referenceNumber
                                                            : ""
                                                        : ""}
                        </span>
                                            </p>
                                            <p className="account-client-payment-select-transfer-data-title">
                                                Click “Pay”{" "}
                                            </p>
                                            <p className="account-client-payment-select-transfer-data-title">
                                                Select{" "}
                                                <span className="account-client-payment-select-transfer-data-value">
                          payment by card and enter card details
                        </span>
                                            </p>
                                            <p className="account-client-payment-select-transfer-data-title">
                                                Click “Pay”{" "}
                                            </p>
                                        </>

                                        <p className="account-client-payment-select-transfer-data-warning">
                                            ADD THIS PAYMENT REFERENCE NUMBER - *C
                                            {data
                                                ? data.referenceNumber
                                                    ? data.referenceNumber
                                                    : ""
                                                : ""}
                                            *
                                        </p>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: 30,
                                            }}
                                        >
                                            {" "}
                                            <StandardButton
                                                text="Confirm Payment Sent"
                                                onClick={() => createPromoTranfer()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isOpenTransfer && transferCurrent === "" && (
                    <div
                        style={{
                            marginTop: 67,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <p
                            style={{
                                textAlign: "center",
                                fontFamily: "Geometria",
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#3330E4",
                            }}
                        >
                            IF YOU NEED A PO CLICK HERE
                        </p>
                        <StandardButton
                            style={{
                                width: "338px",
                                height: "48px",
                                marginTop: "13px",
                                display: "block",
                            }}
                            text="PO REQUEST"
                            onClick={() => {
                                createPromoEstimate(true);
                            }}
                        />
                    </div>
                )}
            </section>

            <ModalWindow
                header="Bank card"
                isOpen={isOpenModal}
                setClose={setIsOpenModal}
            >
                <div className="account-client-bank">
                    <form className="account-client-bank-form">
                        <label className="account-client-bank-label">
                            <p className="account-client-bank-label-title">Enter Card</p>
                            <input
                                className="account-client-bank-input"
                                placeholder="0000 0000 0000 0000"
                            />
                            <img className="account-client-bank-label-icon" src={visaBank}/>
                        </label>

                        <div className="account-client-bank-flex">
                            <label className="account-client-bank-label">
                                <p className="account-client-bank-label-title">Validity</p>
                                <input
                                    className="account-client-bank-input"
                                    placeholder="01 / 24"
                                />
                            </label>
                            <label className="account-client-bank-label">
                                <p className="account-client-bank-label-title">CVV-code</p>
                                <input className="account-client-bank-input" placeholder=""/>
                            </label>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "45px",
                            }}
                        >
                            <StandardButton text="Continue"/>
                        </div>
                    </form>
                </div>
            </ModalWindow>

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
        </>
    );
};

export default AccountClientPayment;
