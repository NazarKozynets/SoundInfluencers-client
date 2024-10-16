import React, {useEffect, useState} from "react";
import TitleSection from "../../../TitleSection";
import edit from "../../../../images/icons/edit.svg";
import ModalWindow from "../../../ModalWindow";
import TextInput from "../../../form/TextInput";
import StandardButton from "../../../form/StandardButton";
import UseVerify from "../../../../hooks/useVerify";
import axios from "axios";
import {
    formatPhoneNumber,
    validatePhoneNumber,
} from "../../../../utils/validations";
import InputFile from "../../../form/InputFile";

import {useNavigate} from "react-router-dom";
import arrow from "../../../../images/icons/arrow.svg";

const AccountClientDetails = () => {
    const [data, setData] = useState({});
    const [isOpenPersonal, setIsOpenPersonal] = useState(false);
    const [isOpenPassword, setIsOpenPassword] = useState(false);

    const [errorFirstName, setErrorFirstName] = useState(false);
    const [errorCompany, setErrorCompany] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(false);
    const [errorNewPassword, setErrorNewPassword] = useState(false);
    const [errorRepeatPassword, setErrorRepeatPassword] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [fileImage, setFile] = useState(null);

    const [dataPersonal, setDataPersonal] = useState({
        firstName: "",
        company: "",
        email: "",
        phone: "",
    });

    const [dataPassword, setDataPassword] = useState({
        currentPassword: "",
        newPassword: "",
        acceptPassword: "",
    });

    const updateClientPersonal = async () => {

        if (!dataPersonal.firstName) {
            setErrorFirstName(true);
        }
        if (!dataPersonal.company) {
            setErrorCompany(true);
        }
        if (!dataPersonal.email) {
            setErrorEmail(true);
        }
        if (!dataPersonal.phone) {
            setErrorPhone(true);
        }

        try {
            if (!dataPersonal.firstName || !dataPersonal.company) {
                return;
            }
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/profile/client/personal`,
                {...dataPersonal, id: data._id}
            );
            if (result.data.code === 200) {
                setIsOpenPersonal(false);
                setData({...data, ...dataPersonal});
            }
        } catch (err) {
            console.log(err);
        }
    };

    const updateClientPassword = async () => {
        if (!dataPassword.currentPassword) {
            setErrorCurrentPassword(true);
        }
        if (!dataPassword.newPassword) {
            setErrorNewPassword(true);
        }
        if (
            !dataPassword.acceptPassword ||
            !dataPassword.currentPassword ||
            !dataPassword.newPassword
        ) {
            return;
        }
        if (dataPassword.newPassword !== dataPassword.acceptPassword) {
            setErrorRepeatPassword(true);
            return;
        }
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/profile/client/password`,
                {
                    role: "client",
                    currentPassword: dataPassword.currentPassword,
                    newPassword: dataPassword.newPassword,
                    id: data._id,
                }
            );
            if (result.data.code === 200) {
                setIsOpenPassword(false);
                setDataPassword({
                    currentPassword: "",
                    newPassword: "",
                    acceptPassword: "",
                });
                return;
            }
            setErrorCurrentPassword(true);
        } catch (err) {
            console.log(err);
        }
    };

    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();
            setData(dataFetch);
            setDataPersonal({
                firstName: dataFetch.firstName,
                company: dataFetch.company,
                email: dataFetch.email,
                phone: dataFetch.phone,
            });
            setAvatar(dataFetch.logo);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAvatar = (file) => {
        if (file && file.type.match('image.*')) {
            setFile(file);
            const reader = new FileReader();

            reader.onload = (e) => {
                setAvatar(e.target.result);
            };

            reader.readAsDataURL(file);
        }
    }

    const navigation = useNavigate();
    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <section className="account-influencer-details">
                <div className="container-form">
                    <div className="account-influencer-details-block" style={{position: "relative"}}>
                        <div style={{marginTop: window.innerWidth < 768 ? 50 : 0}}>
                            <TitleSection title="MY" span="account"/>
                        </div>

                        <p className="account-influencer-details-second">
                            My Account Details
                        </p>

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
                                navigation("/account/client")
                            }}
                        >
                            <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                        </button>

                        <div className="account-influencer-details-thoomb">
                            <div className="account-influencer-details-wrapper">
                                <div className="account-influencer-details-wrapper-header">
                                    <p className="account-influencer-details-wrapper-header-title">
                                        Personal Details
                                    </p>

                                    <button
                                        className="account-influencer-details-wrapper-header-edit"
                                        onClick={() => setIsOpenPersonal(true)}
                                    >
                                        <img
                                            className="account-influencer-details-wrapper-header-edit-icon"
                                            src={edit}
                                        />
                                    </button>
                                </div>

                                <div className="account-influencer-details-wrapper-content">
                                    <div className="account-influencer-details-wrapper-content-item">
                                        <p className="account-influencer-details-wrapper-content-title">
                                            First name
                                        </p>
                                        <p className="account-influencer-details-wrapper-content-value">
                                            {data.firstName}
                                        </p>
                                    </div>

                                    <div className="account-influencer-details-wrapper-content-item">
                                        <p className="account-influencer-details-wrapper-content-title">
                                            Company Name
                                        </p>
                                        <p className="account-influencer-details-wrapper-content-value">
                                            {data.company}
                                        </p>
                                    </div>
                                    <div className="account-influencer-details-wrapper-content-item">
                                        <p className="account-influencer-details-wrapper-content-title">
                                            Email
                                        </p>
                                        <p className="account-influencer-details-wrapper-content-value">
                                            {data.email}
                                        </p>
                                    </div>
                                    <div className="account-influencer-details-wrapper-content-item">
                                        <p className="account-influencer-details-wrapper-content-title">
                                            Phone Number
                                        </p>
                                        <p className="account-influencer-details-wrapper-content-value">
                                            {data.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="account-influencer-details-wrapper">
                                <div className="account-influencer-details-wrapper-header">
                                    <p className="account-influencer-details-wrapper-header-title">
                                        Password
                                    </p>

                                    <button
                                        className="account-influencer-details-wrapper-header-edit"
                                        onClick={() => setIsOpenPassword(true)}
                                    >
                                        <img
                                            className="account-influencer-details-wrapper-header-edit-icon"
                                            src={edit}
                                        />
                                    </button>
                                </div>

                                <div className="account-influencer-details-wrapper-content">
                                    <div className="account-influencer-details-wrapper-content-item">
                                        <p className="account-influencer-details-wrapper-content-title">
                                            Password
                                        </p>
                                        <p className="account-influencer-details-wrapper-content-value">
                                            **********
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ModalWindow
                header="Personal Details"
                isOpen={isOpenPersonal}
                setClose={setIsOpenPersonal}
            >
                <div className="account-influencer-details-form">
                    <TextInput
                        title="First name"
                        placeholder="John Doe"
                        style={{marginTop: "80px"}}
                        value={dataPersonal.firstName}
                        setValue={(value) =>
                            setDataPersonal({...dataPersonal, firstName: value})
                        }
                        error={errorFirstName}
                        onFocus={() => setErrorFirstName(false)}
                        silverColor={true}
                    />
                    <TextInput
                        title="Company Name"
                        placeholder="John Doe's Company"
                        style={{marginTop: "50px"}}
                        value={dataPersonal.company}
                        setValue={(value) =>
                            setDataPersonal({...dataPersonal, company: value})
                        }
                        error={errorCompany}
                        onFocus={() => setErrorCompany(false)}
                        silverColor={true}
                    />
                    <TextInput
                        title="Email"
                        placeholder="johndoe@gmail.com"
                        style={{marginTop: "50px"}}
                        value={dataPersonal.email}
                        setValue={(value) =>
                            setDataPersonal({...dataPersonal, email: value})
                        }
                        error={errorEmail}
                        onFocus={() => setErrorEmail(false)}
                        silverColor={true}
                    />
                    <TextInput
                        title="Phone Number"
                        placeholder="+1 234 567 89 00"
                        style={{marginTop: "50px"}}
                        value={dataPersonal.phone}
                        setValue={(value) =>
                            setDataPersonal({...dataPersonal, phone: value})
                        }
                        error={errorPhone}
                        onFocus={() => setErrorPhone(false)}
                        silverColor={true}
                    />

                    <div
                        style={{
                            marginTop: "60px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <StandardButton
                            text="Save changes"
                            onClick={updateClientPersonal}
                        />
                    </div>
                </div>
            </ModalWindow>

            <ModalWindow
                header="Password"
                isOpen={isOpenPassword}
                setClose={setIsOpenPassword}
            >
                <div className="account-influencer-details-form">
                    <TextInput
                        type="password"
                        title="Confirm Current Password"
                        placeholder="Enter Current Password"
                        style={{marginTop: "80px"}}
                        value={dataPassword.currentPassword}
                        setValue={(value) =>
                            setDataPassword({
                                ...dataPassword,
                                currentPassword: value,
                            })
                        }
                        error={errorCurrentPassword}
                        onFocus={() => setErrorCurrentPassword(false)}
                    />
                    <TextInput
                        type="password"
                        title="New Password"
                        placeholder="Enter New Password"
                        style={{marginTop: "50px"}}
                        value={dataPassword.newPassword}
                        setValue={(value) =>
                            setDataPassword({
                                ...dataPassword,
                                newPassword: value,
                            })
                        }
                        error={errorNewPassword}
                        onFocus={() => setErrorNewPassword(false)}
                    />
                    <TextInput
                        type="password"
                        title="Confirm New Password"
                        placeholder="Enter Confirm New Password"
                        style={{marginTop: "50px"}}
                        value={dataPassword.acceptPassword}
                        setValue={(value) =>
                            setDataPassword({
                                ...dataPassword,
                                acceptPassword: value,
                            })
                        }
                        error={errorRepeatPassword}
                        onFocus={() => setErrorRepeatPassword(false)}
                    />

                    <div
                        style={{
                            marginTop: "60px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <StandardButton
                            text="Update Password"
                            onClick={updateClientPassword}
                        />
                    </div>
                </div>
            </ModalWindow>
        </>
    );
};

export default AccountClientDetails;
