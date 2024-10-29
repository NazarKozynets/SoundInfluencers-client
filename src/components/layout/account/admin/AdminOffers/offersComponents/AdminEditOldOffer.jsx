import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentWindow, setIsNew, setNewOffer} from "../../../../../../redux/slice/admin-offers";
import backBtn from "../../../../../../images/icons/arrow.svg";
import TitleSection from "../../../../../TitleSection";
import AdminEditOfferTable from "./AdminEditOfferTable";
import saveImg from "../../../../../../images/icons/save 1.svg";
import OffersTableFilters from "../../form/offers/filters-table/OffersTableFilters";
import GenreButtonList from "../../../../../form/GenreButton/GenreButtonList";
import axios from "axios";

const AdminEditOldOffer = ({influencers}) => {
    const offer = useSelector((state) => state.adminOffers.newOffer);
    const [filteredInfluencers, setFilteredInfluencers] = useState(influencers);
    const [selectedOffersGenres, setSelectedOffersGenres] = useState([]);
    const [selectedInfluencers, setSelectedInfluencers] = useState(offer.connectInfluencer ? offer.connectInfluencer : []);

    const dispatch = useDispatch();

    useEffect(() => {
        const musicStyle = offer.musicStyles.find((item) => item.genres[0] === selectedOffersGenres[0]);
        if (musicStyle) {
            setSelectedInfluencers(musicStyle.connectInfluencer);
        }
        
    }, [selectedOffersGenres]);

    useEffect(() => {
        if (selectedOffersGenres.length === 0) {
            if (selectedInfluencers !== offer.connectInfluencer) {
                const updatedOffer = {
                    ...offer,
                    connectInfluencer: selectedInfluencers,
                };
                dispatch(setNewOffer(updatedOffer));
            }
        } else {
            const musicStyle = offer.musicStyles.find((item) => item.genres[0] === selectedOffersGenres[0]);
            if (musicStyle) {
                if (selectedInfluencers !== musicStyle.connectInfluencer) {
                    const updatedOffer = {
                        ...offer,
                        musicStyles: offer.musicStyles.map((item) => {
                            if (item === musicStyle) {
                                return {
                                    ...musicStyle,
                                    connectInfluencer: selectedInfluencers,
                                };
                            }
                            return item;
                        }),
                    };
                    dispatch(setNewOffer(updatedOffer));
                }
            }
        }
    }, [selectedInfluencers]);

    const handleFieldChange = (field, value) => {
        const updatedOffer = {
            ...offer,
            [field]: value,
        };
        dispatch(setNewOffer(updatedOffer));
    };

    const handlePriceChangeWithGenre = (field, value) => {
        const musicStyle = offer.musicStyles.find((item) => selectedOffersGenres.includes(item.genres[0]));

        if (musicStyle) {
            const updatedOffer = {
                ...offer,
                musicStyles: offer.musicStyles.map((item) => {
                    if (item === musicStyle) {
                        return {
                            ...musicStyle,
                            [field]: value,
                        };
                    }
                    return item;
                }),
            };
            dispatch(setNewOffer(updatedOffer));
        } else {
            const updatedOffer = {
                ...offer,
                musicStyles: [
                    ...offer.musicStyles,
                    {
                        genres: selectedOffersGenres,
                        price: value,
                        connectInfluencer: selectedInfluencers,
                    },
                ],
            };
            dispatch(setNewOffer(updatedOffer));
        }
    };
    
    const updateOffer = async () => {
        try {
            const result = await axios.put(`${process.env.REACT_APP_SERVER}/admin/offers/update`, {
                _id: offer._id,
                id: offer.id,
                price: offer.price,
                followers: offer.followers,
                network: offer.network,
                story: offer.story,
                maxInfluencer: offer.maxInfluencer,
                connectInfluencer: selectedInfluencers,
                musicStyles: offer.musicStyles,
                isDeleted: false,
                isNew: true,
                isUpdated: true,
            })
            
            console.log(result);
            
            if (result.status === 200) {
                dispatch(setIsNew(false));
                dispatch(setCurrentWindow(0));
            }
        } catch (e) {
            console.log(e);   
        }
    }

    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => {
                        setIsNew(false)
                        dispatch(setCurrentWindow(0))
                    }}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title='Offers' span='design'/>
                    <button id='third-button' onClick={() => updateOffer()}>
                        <img src={saveImg} alt='save'/>
                        <span>SAVE</span>
                    </button>
                </div>

                <div className="select-offer-genre" style={{marginTop: 50}}>
                    <TitleSection title='Select genre'/>
                    <GenreButtonList setSelectedOffersGenres={setSelectedOffersGenres}/>
                </div>

                {filteredInfluencers.length > 0 && (
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
                                            onChange={(e) => handleFieldChange('price', e.target.value.replace(/[^0-9.]/g, ''))}
                                        />
                                    ) : (
                                        (() => {
                                            const musicStyle = offer.musicStyles.find((musicStyle) =>
                                                selectedOffersGenres.includes(musicStyle.genres[0])
                                            );

                                            if (musicStyle) {
                                                return (
                                                    <input
                                                        style={{ margin: '0 auto', width: '100px' }}
                                                        id="offer-name-price"
                                                        value={musicStyle.price}
                                                        onChange={(e) => handlePriceChangeWithGenre('price', e.target.value.replace(/[^0-9.]/g, ''))}
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <input
                                                        style={{ margin: '0 auto', width: '100px' }}
                                                        id="offer-name-price"
                                                        value={0}
                                                        onChange={(e) => handlePriceChangeWithGenre('price', e.target.value.replace(/[^0-9.]/g, ''))}
                                                    />
                                                );
                                            }
                                        })()
                                    )}
                                </div>
                            </div>

                            <AdminEditOfferTable selectedInfluencers={selectedInfluencers}
                                                 setSelectedInfluencers={setSelectedInfluencers}
                                                 influencers={filteredInfluencers}
                                                 selectedOffersGenres={selectedOffersGenres}/>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
};

export default AdminEditOldOffer;