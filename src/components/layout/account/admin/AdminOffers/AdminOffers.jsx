import React, {useEffect, useState} from "react";
import TitleSection from "../../../../TitleSection";
import Loading from "../../../../form/PageLoading/pageLoading";
import backBtn from "../../../../../images/icons/arrow.svg";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import GenreButtonList from "../../../../form/GenreButton/GenreButtonList";
import AdminOffersList from "./offersComponents/AdminOffersList";
import plusImg from "../../../../../images/icons/plus 2.svg";
import {useDispatch, useSelector} from "react-redux";
import {
    setCurrentWindow,
    setInfluencersData,
    setIsNew,
    setNewOffer,
    setSelectedSocialMedia
} from "../../../../../redux/slice/admin-offers";
import saveImg from "../../../../../images/icons/save 1.svg";
import publishImg from "../../../../../images/icons/share 1.svg";
import AdminDeletedOffers from "./offersComponents/AdminDeletedOffers";
import ModalWindow from "../../../../ModalWindow";
import instaIcon from "../../../../../images/icons/socialMedias/instagram.png";
import tiktokIcon from "../../../../../images/icons/socialMedias/tiktok.png";
import facebookIcon from "../../../../../images/icons/socialMedias/facebook.png";
import youtubeIcon from "../../../../../images/icons/socialMedias/youtube.png";
import spotifyIcon from "../../../../../images/icons/socialMedias/spotify.png";
import soundcloudIcon from "../../../../../images/icons/socialMedias/soundcloud.png";
import tabletIcon from "../../../../../images/icons/socialMedias/tablet.png";

