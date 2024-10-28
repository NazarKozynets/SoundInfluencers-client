import React, {useEffect, useState} from "react";
import editImg from "../../../../../../images/icons/edit 1.svg";
import deleteImg from "../../../../../../images/icons/adminPanel/campaignManagement/close 8.svg";
import copyImg from "../../../../../../images/icons/adminPanel/offers/duplicate 1.svg";
import leftImg from "../../../../../../images/icons/adminPanel/offers/Chevron left.svg";
import rightImg from "../../../../../../images/icons/adminPanel/offers/Chevron right.svg";
import axios from "axios";
import plusImg from "../../../../../../images/icons/plus 2.svg";
import {useDispatch} from "react-redux";
import {removeFromDeletedOffers} from "../../../../../../redux/slice/admin-offers";

const AdminDeletedOffers = ({
                                offers,
                                selectedOffersGenres,
                                influencers,
                                setData,
                                setIsDeletedOffersOpen,
                                setOffers
                            }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const offersPerPage = 4;
    const [tempOffers, setTempOffers] = useState([]);

    useEffect(() => {
        setTempOffers(
            offers
                .map((offer) => {
                    const matchingStyle = offer.musicStyles?.find((style) => {
                        const styleGenres = style.genres;
                        return (
                            selectedOffersGenres.every((genre) => styleGenres.includes(genre)) &&
                            styleGenres.length === selectedOffersGenres.length
                        );
                    });

                    const price = matchingStyle ? matchingStyle.price : offer.price;
                    const influencersForOffer = matchingStyle ? matchingStyle.connectInfluencer : offer.connectInfluencer;

                    return {
                        ...offer,
                        priceForOffer: price,
                        influencersForOffer: influencersForOffer,
                    };
                })
                .filter((offer) => offer.influencersForOffer !== null)
        );
    }, [offers]);

    useEffect(() => {
        if (offers && offers.length > 0) {
            setTotalPages(Math.ceil(tempOffers.length / offersPerPage));
        } else {
            setTotalPages(0);
        }
    }, [tempOffers]);

    useEffect(() => {
        setCurrentSlide(0);
    }, [selectedOffersGenres]);

    const dispatch = useDispatch();

    const changeSlide = (direction) => {
        if (direction === "left") {
            setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
        } else if (direction === "right") {
            setCurrentSlide((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
        }
    };

    const currentOffers = tempOffers.slice(
        currentSlide * offersPerPage,
        currentSlide * offersPerPage + offersPerPage
    );

    const getInfluencerAvatar = (influencers, username) => {
        const insta = influencers?.find(insta => insta?.instagramUsername === username);
        return insta ? insta.logo : null;
    };

    const deleteOfferPermanently = async (offer) => {
        try {
            const result = await axios.put(`${process.env.REACT_APP_SERVER}/admin/offers/delete-from-temp/${offer._id}`,)
            dispatch(removeFromDeletedOffers(offer));
            setOffers((prevOffers) => prevOffers.filter((item) => item._id !== offer._id));
        } catch (error) {
            console.error('Error occurred while deleting offer:', error);
        }
    };

    const restoreOffer = async (offer) => {
        try {
            let result;

            if (offer.isNew) {
                result = await axios.put(`${process.env.REACT_APP_SERVER}/admin/offers/return-from-deleted`, {
                    _id: offer._id,
                    id: offer.id,
                    price: offer.price,
                    followers: offer.followers,
                    network: offer.network,
                    story: offer.story,
                    maxInfluencer: offer.maxInfluencer,
                    connectInfluencer: offer.connectInfluencer,
                    musicStyles: offer.musicStyles,
                    wasPublished: false,
                });
            } else {
                result = await axios.put(`${process.env.REACT_APP_SERVER}/admin/offers/return-from-deleted`, {
                    _id: offer._id,
                    id: offer.id,
                    price: offer.price,
                    followers: offer.followers,
                    network: offer.network,
                    story: offer.story,
                    maxInfluencer: offer.maxInfluencer,
                    connectInfluencer: offer.connectInfluencer,
                    musicStyles: offer.musicStyles,
                    wasPublished: true,
                });
            }

            setOffers((prevOffers) => prevOffers.filter((item) => item._id !== offer._id));
            setData((prevData) => [...prevData, offer]);
            dispatch(removeFromDeletedOffers(offer));
        } catch (error) {
            console.error('Error occurred while restoring offer:', error);
        }
    }

    return (
        <div>
            <div className="admin-deleted-offers">
                <button className="admin-offers-list-left-button" onClick={() => changeSlide("left")}>
                    <img src={leftImg} alt={'left'}/>
                </button>

                {currentOffers?.map((offer, index) => (
                    <div className="admin-container-offer">
                        <div className="admin-container-offer-buttons">
                            <button onClick={() => restoreOffer(offer)}>
                                <img src={plusImg} alt={'plus'}/>
                            </button>
                            <button onClick={() => deleteOfferPermanently(offer)}>
                                <img src={deleteImg} alt={'delete'}/>
                            </button>
                        </div>
                        <div className="admin-offer">
                            <div className="admin-offer-body">
                                <h3>IG {offer?.id}M</h3>
                                <p>{offer?.story}</p>
                                <p>{offer?.network}</p>
                                <p>{offer?.followers}</p>

                                <div className="admin-offer-body-influencers">
                                    {offer?.influencersForOffer.map((influencer, index) => {
                                        const avatarUrl = getInfluencerAvatar(influencers, influencer?.instagramUsername);

                                        return (
                                            <div key={index} className="admin-offer-body-influencer">
                                                <img src={avatarUrl} alt=''/>
                                                <p>{influencer?.instagramUsername}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="admin-offer-footer">
                                <h3>{offer.priceForOffer} €</h3>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="admin-offers-list-right-button" onClick={() => changeSlide("right")}>
                    <img src={rightImg} alt={'right'}/>
                </button>
            </div>
            <div className="admin-offers-pagination">
                {Array.from({length: totalPages}).map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}

export default AdminDeletedOffers;