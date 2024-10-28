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
import {setCurrentWindow, setIsNew, setNewOffer} from "../../../../../redux/slice/admin-offers";
import saveImg from "../../../../../images/icons/save 1.svg";
import publishImg from "../../../../../images/icons/share 1.svg";
import AdminDeletedOffers from "./offersComponents/AdminDeletedOffers";
import ModalWindow from "../../../../ModalWindow";

const AdminOffers = () => {
    const [data, setData] = useState(null);
    const [influencers, setInfluencers] = useState(null);
    const [selectedOffersGenres, setSelectedOffersGenres] = useState([]);
    const [filteredOffersByGenres, setFilteredOffersByGenres] = useState([data]);
    const [deletedOffersList, setDeletedOffersList] = useState([]);
    const [isDeletedOffersOpen, setIsDeletedOffersOpen] = useState(false);
    const [isPublishedSuccessfullyModalOpen, setIsPublishedSuccessfullyModalOpen] = useState(false);
    const [isPublishedWerentSuccessfulModalOpen, setIsPublishedWerentSuccessfulModalOpen] = useState(false);
    
    const deletedOffers = useSelector(state => state.adminOffers.deletedOffers);
    const newOffers = useSelector(state => state.adminOffers.newOffers);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            const [offers, offersTemp, result] = await Promise.all([
                axios.get(`${process.env.REACT_APP_SERVER}/promos/offers`),
                axios.get(`${process.env.REACT_APP_SERVER}/admin/offers/getAll`),
                axios.get(`${process.env.REACT_APP_SERVER}/auth/influencers`)
            ]);

            let offersArray = [];

            if (offers.status === 200) {
                offersArray = offers.data.offers;
            }

            if (offersTemp.status === 200 && offersTemp.data.data && offersTemp.data.data.length > 0) {
                setDeletedOffersList(offersTemp.data.data.filter(offer => offer.isDeleted));
                
                offersTemp.data.data = offersTemp.data.data.filter(offer => !offer.isDeleted);
                
                offersArray = offersArray.concat(offersTemp.data.data); 
            }
            setData(offersArray);

            if (result.status === 200) {
                setInfluencers(result.data.influencers);
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
        console.log(newOffers, 'newOffers');
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

                {isPublishedSuccessfullyModalOpen && (
                    <ModalWindow isOpen={isPublishedSuccessfullyModalOpen} setClose={() => setIsPublishedSuccessfullyModalOpen(false)}> 
                        <div className="admin-offers-publish-modal">
                            <h2>Changes published successfully</h2>
                        </div>
                    </ModalWindow>
                )}

                {isPublishedWerentSuccessfulModalOpen && (
                    <ModalWindow isOpen={isPublishedWerentSuccessfulModalOpen} setClose={() => setIsPublishedWerentSuccessfulModalOpen(false)}>
                        <div className="admin-offers-publish-modal">
                            <h2>Changes were not published</h2>
                        </div>
                    </ModalWindow>
                )}

                {data && data.length > 0 && filteredOffersByGenres && filteredOffersByGenres.length > 0 ? (
                    <div>
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
                        <AdminOffersList influencers={influencers} offers={filteredOffersByGenres}
                                         selectedOffersGenres={selectedOffersGenres}/>
                                         
                        <div className="admin-offers-deleted-offers">
                            <button id='open-deleted-offers' onClick={() => setIsDeletedOffersOpen(!isDeletedOffersOpen)}>
                                <span>DELETED OFFERS</span>
                                <span>{deletedOffersList.length}</span>
                            </button>
                            
                            {isDeletedOffersOpen && (
                                <AdminDeletedOffers setOffers={setDeletedOffersList} setIsDeletedOffersOpen={setIsDeletedOffersOpen} setData={setData} offers={deletedOffersList} influencers={influencers} selectedOffersGenres={selectedOffersGenres}/>
                            )}
                        </div>
                    </div>
                ) : <Loading/>}
            </div>
        </section>
    );
}

export default AdminOffers;