const AdminOffers = () => {
    const [data, setData] = useState(null);
    const [selectedOffersGenres, setSelectedOffersGenres] = useState([]);
    const [filteredOffersByGenres, setFilteredOffersByGenres] = useState([data]);
    const [deletedOffersList, setDeletedOffersList] = useState([]);
    const [isDeletedOffersOpen, setIsDeletedOffersOpen] = useState(false);
    const [isPublishedSuccessfullyModalOpen, setIsPublishedSuccessfullyModalOpen] = useState(false);
    const [isPublishedWerentSuccessfulModalOpen, setIsPublishedWerentSuccessfulModalOpen] = useState(false);
    const [allOffersData, setAllOffersData] = useState([]);
    
    const deletedOffers = useSelector(state => state.adminOffers.deletedOffers);
    const newOffers = useSelector(state => state.adminOffers.newOffers);
    const selectedSocialMedia = useSelector(state => state.adminOffers.selectedSocialMedia);
    const influencers = useSelector(state => state.adminOffers.influencersData);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const platforms = [{
        name: 'Instagram',
        secondName: 'IG',
        icon: instaIcon,
        offers: []
    }, {
        name: 'TikTok',
        secondName: 'TT',
        icon: tiktokIcon,
        offers: []
    }, {
        name: 'Facebook',
        secondName: 'FB',
        icon: facebookIcon,
        offers: []
    }, {
        name: 'YouTube',
        secondName: 'YT',
        icon: youtubeIcon,
        offers: []
    }, {
        name: 'Spotify',
        secondName: 'SP',
        icon: spotifyIcon,
        offers: []
    }, {
        name: 'SoundCloud',
        secondName: 'SC',
        icon: soundcloudIcon,
        offers: []
    }, {
        name: 'Press',
        secondName: 'PR',
        icon: tabletIcon,
        offers: []
    }]

    useEffect(() => {
        if (selectedSocialMedia) {
            const platformData = allOffersData.find(
                (platform) => platform.name === selectedSocialMedia
            );
            setData(platformData?.offers || []);
        }
    }, [selectedSocialMedia, allOffersData]);
    
    const getData = async () => {
        try {
            const [offers, result] = await Promise.all([
                axios.get(`${process.env.REACT_APP_SERVER}/admin/offers/getAll`),
                axios.get(`${process.env.REACT_APP_SERVER}/auth/influencers-all`)
            ]);

            if (offers.status === 200) {
                const updatedPlatforms = platforms.map((platform) => {
                    let tempArr = [];

                    const platformOffers = offers.data.data.socialMedias[platform.name.toLowerCase()]?.offers || [];

                    const platformSpecificTempOffers = offers.data.data.offersTemp?.filter(
                        offer => offer.socialMedia === platform.name.toLowerCase() && !offer.isDeleted
                    ) || [];

                    tempArr = [...platformOffers, ...platformSpecificTempOffers];

                    if (platform.name.toLowerCase() === selectedSocialMedia?.toLowerCase()) {
                        setDeletedOffersList(
                            offers.data.data.offersTemp?.filter(
                                offer => offer.socialMedia === platform.name.toLowerCase() && offer.isDeleted
                            ) || []
                        );
                    }

                    return { ...platform, offers: tempArr };
                });

                setAllOffersData(updatedPlatforms);
            }

            if (result.status === 200) {
                dispatch(setInfluencersData(result.data.influencers));
            }
        } catch (error) {
            console.error('Error occurred while fetching data:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        data?.sort((a, b) => a.id - b.id);
        setFilteredOffersByGenres(data);
    }, [data]);

    useEffect(() => {
        let dataForFiltered = data;

        if (deletedOffers.length > 0) {
            dataForFiltered = data?.filter((offer) =>
                !deletedOffers.some((deletedOffer) => deletedOffer.id === offer.id)
            );
        }

        setFilteredOffersByGenres(selectedOffersGenres.length > 0 ? data.filter(price => {
                const matchingStyle = price.musicStyles?.find(style => {
                    const styleGenres = style.genres;
                    return selectedOffersGenres.every(genre => styleGenres.includes(genre)) &&
                        styleGenres.length === selectedOffersGenres.length;
                });
                return matchingStyle;
            }
        ) : dataForFiltered);

    }, [selectedOffersGenres]);

    useEffect(() => {
        if (deletedOffers.length > 0) {
            setData((prevData) =>
                prevData?.filter((offer) =>
                    !deletedOffers.some((deletedOffer) => deletedOffer._id === offer._id)
                )
            );

            setDeletedOffersList((prevData) => {
                const updatedData = prevData ? [...prevData, ...deletedOffers] : [...deletedOffers];
                return Array.from(new Set(updatedData.map(JSON.stringify))).map(JSON.parse);
            });
        }
    }, [deletedOffers]);

    useEffect(() => {
        if (newOffers.length > 0) {
            setData((prevData) => {
                const updatedData = prevData ? [...prevData, ...newOffers] : [...newOffers];
                return Array.from(new Set(updatedData.map(JSON.stringify))).map(JSON.parse);
            });
        }
    }, [newOffers]);

    const addNewOffer = () => {
        dispatch(setNewOffer({
            connectInfluencer: [],
            followers: '? Followers Combined',
            id: 0,
            maxInfluencer: 100,
            musicStyles: [],
            network: '? Networks Included with',
            price: 0,
            story: '? IG Post & Story on'
        }))
        dispatch(setIsNew(true));
        dispatch(setCurrentWindow(1));
    }

    const putOffersInTemp = async () => {
        if (deletedOffers.length > 0) {
            deletedOffers.forEach(async (offer) => {
                const result = await axios.put(`${process.env.REACT_APP_SERVER}/admin/offers/delete-and-save-to-temp`, {
                    _id: offer._id,
                    id: offer.id,
                    price: offer.price,
                    maxInfluencer: offer.maxInfluencer,
                    musicStyles: offer.musicStyles,
                    connectInfluencer: offer.connectInfluencer,
                    followers: offer.followers,
                    network: offer.network,
                    story: offer.story,
                    isDeleted: true,
                    isNew: newOffers.some(newOffer => newOffer._id === offer._id),
                    isUpdated: false,
                });
                if (result.status === 200) {

                }
            });
        }

        if (newOffers.length > 0) {
            newOffers.forEach(async (offer) => {
                const result = await axios.put(`${process.env.REACT_APP_SERVER}/admin/offers/save-to-temp`, {
                    _id: offer._id,
                    id: offer.id,
                    price: offer.price,
                    maxInfluencer: offer.maxInfluencer,
                    musicStyles: offer.musicStyles,
                    connectInfluencer: offer.connectInfluencer,
                    followers: offer.followers,
                    network: offer.network,
                    story: offer.story,
                    isDeleted: false,
                    isNew: newOffers.some(newOffer => newOffer._id === offer._id),
                    isUpdated: false,
                });
            });
        }
    }

    const publishOffers = async () => {
        try {
            const result = await axios.put(`${process.env.REACT_APP_SERVER}/admin/offers/publish`);
            if (result.data.status === 200) {
                setIsPublishedSuccessfullyModalOpen(true);
            } else {
                setIsPublishedWerentSuccessfulModalOpen(true);
            }
        } catch (error) {
            console.error('Error occurred while publishing offers:', error);
        }
    }

    const handlePlatformClick = (platform) => {
        if (platform === 'Instagram') {
            dispatch(setSelectedSocialMedia('Instagram'));
        } else {
            if (selectedSocialMedia === platform) {
                dispatch(setSelectedSocialMedia('Instagram'));
            } else {
                dispatch(setSelectedSocialMedia(platform));
            }
        }
    }

    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => navigate('/admin/home')}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title='Offers'/>
                    <button id='first-button' onClick={() => putOffersInTemp()}>
                        <img src={saveImg} alt='save'/>
                        <span>SAVE</span>
                    </button>
                    <button id='second-button' onClick={() => publishOffers()}>
                        <img src={publishImg} alt='publish'/>
                        <span>PUBLISH</span>
                    </button>
                </div>

                <div className="admin-influencers-platforms">
                            <span style={{
                                fontFamily: "Geometria",
                                fontSize: '25px',
                                fontWeight: 800,
                                textAlign: 'center',
                                color: "#3330E4",
                            }}>
                                PLATFORMS
                            </span>
                    <div>
                        <ul className="admin-influencers-platforms-container">
                            {platforms.map((platform, index) => (
                                <li key={index}
                                    className={`admin-influencers-platforms-container-item ${selectedSocialMedia === platform.name ? 'active' : ''}`}>
                                    <button onClick={() => {
                                        handlePlatformClick(platform.name)
                                    }}>
                                        <img src={platform.icon} alt={'icon'} style={{width: 35}}/>
                                        {platform.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {isPublishedSuccessfullyModalOpen && (
                    <ModalWindow isOpen={isPublishedSuccessfullyModalOpen}
                                 setClose={() => setIsPublishedSuccessfullyModalOpen(false)}>
                        <div className="admin-offers-publish-modal">
                            <h2>Changes published successfully</h2>
                        </div>
                    </ModalWindow>
                )}

                {isPublishedWerentSuccessfulModalOpen && (
                    <ModalWindow isOpen={isPublishedWerentSuccessfulModalOpen}
                                 setClose={() => setIsPublishedWerentSuccessfulModalOpen(false)}>
                        <div className="admin-offers-publish-modal">
                            <h2>Changes were not published</h2>
                        </div>
                    </ModalWindow>
                )}

                <GenreButtonList setSelectedOffersGenres={setSelectedOffersGenres}
                                 selectedOffersGenres={selectedOffersGenres}/>
                <div className="admin-offers-add-offer">
                    <button onClick={() => {
                        addNewOffer();
                    }}>
                        <img src={plusImg} alt={'plus'}/>
                        <span>ADD NEW OFFER</span>
                    </button>
                </div>

                {data && data.length > 0 && filteredOffersByGenres && filteredOffersByGenres.length > 0 ? (
                    <div>
                        <AdminOffersList influencers={influencers} offers={filteredOffersByGenres}
                                         selectedOffersGenres={selectedOffersGenres}/>

                        <div className="admin-offers-deleted-offers">
                            <button id='open-deleted-offers'
                                    onClick={() => setIsDeletedOffersOpen(!isDeletedOffersOpen)}>
                                <span>DELETED OFFERS</span>
                                <span>{deletedOffersList.length}</span>
                            </button>

                            {isDeletedOffersOpen && (
                                <AdminDeletedOffers setOffers={setDeletedOffersList}
                                                    setIsDeletedOffersOpen={setIsDeletedOffersOpen} setData={setData}
                                                    offers={deletedOffersList} influencers={influencers}
                                                    selectedOffersGenres={selectedOffersGenres}/>
                            )}
                        </div>
                    </div>
                ) : <Loading/>}
            </div>
        </section>
    );
}

export default AdminOffers;