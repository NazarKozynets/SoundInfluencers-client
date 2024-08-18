import react, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Autoplay, Navigation, Pagination, Scrollbar} from "swiper/modules";
import React from "react";
import {useSelector} from "react-redux";
import GenreButtonList from "../../../../../form/GenreButton/GenreButtonList";
import {calculatePriceForOffersAndInfluencers} from "../../../../../../utils/price";

const OffersList = ({prices, selectPrice}) => {
    const [selectedOffersGenres, setSelectedOffersGenres] = useState([]);
    const [filteredOffersByGenres, setFilteredOffersByGenres] = useState(prices);

    const currentPrice = useSelector((state) => state.createPromo.data.selectPrice.variant);
    const currentCurrency = useSelector((state) => state.createPromo.data.currency);
    
    useEffect(() => {
        if (selectedOffersGenres.length === 0) {
            setFilteredOffersByGenres(prices);
            return;
        }

        const filtered = prices.filter(offer => {
            return offer.musicStyles.some(style => {
                const styleGenres = style.genres;
                return selectedOffersGenres.every(genre => styleGenres.includes(genre)) &&
                    styleGenres.length === selectedOffersGenres.length;
            });
        });

        setFilteredOffersByGenres(filtered);
    }, [selectedOffersGenres, prices]);

    const handleOffersGenreSelect = (genres) => {
        setSelectedOffersGenres(genres);
    };
    
    return (
        <div className="account-client-offers">
            <div className="genre-swiper-container">
                <GenreButtonList onGenreSelect={handleOffersGenreSelect}/>
                <div className="swiper-div">
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        pagination={{
                            enabled: true, bulletElement: "button", clickable: true, dynamicBullets: true,
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1400: {
                                slidesPerView: 3,
                            },
                            1600: {
                                slidesPerView: 4,
                            },
                            1800: {
                                slidesPerView: 4,
                            }
                        }}
                        // style={{
                        //     padding: "30px 0 180px 0",
                        //     "--swiper-navigation-size": "80px",
                        //     "--swiper-navigation-top-offset": "40%",
                        //     overflow: "hidden"
                        // }}
                    >
                        {filteredOffersByGenres.sort((a, b) => {
                            const extractNumber = (id) => parseInt(String(id).match(/\d+/)[0], 10);
                            return extractNumber(a.id) - extractNumber(b.id);
                        }).map((item) => {
                            const matchingStyle = item.musicStyles.find(style => {
                                const styleGenres = style.genres;
                                return selectedOffersGenres.every(genre => styleGenres.includes(genre)) &&
                                    styleGenres.length === selectedOffersGenres.length;
                            });

                            const price = matchingStyle ? matchingStyle.price : item.price;

                            return (
                                <SwiperSlide key={item.id}>
                                    <li
                                        key={item.id}
                                        className={`account-client-offers-item ${currentPrice !== 0 ? currentPrice === item.id ? "active" : "not-active" : ""}`}
                                        onClick={() => selectPrice(item.id)}
                                    >
                                        <h3 className="account-client-offers-title">IG {item.id}M</h3>
                                        <p className="account-client-offers-text">{item.story}</p>
                                        <p className="account-client-offers-text">{item.network}</p>
                                        <p className="account-client-offers-text"> {item.followers}</p>
                                        <div className="account-client-offers-block">
                                            <ul className="account-client-offers-text-list">
                                                {item.connectInfluencer.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="account-client-offers-text-item"
                                                        style={{display: "flex", alignItems: "center"}}
                                                    >
                                                        {item.avatar ? (<img
                                                            style={{
                                                                maxWidth: "58px",
                                                                maxHeight: "58px",
                                                                gap: "0px",
                                                                opacity: "0px",
                                                            }}
                                                            src={item.avatar}
                                                            alt={item.instagramUsername}
                                                        />) : null}

                                                        {item.instagramUsername}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            className={`account-client-offers-button ${currentPrice === item.id ? "active" : ""}`}
                                        >
                                            {price != null ? calculatePriceForOffersAndInfluencers(price) : calculatePriceForOffersAndInfluencers(item.price)} {currentCurrency}
                                        </button>
                                    </li>
                                </SwiperSlide>
                            );
                        })}
                        <div className="swiper-button-next">
                        </div>
                        <div className="swiper-button-prev">
                        </div>
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default OffersList;