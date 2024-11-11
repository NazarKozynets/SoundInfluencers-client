import React, {useEffect, useState} from "react";
import TitleSection from "../../TitleSection";
import FormContainer from "../../form/FormContainer";
import TextInput from "../../form/TextInput";
import {useDispatch, useSelector} from "react-redux";
import {
    setCurrentAccountId,
    setCurrentWindow,
    setEmail,
    setFirstName, setNewSocialMediaAccount,
    setPassword,
    setPhone,
    setSelectedSocialMedia, setSignupClear, updateCurrentAccountId,
} from "../../../redux/slice/signup-influencer";
import axios from "axios";
import '../../../styles/components/_signup-influencer.scss';
import instaIcon from "../../../images/icons/socialMedias/instagram.png";
import tikTokIcon from "../../../images/icons/socialMedias/tiktok.png";
import spotifyIcon from "../../../images/icons/socialMedias/spotify.png";
import soundCloudIcon from "../../../images/icons/socialMedias/soundcloud.png";
import facebookIcon from "../../../images/icons/socialMedias/facebook.png";
import youtubeIcon from "../../../images/icons/socialMedias/youtube.png";
import pressIcon from "../../../images/icons/socialMedias/tablet.png";
import {generateMongoObjectId} from "../../../utils/generateId";
import StandardButton from "../../form/StandardButton";
import ModalWindow from "../../ModalWindow";
import acceptImg from "../../../images/icons/accept.svg";
import {useNavigate} from "react-router-dom";
import seePasswordImg from "../../../images/icons/view 1.svg";

const SignupInfluencer = () => {
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const data = useSelector((state) => state.signupInfluencer);

    const [isReadyToApply, setIsReadyToApply] = useState(false);
    const [isErrorAfterSubmit, setIsErrorAfterSubmit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsReadyToApply(checkIfReadyToApply());
    }, [data]);

    useEffect(() => {
        console.log(data.password);
    }, [data.password]);

    const getSocialMediaIcon = (typeOfSocialMedia) => {
        switch (typeOfSocialMedia) {
            case 'Instagram':
                return instaIcon;
            case 'TikTok':
                return tikTokIcon;
            case 'Spotify':
                return spotifyIcon;
            case 'SoundCloud':
                return soundCloudIcon;
            case 'Facebook':
                return facebookIcon;
            case 'YouTube':
                return youtubeIcon;
            case 'Press':
                return pressIcon;
            default:
                return '';
        }
    }

    const checkIfReadyToApply = () => {
        if (!data.firstName || !data.email || !data.phone || !data.password) {
            return false;
        }
        if (data.attachedSocialMediaAccounts.length === 0) {
            return false;
        }
        return true;
    }

    const createInfluencerAccount = async () => {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_SERVER}/auth/create/influencer`,
                {
                    firstName: data.firstName,
                    email: data.email,
                    phone: data.phone,
                    password: data.password,
                    instagram: data.attachedSocialMediaAccounts.filter((item) => item.typeOfSocialMedia === 'Instagram'),
                    tiktok: data.attachedSocialMediaAccounts.filter((item) => item.typeOfSocialMedia === 'TikTok'),
                    spotify: data.attachedSocialMediaAccounts.filter((item) => item.typeOfSocialMedia === 'Spotify'),
                    soundcloud: data.attachedSocialMediaAccounts.filter((item) => item.typeOfSocialMedia === 'SoundCloud'),
                    facebook: data.attachedSocialMediaAccounts.filter((item) => item.typeOfSocialMedia === 'Facebook'),
                    youtube: data.attachedSocialMediaAccounts.filter((item) => item.typeOfSocialMedia === 'YouTube'),
                    press: data.attachedSocialMediaAccounts.filter((item) => item.typeOfSocialMedia === 'Press'),
                }
            );

            if (result.data.code === 201) {
                setIsErrorAfterSubmit(false);
                setIsReadyToApply(false);
                dispatch(setSignupClear());
                setIsModalOpen(true);
            } else {
                setIsErrorAfterSubmit(true);
            }
        } catch (error) {
            setIsErrorAfterSubmit(true);
            console.log(error);
        }
    }

    return (
        <section className="signup-influencer">
            <div className="container-form">
                <div className="signup-influencer-block">
                    <div>
                        <TitleSection
                            title="Add Your details here"
                        />
                        <TitleSection title="to get approved as" span="an influencer"/>
                    </div>

                    <FormContainer style={{marginTop: "60px"}}>
                        <TitleSection span='personal details'/>
                        <TextInput title='First name' placeholder='Enter name'
                                   style={{maxWidth: '665px', margin: '77px auto 60px auto'}} value={data.firstName}
                                   setValue={(value) => dispatch(setFirstName(value))}/>
                        <TextInput title='Email' placeholder='Enter email'
                                   style={{maxWidth: '665px', margin: '0 auto 60px auto'}} value={data.email}
                                   setValue={(value) => dispatch(setEmail(value))}/>
                        <TextInput title='Phone' placeholder='+_ _ ___ ___ __ __'
                                   style={{maxWidth: '665px', margin: '0 auto 60px auto'}} value={data.phone}
                                   setValue={(value) => dispatch(setPhone(value))}/>
                        <TextInput title='Password' placeholder='Enter password'
                                   style={{maxWidth: '665px', margin: '0 auto -20px auto'}}
                                   value={data.password}
                                   setValue={(value) => dispatch(setPassword(value))}
                                   type="password"/>
                    </FormContainer>

                    <FormContainer style={{marginTop: "100px"}}>
                        <div className='select-social-media'>
                            <TitleSection span='brand account details'/>
                            <p>Add at least one platform to submit your application</p>

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
                                    <img src={pressIcon} alt="Press"/>
                                    <span>Press</span>
                                </li>
                                {data.attachedSocialMediaAccounts.length > 0 &&
                                    [...new Set(data.attachedSocialMediaAccounts.map(account => account.typeOfSocialMedia))]
                                        .map((type) => {
                                            const count = data.attachedSocialMediaAccounts.filter((account) => account.typeOfSocialMedia === type).length;

                                            return (
                                                <div className='ready-account' key={type}>
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
                    </FormContainer>

                    {isReadyToApply && (
                        <div className="apply-button">
                            <StandardButton text="Apply now" onClick={() => createInfluencerAccount()}/>
                        </div>
                    )}

                    {isErrorAfterSubmit && (
                        <div className="error-message">
                            <p>There was an error adding the account. Please try again.</p>
                        </div>
                    )}

                    <ModalWindow isOpen={isModalOpen} setClose={() => setIsModalOpen(false)}>
                        <div className="signup-client-modal">
                            <img className="signup-client-modal-icon" src={acceptImg}/>
                            <h2 className="signup-client-modal-title">Internal approval</h2>
                            <p className="signup-client-modal-second">
                                Thank you for sharing your information.
                            </p>
                            <p className="signup-client-modal-desc">
                                We've got it and our team will review it carefully. If it fits
                                our criteria, we'll let you know. Thanks for your patience,
                                and we'll keep you posted.
                            </p>
                            <StandardButton
                                text="Ok"
                                style={{
                                    padding: "8px 80px",
                                    marginTop: "30px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                                onClick={() => navigation("/account/influencer")}
                            />
                        </div>
                    </ModalWindow>
                </div>
            </div>
        </section>
    );
};

export default SignupInfluencer;