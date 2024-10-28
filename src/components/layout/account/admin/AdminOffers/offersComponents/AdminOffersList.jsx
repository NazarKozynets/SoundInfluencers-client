import React, {useEffect, useState} from "react";
import plusImg from "../../../../../../images/icons/plus 2.svg";
import AdminOffer from "./AdminOffer";
import leftImg from "../../../../../../images/icons/adminPanel/offers/Chevron left.svg";
import rightImg from "../../../../../../images/icons/adminPanel/offers/Chevron right.svg";
import {useSelector} from "react-redux";

const AdminOffersList = ({offers, selectedOffersGenres, influencers}) => {
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

    return (
        <section className="admin">
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 20}}>
                <div className="admin-offers-list">
                    <button className="admin-offers-list-left-button" onClick={() => changeSlide("left")}>
                        <img src={leftImg} alt={'left'}/>
                    </button>

                    {currentOffers.map((offer, index) => {
                        return <AdminOffer influencers={influencers} key={index} offer={offer} selectedOffersGenres={selectedOffersGenres}/>
                    })}

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
        </section>
    );
}

export default AdminOffersList;
