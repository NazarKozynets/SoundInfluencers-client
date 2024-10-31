import React, {useEffect, useState} from "react";
import backBtn from "../../../../../../images/icons/arrow.svg";
import TitleSection from "../../../../../TitleSection";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentWindow, setIsNew, setNewOffer} from "../../../../../../redux/slice/admin-offers";
import AdminEditOfferTable from "./AdminEditOfferTable";
import OffersTableFilters from "../../form/offers/filters-table/OffersTableFilters";
import Loading from "../../../../../form/PageLoading/pageLoading";
import GenreButtonList from "../../../../../form/GenreButton/GenreButtonList";
import saveImg from "../../../../../../images/icons/save 1.svg";
import axios from "axios";
import {generateMongoObjectId} from "../../../../../../utils/generateId";

const AdminEditNewOffer = ({influencers}) => {
    const offer = useSelector((state) => state.adminOffers.newOffer);
    const [filteredInfluencers, setFilteredInfluencers] = useState(influencers);
    const [selectedInfluencers, setSelectedInfluencers] = useState([]);
    const [selectedOffersGenres, setSelectedOffersGenres] = useState([]);
    const [priceForOfferWithGenre, setPriceForOfferWithGenre] = useState(0);
    
    const dispatch = useDispatch();

    useEffect(() => {
        let influencersArrayToSave = selectedInfluencers.map(influencer => ({
            influencerId: influencer._id,
            instagramUsername: influencer.instagramUsername
        }));

        let updatedOffer = { ...offer };

        if (selectedOffersGenres.length === 0) {
            updatedOffer = {
                ...offer,
                connectInfluencer: influencersArrayToSave,
            };
        } else {
            const priceForOffer = priceForOfferWithGenre;
            
            const updatedMusicStyles = (offer.musicStyles || [])
                .filter(style => style.connectInfluencer && style.connectInfluencer.length > 0);

            selectedOffersGenres.forEach(genre => {
                const existingStyleIndex = updatedMusicStyles.findIndex(
                    style => style.genres.includes(genre)
                );

                if (existingStyleIndex > -1) {
                    updatedMusicStyles[existingStyleIndex] = {
                        ...updatedMusicStyles[existingStyleIndex],
                        connectInfluencer: influencersArrayToSave,
                        price: priceForOffer,
                    };
                } else if (influencersArrayToSave.length > 0) {  
                    updatedMusicStyles.push({
                        price: priceForOffer,
                        genres: [genre],
                        connectInfluencer: influencersArrayToSave,
                    });
                }
            });

            updatedOffer = {
                ...offer,
                musicStyles: updatedMusicStyles,
            };
        }

        if (JSON.stringify(updatedOffer) !== JSON.stringify(offer)) {
            dispatch(setNewOffer(updatedOffer));
        }
    }, [selectedInfluencers, selectedOffersGenres, priceForOfferWithGenre]);

    useEffect(() => {
        console.log('offer', offer);
    }, [offer]);
    
    const handleFieldChange = (field, value) => {
        const updatedOffer = {
            ...offer,
            [field]: value,
        };
        dispatch(setNewOffer(updatedOffer));
    };
    
    const saveOffer = async () => {
        try {
            const offerId = generateMongoObjectId();
            const result = await axios.put(`${process.env.REACT_APP_SERVER}/admin/offers/save-to-temp`,
                {
                    _id: offerId,
                    maxInfluencer: 0,
                    ...offer,
                    isNew: true,
                    isDeleted: false,
                    isUpdated: false,
                }
            ); 
            
            console.log(result);
            
            if (result.data.status === 200 || result.data.status === 201) {
                dispatch(setNewOffer({
                    connectInfluencer: [],
                    followers: '? Followers Combined',
                    id: 0,
                    maxInfluencer: null,
                    musicStyles: [],
                    network: '? Networks Included with',
                    price: 0,
                    story: '? IG Post & Story on'
                }));
                dispatch(setIsNew(false));
                dispatch(setCurrentWindow(0));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => {
                        dispatch(setCurrentWindow(0))
                        setIsNew(false)
                        setNewOffer({
                            connectInfluencer: [],
                            followers: '? Followers Combined',
                            id: 0,
                            maxInfluencer: null,
                            musicStyles: [],
                            network: '? Networks Included with',
                            price: 0,
                            story: '? IG Post & Story on'
                        });
                    }}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title='Offers' span='design'/>
                    <button id='third-button' onClick={() => saveOffer()}>
                        <img src={saveImg} alt='save'/>
                        <span>SAVE</span>
                    </button>
                </div>

                <div className="select-offer-genre" style={{marginTop: 50}}>
                    <TitleSection title='Select genre'/>
                    <GenreButtonList setSelectedOffersGenres={setSelectedOffersGenres}/>
                </div>

                {filteredInfluencers.length > 0 ? (
                    <div className='admin-offer-edit-container'>
                        <div className='admin-offer-edit-filters'>
                            <OffersTableFilters influencers={influencers}
                                                setFilteredInfluencers={setFilteredInfluencers}/>
                        </div>

                        <div className='admin-offer-edit-container-offer-container'>
                            <div className="report-details">
                                <div className="report-details-first">
                                    <p>Name</p>
                                    <div style={{display: 'flex', alignItems: 'center', margin: '0 auto'}}>
                                        <span id='offer-name-price'>IG</span>
                                        <input
                                            id="offer-name-price"
                                            value={offer.id}
                                            onChange={(e) => handleFieldChange('id', e.target.value.replace(/[^0-9.]/g, ''))}
                                        />
                                        <span id='offer-name-price'>M</span>
                                    </div>
                                </div>
                                <div className="report-details-second">
                                    <p>Description</p>
                                    <input
                                        id="offer-description"
                                        value={offer.story}
                                        onChange={(e) => handleFieldChange('story', e.target.value)}
                                    />
                                    <input
                                        id="offer-description"
                                        value={offer.network}
                                        onChange={(e) => handleFieldChange('network', e.target.value)}
                                    />
                                    <input
                                        id="offer-description"
                                        value={offer.followers}
                                        onChange={(e) => handleFieldChange('followers', e.target.value)}
                                    />
                                </div>
                                <div className="report-details-third">
                                    <p>Price</p>
                                    {selectedOffersGenres.length === 0 ? (
                                        <input
                                            style={{margin: '0 auto', width: '100px'}}
                                            id="offer-name-price"
                                            value={offer.price}
                                            onChange={(e) => handleFieldChange('price', e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            style={{margin: '0 auto', width: '100px'}}
                                            id="offer-name-price"
                                            value={priceForOfferWithGenre}
                                            onChange={(e) => setPriceForOfferWithGenre(e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>

                            <AdminEditOfferTable selectedInfluencers={selectedInfluencers}
                                                 setSelectedInfluencers={setSelectedInfluencers}
                                                 influencers={filteredInfluencers}
                                                 selectedOffersGenres={selectedOffersGenres}/>
                        </div>
                    </div>
                ) : <Loading/>}
            </div>
        </section>
    )
};

export default AdminEditNewOffer;