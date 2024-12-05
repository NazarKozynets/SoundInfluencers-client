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
import {
    setClearAttachedSocialMediaAccounts,
    setCurrentAccountId, setCurrentWindow,
    setNewSocialMediaAccount,
    setSelectedSocialMedia
} from "../../../../../redux/slice/signup-influencer";
import {generateMongoObjectId} from "../../../../../utils/generateId";
import instaIcon from "../../../../../images/icons/socialMedias/instagram.png";
import tikTokIcon from "../../../../../images/icons/socialMedias/tiktok.png";
import spotifyIcon from "../../../../../images/icons/socialMedias/spotify.png";
import soundCloudIcon from "../../../../../images/icons/socialMedias/soundcloud.png";
import facebookIcon from "../../../../../images/icons/socialMedias/facebook.png";
import youtubeIcon from "../../../../../images/icons/socialMedias/youtube.png";
import pressIcon from "../../../../../images/icons/socialMedias/tablet.png";
import {useDispatch, useSelector} from "react-redux";

const AccountInfluencerDetails = () => {
    const navigation = useNavigate();
    const [data, setData] = useState({
        firstName: "",
        email: "",
        phone: "",
    });
    const dataStore = useSelector((state) => state.signupInfluencer);
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
    const [errorSocialMedia, setErrorSocialMedia] = useState({
        errorAfterAdding: [],
    });
    const [isSocialAccountsModalOpen, setIsSocialAccountsModalOpen] = useState(false);
    const [socialMediaAccounts, setSocialMediaAccounts] = useState({
        instagram: [],
        tiktok: [],
        facebook: [],
        spotify: [],
        soundcloud: [],
        youtube: [],
        press: [],
    });
    const [isAccountsReady, setIsAccountsReady] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const accounts = dataStore.attachedSocialMediaAccounts;

        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            const allAccountsReady = accounts.every(account =>
                account.musicStyle &&
                account.logo &&
                account.price &&
                account.instagramUsername &&
                account.instagramLink &&
                account.followersNumber
            );

            setIsAccountsReady(allAccountsReady);
        } else {
            setIsAccountsReady(false);
        }
    }, [dataStore]);

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
                instagram: dataFetch.instagram.filter((acc) => !acc.isDeleted) || [],
                tiktok: dataFetch?.tiktok.filter((acc) => !acc.isDeleted) || [],
                facebook: dataFetch?.facebook.filter((acc) => !acc.isDeleted) || [],
                spotify: dataFetch?.spotify.filter((acc) => !acc.isDeleted) || [],
                soundcloud: dataFetch?.soundcloud.filter((acc) => !acc.isDeleted) || [],
                youtube: dataFetch?.youtube.filter((acc) => !acc.isDeleted) || [],
                press: dataFetch?.press.filter((acc) => !acc.isDeleted) || [],
            });
        } catch (err) {
            console.log(err);
        }
    };

    const openSavedAccount = (account) => {
        dispatch(setCurrentAccountId(account._id));
        dispatch(setCurrentWindow(1));
    };

    const addSocialMediaAccounts = async () => {
        try {
            let accountsToAdd = {
                instagram: [],
                tiktok: [],
                facebook: [],
                spotify: [],
                soundcloud: [],
                youtube: [],
                press: [],
            };

            dataStore.attachedSocialMediaAccounts.forEach((account) => {
                accountsToAdd[account.typeOfSocialMedia.toLowerCase()].push(account);
            });

            const result = await axios.patch(`${process.env.REACT_APP_SERVER}/profile/influencer/add-social-media-accounts`, {
                influencerId: data._id,
                instagram: accountsToAdd.instagram,
                tiktok: accountsToAdd.tiktok,
                facebook: accountsToAdd.facebook,
                spotify: accountsToAdd.spotify,
                soundcloud: accountsToAdd.soundcloud,
                youtube: accountsToAdd.youtube,
                press: accountsToAdd.press,
            });

            console.log(result, 'result');

            if (result.data.code === 200) {
                await getData();
                dispatch(setClearAttachedSocialMediaAccounts());
                setIsAccountsReady(false);
            } else {
                setErrorSocialMedia({
                    errorAfterAdding: result.data.errors,
                })
            }
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
                                                    <img src={getSocialMediaIcon(account.typeOfSocialMedia)}
                                                         alt='Logo'/>
                                                    <p>{account.instagramUsername || 'No username available'}</p>
                                                    <img src={edit} alt="edit" id="edit-account-img" onClick={() => {
                                                        navigate(`/account/influencer/details/${account._id}`)
                                                    }}/>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className="account-influencer-details-wrapper">
                                <div className="account-influencer-details-wrapper-header">
                                    <p className="account-influencer-details-wrapper-header-title">
                                        ADD NEW BRAND ACCOUNTS
                                    </p>
                                </div>

                                <div className="select-social-media">
                                    <ul className="social-medias-container">
                                        <li onClick={() => {
                                            dispatch(setSelectedSocialMedia('Instagram'));
                                            const id = generateMongoObjectId();
                                            dispatch(setNewSocialMediaAccount(
                                                {
                                                    _id: id,
                                                    typeOfSocialMedia: 'Instagram',
                                                    instagramUsername: '',
                                                    instagramLink: '',
                                                    followersNumber: '',
                                                    logo: '',
                                                    price: '',
                                                }
                                            ))
                                            dispatch(setCurrentAccountId(id));
                                            dispatch(setCurrentWindow(1));
                                        }}>
                                            <img src={instaIcon} alt="Instagram"/>
                                            <span>Instagram</span>
                                        </li>
                                        <li onClick={() => {
                                            dispatch(setSelectedSocialMedia('TikTok'));
                                            const id = generateMongoObjectId();
                                            dispatch(setNewSocialMediaAccount((
                                                {
                                                    _id: id,
                                                    typeOfSocialMedia: 'TikTok',
                                                    instagramUsername: '',
                                                    instagramLink: '',
                                                    followersNumber: '',
                                                    logo: '',
                                                    price: '',
                                                }
                                            )))
                                            dispatch(setCurrentAccountId(id));
                                            dispatch(setCurrentWindow(1));
                                        }}>
                                            <img src={tikTokIcon} alt="tikTok"/>
                                            <span>TikTok</span>
                                        </li>
                                        <li onClick={() => {
                                            dispatch(setSelectedSocialMedia('Spotify'));
                                            const id = generateMongoObjectId();
                                            dispatch(setNewSocialMediaAccount((
                                                {
                                                    _id: id,
                                                    typeOfSocialMedia: 'Spotify',
                                                    instagramUsername: '',
                                                    instagramLink: '',
                                                    followersNumber: '',
                                                    logo: '',
                                                    price: '',
                                                }
                                            )))
                                            dispatch(setCurrentAccountId(id));
                                            dispatch(setCurrentWindow(1));
                                        }}>
                                            <img src={spotifyIcon} alt="spotify"/>
                                            <span>Spotify</span>
                                        </li>
                                        <li onClick={() => {
                                            dispatch(setSelectedSocialMedia('SoundCloud'));
                                            const id = generateMongoObjectId();
                                            dispatch(setNewSocialMediaAccount((
                                                {
                                                    _id: id,
                                                    typeOfSocialMedia: 'SoundCloud',
                                                    instagramUsername: '',
                                                    instagramLink: '',
                                                    followersNumber: '',
                                                    logo: '',
                                                    price: '',
                                                }
                                            )))
                                            dispatch(setCurrentAccountId(id));
                                            dispatch(setCurrentWindow(1));
                                        }}>
                                            <img src={soundCloudIcon} alt="SoundCloud"/>
                                            <span>SoundCloud</span>
                                        </li>
                                        <li onClick={() => {
                                            dispatch(setSelectedSocialMedia('Facebook'));
                                            const id = generateMongoObjectId();
                                            dispatch(setNewSocialMediaAccount((
                                                {
                                                    _id: id,
                                                    typeOfSocialMedia: 'Facebook',
                                                    instagramUsername: '',
                                                    instagramLink: '',
                                                    followersNumber: '',
                                                    logo: '',
                                                    price: '',
                                                }
                                            )))
                                            dispatch(setCurrentAccountId(id));
                                            dispatch(setCurrentWindow(1));
                                        }}>
                                            <img src={facebookIcon} alt="facebook"/>
                                            <span>Facebook</span>
                                        </li>
                                        <li onClick={() => {
                                            dispatch(setSelectedSocialMedia('YouTube'));
                                            const id = generateMongoObjectId();
                                            dispatch(setNewSocialMediaAccount((
                                                {
                                                    _id: id,
                                                    typeOfSocialMedia: 'YouTube',
                                                    instagramUsername: '',
                                                    instagramLink: '',
                                                    followersNumber: '',
                                                    logo: '',
                                                    price: '',
                                                }
                                            )))
                                            dispatch(setCurrentAccountId(id));
                                            dispatch(setCurrentWindow(1));
                                        }}>
                                            <img src={youtubeIcon} alt="YouTube"/>
                                            <span>YouTube</span>
                                        </li>
                                        <li onClick={() => {
                                            dispatch(setSelectedSocialMedia('Press'));
                                            const id = generateMongoObjectId();
                                            dispatch(setNewSocialMediaAccount((
                                                {
                                                    _id: id,
                                                    typeOfSocialMedia: 'Press',
                                                    instagramUsername: '',
                                                    instagramLink: '',
                                                    followersNumber: '',
                                                    logo: '',
                                                    price: '',
                                                }
                                            )))
                                            dispatch(setCurrentAccountId(id));
                                            dispatch(setCurrentWindow(1));
                                        }}>
                                            <img style={{marginBottom: 9}} src={pressIcon} alt="Press"/>
                                            <span>Press</span>
                                        </li>
                                        {dataStore.attachedSocialMediaAccounts.length > 0 &&
                                            [...new Set(dataStore.attachedSocialMediaAccounts.map(account => account.typeOfSocialMedia))]
                                                .map((type) => {
                                                    const count = dataStore.attachedSocialMediaAccounts.filter((account) => account.typeOfSocialMedia === type).length;

                                                    return (
                                                        <div className='ready-account' key={type} onClick={() => {
                                                            dispatch(setSelectedSocialMedia(type));
                                                            setIsSocialAccountsModalOpen(true);
                                                        }}>
          <span className='length'>
            {count}
          </span>
                                                            <li>
                                                                <img
                                                                    src={getSocialMediaIcon(type)}
                                                                    alt={type}
                                                                />
                                                                <span>{type}</span>
                                                            </li>
                                                        </div>
                                                    );
                                                })
                                        }
                                    </ul>
                                </div>
                                {isAccountsReady && (
                                    <StandardButton
                                        style={{margin: '0 auto 33px auto', width: 210}}
                                        text="Save"
                                        onClick={() => addSocialMediaAccounts()}/>
                                )}
                                {errorSocialMedia.errorAfterAdding.length > 0 && (
                                    <div className="error-after-adding">
                                        {errorSocialMedia.errorAfterAdding.map((error, index) => (
                                            <p key={index}>{error}</p>
                                        ))}
                                    </div>
                                )}
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

            <ModalWindow isOpen={isSocialAccountsModalOpen}
                         setClose={() => setIsSocialAccountsModalOpen(false)}>
                <div className="accounts-list-modal">
                    {dataStore.attachedSocialMediaAccounts.filter((account) => account.typeOfSocialMedia === dataStore.selectedSocialMedia).map((account, index) => {
                        return (
                            <div className="account-block" onClick={() => openSavedAccount(account)}>
                                <img src={getSocialMediaIcon(account.typeOfSocialMedia)}
                                     alt={account.typeOfSocialMedia}/>
                                <p>{account.instagramUsername ? account.instagramUsername : 'Account ' + ++index}</p>
                            </div>
                        )
                    })}
                </div>
            </ModalWindow>
        </>
    );
};

export default AccountInfluencerDetails;
