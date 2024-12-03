import React, {useEffect, useState} from "react";
import TitleSection from "../../../../TitleSection";
import edit from "../../../../../images/icons/edit.svg";
import ModalWindow from "../../../../ModalWindow";
import TextInput from "../../../../form/TextInput";
import StandardButton from "../../../../form/StandardButton";
import axios from "axios";
import UseVerify from "../../../../../hooks/useVerify";
import {
    formatPhoneNumber,
    validatePhoneNumber,
} from "../../../../../utils/validations";
import {useNavigate} from "react-router-dom";
import arrow from "../../../../../images/icons/arrow.svg";
import {getSocialMediaIcon} from "../../../../../utils/typeOfSocialAccounts";

const AccountInfluencerDetails = () => {
    const navigation = useNavigate();
    const [data, setData] = useState({
        firstName: "",
        email: "",
        phone: "",
    });
    const [isOpenPersonal, setIsOpenPersonal] = useState(false);
    const [isOpenPassword, setIsOpenPassword] = useState(false);
    const [dataPersonal, setDataPersonal] = useState({
        firstName: "",
        email: "",
        phone: "",
    });
    const [dataPassword, setDataPassword] = useState({
        currentPassword: "",
        newPassword: "",
        repeatPassword: "",
    });
    const [errorPersonal, setErrorPersonal] = useState({
        firstName: false,
        email: false,
        phone: false,
    });
    const [errorPassword, setErrorPassword] = useState({
        currentPassword: false,
        newPassword: false,
        repeatPassword: false,
    });
    const [socialMediaAccounts, setSocialMediaAccounts] = useState({
        instagram: [],
        tiktok: [],
        facebook: [],
        spotify: [],
        soundcloud: [],
        youtube: [],
        press: [],
    });

    const navigate = useNavigate();
    
    useEffect(() => {
        getData();
    }, []);

    // useEffect(() => {
    //     console.log(socialMediaAccounts, 'socialMediaAccounts');
    // }, [socialMediaAccounts]);

    const updateInfluencerPersonal = async () => {
        let errorPersonalList = {
            firstName: false,
            email: false,
            phone: false,
        };
        if (!dataPersonal.firstName) {
            errorPersonalList = {
                ...errorPersonal,
                firstName: true,
            };
        }
        if (!dataPersonal.email) {
            errorPersonalList = {
                ...errorPersonal,
                email: true,
            };
        }
        if (!validatePhoneNumber(dataPersonal.phone)) {
            errorPersonalList = {
                ...errorPersonal,
                phone: true,
            };
        }

        try {
            if (!dataPersonal.firstName || !dataPersonal.email || !dataPersonal.phone) {
                return setErrorPersonal(errorPersonalList);
            }

            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/profile/influencer/personal`,
                {...dataPersonal, id: data._id}
            );

            if (result.data.code === 200) {
                setDataPersonal({
                    firstName: result.data.data.firstName,
                    email: result.data.data.email,
                    phone: result.data.data.phone,
                })
                setData({
                    ...data,
                    firstName: dataPersonal.firstName,
                    email: dataPersonal.email,
                    phone: dataPersonal.phone
                });
                setIsOpenPersonal(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const updateInfluencerPassword = async () => {
        if (!dataPassword.currentPassword) {
            setErrorPassword({
                ...errorPassword,
                currentPassword: true,
            });
        }
        if (!dataPassword.newPassword) {
            setErrorPassword({
                ...errorPassword,
                newPassword: true,
            });
        }
        if (
            !dataPassword.repeatPassword ||
            !dataPassword.currentPassword ||
            !dataPassword.newPassword
        ) {
            return;
        }
        if (dataPassword.newPassword !== dataPassword.repeatPassword) {
            setErrorPassword({
                ...errorPassword,
                repeatPassword: true,
            });
            return;
        }
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/profile/client/password`,
                {
                    role: "influencer",
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
                    repeatPassword: "",
                });
                return;
            }
            setErrorPassword({
                ...errorPassword,
                currentPassword: true,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();

            setData(dataFetch);

            setErrorPersonal({
                ...errorPersonal,
            });

            setDataPersonal({
                firstName: dataFetch.firstName,
                email: dataFetch.email,
                phone: dataFetch.phone,
            });

            setSocialMediaAccounts({
                instagram: dataFetch.instagram || [],
                tiktok: dataFetch?.tiktok || [],
                facebook: dataFetch?.facebook || [],
                spotify: dataFetch?.spotify || [],
                soundcloud: dataFetch?.soundcloud || [],
                youtube: dataFetch?.youtube || [],
                press: dataFetch?.press || [],
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <section className="account-influencer-details">
                <div className="container-form">
                    <div
                        className="account-influencer-details-block"
                        style={{position: "relative"}}
                    >
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
                                navigation("/account/influencer");
                            }}
                        >
                            <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                        </button>

                        <div style={{marginTop: window.innerWidth < 768 ? 50 : 0}}>
                            <TitleSection title="MY" span="account"/>
                        </div>

                        <p className="account-influencer-details-second">
                            My Account Details
                        </p>

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
                                            {data.firstName ? data.firstName : "No Data"}
                                        </p>
                                    </div>
                                    <div className="account-influencer-details-wrapper-content-item">
                                        <p className="account-influencer-details-wrapper-content-title">
                                            Email
                                        </p>
                                        <p className="account-influencer-details-wrapper-content-value">
                                            {data.email ? data.email : "No Data"}
                                        </p>
                                    </div>
                                    <div className="account-influencer-details-wrapper-content-item">
                                        <p className="account-influencer-details-wrapper-content-title">
                                            Phone
                                        </p>
                                        <p className="account-influencer-details-wrapper-content-value">
                                            {data.phone ? data.phone : "No Data"}
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

                            <div className="account-influencer-details-wrapper">
                                <div className="account-influencer-details-wrapper-header">
                                    <p className="account-influencer-details-wrapper-header-title">
                                        APPROVED BRAND ACCOUNTS
                                    </p>
                                </div>

                                <div className="account-influencer-details-wrapper-content">
                                    <div className="account-influencer-details-approved-accounts-list">
                                        {Object.entries(socialMediaAccounts)
                                            .flatMap(([platform, accounts]) =>
                                                accounts.map(account => ({
                                                    ...account,
                                                    typeOfSocialMedia: platform,
                                                }))
                                            )
                                            .map((account, index) => (
                                                <div key={index} className="account-item">
                                                    <img src={getSocialMediaIcon(account.typeOfSocialMedia)} alt='Logo'/>
                                                    <p>{account.instagramUsername || 'No username available'}</p>
                                                    <img src={edit} alt="edit" id="edit-account-img" onClick={() => {
                                                        navigate(`/account/influencer/details/${account._id}`)
                                                    }}/>
                                                </div>
                                            ))}
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
                        error={errorPersonal.firstName}
                        onFocus={() =>
                            setErrorPersonal({...errorPersonal, firstName: false})
                        }
                    />
                    <TextInput
                        title="Email"
                        placeholder="User_email@gmail.com"
                        style={{marginTop: "50px"}}
                        value={dataPersonal.email}
                        setValue={(value) =>
                            setDataPersonal({...dataPersonal, email: value})
                        }
                        error={errorPersonal.email}
                        onFocus={() =>
                            setErrorPersonal({...errorPersonal, email: false})
                        }
                    />
                    <TextInput
                        title="Phone"
                        placeholder="+1 234 567 89 00"
                        style={{marginTop: "50px"}}
                        value={dataPersonal.phone}
                        setValue={(value) =>
                            setDataPersonal({...dataPersonal, phone: formatPhoneNumber(value)})
                        }
                        error={errorPersonal.phone}
                        onFocus={() =>
                            setErrorPersonal({...errorPersonal, phone: false})
                        }
                    />

                    <StandardButton text="Save changes" onClick={() => updateInfluencerPersonal()}
                                    style={{margin: '60px auto 0 auto'}}/>
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
                            setDataPassword({...dataPassword, currentPassword: value})
                        }
                        error={errorPassword.currentPassword}
                        onFocus={() =>
                            setErrorPassword({...errorPassword, currentPassword: false})
                        }
                    />
                    <TextInput
                        type="password"
                        title="New Password"
                        placeholder="Enter New Password"
                        style={{marginTop: "50px"}}
                        value={dataPassword.newPassword}
                        setValue={(value) =>
                            setDataPassword({...dataPassword, newPassword: value})
                        }
                        error={errorPassword.newPassword}
                        onFocus={() =>
                            setErrorPassword({...errorPassword, newPassword: false})
                        }
                    />
                    <TextInput
                        type="password"
                        title="Confirm New Password"
                        placeholder="Enter Confirm New Password"
                        style={{marginTop: "50px"}}
                        value={dataPassword.repeatPassword}
                        setValue={(value) =>
                            setDataPassword({...dataPassword, repeatPassword: value})
                        }
                        error={errorPassword.repeatPassword}
                        onFocus={() =>
                            setErrorPassword({...errorPassword, repeatPassword: false})
                        }
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
                            onClick={() => updateInfluencerPassword()}
                        />
                    </div>
                </div>
            </ModalWindow>
        </>
    );
};

export default AccountInfluencerDetails;
