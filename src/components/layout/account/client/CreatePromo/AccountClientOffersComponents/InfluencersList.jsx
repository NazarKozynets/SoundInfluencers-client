import React, {useEffect, useState} from "react";
import ImageWithFallback from "../../../../../ImageWithFallback";
import altLogo from "../../../../../../images/alt-logo.jpg";
import instagram from "../../../../../../images/icons/instagram.svg";
import {
    calculatePriceForOffersAndInfluencers,
    doublePrice,
    calculatePricePerFollower
} from "../../../../../../utils/price";
import {useSelector} from "react-redux";
import genres from "../../../../../form/Offers/OffersMenu/Genres/Genres";

const InfluencersList = ({influencers, activeIndices, setActiveIndices, selectInfluencer, isSearch}) => {
    const [flippedAccountIndeces, setFlippedAccountIndeces] = useState([]);

    const currentCurrency = useSelector((state) => state.createPromo.data.currency);

    const selectInfluencers = useSelector((state) => state.createPromo.data.selectInfluencers);

    useEffect(() => {
        setFlippedAccountIndeces([]);
        setActiveIndices([]);
    }, [influencers])

    const formatFollowersNumber = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number;
        }
    };
    const getDisplayGenre = (musicSubStyles, musicStyle, musicStyleOther) => {
        let result = [];

        const technoSubgenres = ["Hard, Peak", "Melodic, Minimal"];
        const houseSubgenres = ["Tech House", "Melodic, Afro"];

        const isMusicStyleTechno = musicStyle === "Techno";
        const isMusicStyleHouse = musicStyle === "House";

        if (!isMusicStyleTechno && !isMusicStyleHouse) {
            result.push(musicStyle);
        }

        if (isMusicStyleTechno && musicSubStyles.length > 0) {
            const matchedTechnoSubgenres = musicSubStyles.filter(subStyle => technoSubgenres.includes(subStyle));

            if (matchedTechnoSubgenres.length === technoSubgenres.length) {
                result.push("Techno (All)");
            } else if (matchedTechnoSubgenres.length === 1) {
                const subStyle = matchedTechnoSubgenres[0];
                if (subStyle === "Hard, Peak") {
                    result.push("Techno (Hard Peak)");
                }
                if (subStyle === "Melodic, Minimal") {
                    result.push("Techno (Melodic Minimal)");
                }
            }
        }

        if (isMusicStyleHouse && musicSubStyles.length > 0) {
            const matchedHouseSubgenres = musicSubStyles.filter(subStyle => houseSubgenres.includes(subStyle));

            if (matchedHouseSubgenres.length === houseSubgenres.length) {
                result.push("House (All)");
            } else if (matchedHouseSubgenres.length === 1) {
                const subStyle = matchedHouseSubgenres[0];
                if (subStyle === "Tech House") {
                    result.push("House (Tech House)");
                }
                if (subStyle === "Melodic, Afro") {
                    result.push("House (Melodic Afro)");
                }
            }
        }

        if (musicStyleOther && musicStyleOther.length > 0) {
            musicStyleOther.forEach(genre => {
                    if (genres[genre]) {
                        result.push(genres[genre]);
                    } else {
                        result.push(genre);
                    }
                }
            );
        }
        
        if (result.length > 5) {
            result = result.slice(0, 5);
        }
        return result.length > 0 ? result.map((genre, index) => <li key={index}>{genre}</li>) : <li>N/A</li>;
    };

    const handleSeeMoreClick = (index) => {
        if (flippedAccountIndeces.includes(index)) {
            setFlippedAccountIndeces(prevIndices => prevIndices.filter(i => i !== index));
        } else {
            setFlippedAccountIndeces(prevIndices => [...prevIndices, index]);
        }
    };

    useEffect(() => {
        console.log("influencers", influencers);
    }, [influencers]);
    
    return (
        <div>
            {isSearch ? (
                <ul className="account-client-choose-list">
                    <li
                        key={influencers.index}
                        className={`account-client-choose-item ${influencers.connect ? "connect" : ""} ${activeIndices.includes(influencers.index) ? 'active' : ''} ${flippedAccountIndeces.includes(influencers.index) ? 'flipped' : ''}`}
                        onClick={() => {
                            if (!influencers.connect) {
                                setActiveIndices(prevIndices =>
                                    prevIndices.includes(influencers.index)
                                        ? prevIndices.filter(i => i !== influencers.index)
                                        : [...prevIndices, influencers.index]
                                );
                                selectInfluencer(influencers.instagramUsername);
                            }
                        }}
                    >
                        {influencers.connect && (
                            <div className="account-client-choose-item-connect">
                                <p className="account-client-choose-item-connect-text">
                                    {influencers.connect_text}
                                </p>
                            </div>
                        )}
                        <div
                            className={`account-client-choose-item-content ${influencers.connect ? "connect" : ""} ${activeIndices.includes(influencers.index) && !influencers.connect ? 'active' : ''} ${flippedAccountIndeces.includes(influencers.index) ? 'flipped' : ''}`}>
                            <ImageWithFallback
                                src={influencers.logo}
                                fallbackSrc={altLogo}
                                className="account-client-choose-item-image"
                            />
                            <p className="account-client-choose-item-content-username">
                                {influencers.instagramUsername}
                            </p>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                            justifyContent: "center"
                        }}>
                            <div className="account-client-choose-item-content-second-container">
                                <div className="account-client-choose-item-content-second-container-left-part">
                                <span className="account-client-choose-item-content-icon-container">
                                    <img className="account-client-choose-item-content-icon" src={instagram}
                                         style={{paddingBottom: 0, pointerEvents: "none"}}/>
                                </span>
                                    <p className="account-client-choose-item-content-text">
                                        {formatFollowersNumber(influencers.followersNumber)}
                                    </p>
                                </div>
                                <div className="account-client-choose-item-content-price">
                                    <p>PRICE<span>{calculatePriceForOffersAndInfluencers(influencers.publicPrice, currentCurrency)}{currentCurrency}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="account-client-choose-item-content-third-container">
                            {!flippedAccountIndeces.includes(influencers.index) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSeeMoreClick(influencers.index);
                                    }}
                                    className="see-more-button"
                                >See More</button>
                            )}
                        </div>

                        {flippedAccountIndeces.includes(influencers.index) && (
                            <div
                                className={`account-client-choose-item-expanded-content ${influencers.connect ? 'connect' : ''} ${activeIndices.includes(influencers.index) ? 'active' : ''}`}>
                                <div
                                    className={`account-client-choose-item-back show ${influencers.connect ? 'connect' : ''} ${activeIndices.includes(influencers.index) ? 'active' : ''}`}>
                                    <div className="account-client-choose-item-horizontal-line">
                                        <div className="account-client-choose-item-back-left-side">
                                        <span
                                            className="account-client-choose-item-back-countries-title">Countries</span>
                                            <ul className="account-client-choose-item-back-left-side-countries">
                                                {influencers && influencers.countries && Array.isArray(influencers.countries) && influencers.countries.length > 0 ? (
                                                    influencers.countries.map((country, index) => (
                                                        <li key={index}
                                                            className="account-client-choose-item-back-left-side-country-percentage">
                                                            <span className="country-name">{country.country}</span>
                                                            <span
                                                                className="country-percentage">{country.percentage}%</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No countries available</li>
                                                )}
                                            </ul>
                                        </div>
                                        <div className="account-client-choose-item-back-right-side">
                                        <span
                                            className="account-client-choose-item-back-genres-title">Genres</span>
                                            <ul className="account-client-choose-item-back-right-side-genres">
                                                {getDisplayGenre(influencers.musicSubStyles, influencers.musicStyle, influencers.musicStyleOther)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSeeMoreClick(influencers.index);
                                    }}
                                    className="see-less-button"
                                >See Less
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            ) : <ul className="account-client-choose-list">
                {influencers.map((item, index) => (
                    <li
                        key={index}
                        className={`account-client-choose-item 
        ${item.connect ? 'connect' : ''} 
        ${item.active ? 'active' : ''} 
        ${flippedAccountIndeces.includes(index) ? 'flipped' : ''}`}
                        onClick={() => {
                            if (!item.connect) {
                                setActiveIndices(prevIndices =>
                                    prevIndices.includes(index)
                                        ? prevIndices.filter(i => i !== index)
                                        : [...prevIndices, index]
                                );
                                selectInfluencer(item.instagramUsername);
                            }
                        }}
                    >
                        {item.connect && (
                            <div className="account-client-choose-item-connect">
                                <p className="account-client-choose-item-connect-text">
                                    {item.connect_text}
                                </p>
                            </div>
                        )}
                        <div
                            className={`account-client-choose-item-content ${item.connect ? "connect" : ""} ${item.active && !item.connect ? 'active' : ''} ${flippedAccountIndeces.includes(index) ? 'flipped' : ''}`}>
                            <ImageWithFallback
                                src={item.logo}
                                fallbackSrc={altLogo}
                                className="account-client-choose-item-image"
                            />
                            <p className="account-client-choose-item-content-username">
                                {item.instagramUsername}
                            </p>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                            justifyContent: "center"
                        }}>
                            <div className="account-client-choose-item-content-second-container">
                                <div className="account-client-choose-item-content-second-container-left-part">
                                <span className="account-client-choose-item-content-icon-container">
                                    <img className="account-client-choose-item-content-icon" src={instagram}
                                         style={{paddingBottom: 0, pointerEvents: "none"}}/>
                                </span>
                                    <p className="account-client-choose-item-content-text">
                                        {formatFollowersNumber(item.followersNumber)}
                                    </p>
                                </div>
                                <div className="account-client-choose-item-content-price">
                                    <p>PRICE<span>{calculatePriceForOffersAndInfluencers(item.publicPrice, currentCurrency)}{currentCurrency}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="account-client-choose-item-content-third-container">
                            {!flippedAccountIndeces.includes(index) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSeeMoreClick(index);
                                    }}
                                    className="see-more-button"
                                >See More</button>
                            )}
                        </div>

                        {flippedAccountIndeces.includes(index) && (
                            <div
                                className={`account-client-choose-item-expanded-content ${item.connect ? 'connect' : ''} ${activeIndices.includes(index) ? 'active' : ''}`}>
                                <div
                                    className={`account-client-choose-item-back show ${item.connect ? 'connect' : ''} ${activeIndices.includes(index) ? 'active' : ''}`}>
                                    <div className="account-client-choose-item-horizontal-line">
                                        <div className="account-client-choose-item-back-left-side">
                                        <span
                                            className="account-client-choose-item-back-countries-title">Countries</span>
                                            <ul className="account-client-choose-item-back-left-side-countries">
                                                {item && item.countries && Array.isArray(item.countries) && item.countries.length > 0 ? (
                                                    item.countries.map((country, index) => (
                                                        <li key={index}
                                                            className="account-client-choose-item-back-left-side-country-percentage">
                                                            <span className="country-name">{country.country}</span>
                                                            <span
                                                                className="country-percentage">{country.percentage}%</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No countries available</li>
                                                )}
                                            </ul>
                                        </div>
                                        <div className="account-client-choose-item-back-right-side">
                                        <span
                                            className="account-client-choose-item-back-genres-title">Genres</span>
                                            <ul className="account-client-choose-item-back-right-side-genres">
                                                {getDisplayGenre(item.musicSubStyles, item.musicStyle, item.musicStyleOther)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSeeMoreClick(index);
                                    }}
                                    className="see-less-button"
                                >See Less
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>}
        </div>
    );
}

export default InfluencersList;