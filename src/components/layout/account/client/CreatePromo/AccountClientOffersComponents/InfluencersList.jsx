import React, {useEffect, useState} from "react";
import ImageWithFallback from "../../../../../ImageWithFallback";
import altLogo from "../../../../../../images/alt-logo.jpg";
import instagram from "../../../../../../images/icons/instagram.svg";
import {calculatePriceForOffersAndInfluencers, doublePrice, calculatePricePerFollower} from "../../../../../../utils/price";
import {useSelector} from "react-redux";

const InfluencersList = ({influencers, activeIndices, setActiveIndices, selectInfluencer, isSearch}) => {
    const [flippedAccountIndex, setFlippedAccountIndex] = useState(null);

    const currentCurrency = useSelector((state) => state.createPromo.data.currency);

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
        const technoSubgenres = ["Hard, Peak", "Melodic, Minimal"];
        const houseSubgenres = ["Tech House", "Melodic, Afro"];

        const isTechnoInStyle = musicStyle === "Techno";
        const isHouseInStyle = musicStyle === "House";

        const isTechnoInOther = musicStyleOther && musicStyleOther.includes("Techno");
        const isHouseInOther = musicStyleOther && musicStyleOther.includes("House");

        const hasTechnoSubgenres = musicSubStyles && musicSubStyles.some(subgenre => technoSubgenres.includes(subgenre));
        const hasHouseSubgenres = musicSubStyles && musicSubStyles.some(subgenre => houseSubgenres.includes(subgenre));

        if (musicSubStyles && (isTechnoInStyle || isTechnoInOther)) {
            if (hasTechnoSubgenres) {
                const allSubgenresPresent = technoSubgenres.every(subgenre => musicSubStyles.includes(subgenre));
                return `Techno${allSubgenresPresent ? " (All)" : ""}`;
            }
            return "Techno";
        }

        if (musicSubStyles && (isHouseInStyle || isHouseInOther)) {
            if (hasHouseSubgenres) {
                const allSubgenresPresent = houseSubgenres.every(subgenre => musicSubStyles.includes(subgenre));
                return `House${allSubgenresPresent ? " (All)" : ""}`;
            }
            return "House";
        }

        return musicStyle;
    };
    const handleSeeMoreClick = (index) => {
        setFlippedAccountIndex(index === flippedAccountIndex ? null : index);
    };

    return (
        <div>
            {isSearch ? (
                <ul className="account-client-choose-list">
                        <li
                            key={influencers.index}
                            className={`account-client-choose-item ${influencers.connect ? "connect" : ""} ${activeIndices.includes(influencers.index) && !influencers.connect ? 'active' : ''} ${flippedAccountIndex === influencers.index ? 'flipped' : ''}`}
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
                                className={`account-client-choose-item-content ${influencers.connect ? "connect" : ""} ${activeIndices.includes(influencers.index) && !influencers.connect ? 'active' : ''} ${flippedAccountIndex === influencers.index ? 'flipped' : ''}`}>
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
                                        <p>PRICE<span>{calculatePriceForOffersAndInfluencers(doublePrice(influencers.price), currentCurrency)}{currentCurrency}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="account-client-choose-item-content-third-container">
                                {flippedAccountIndex !== influencers.index && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSeeMoreClick(influencers.index);
                                        }}
                                        className="see-more-button"
                                    >See More</button>
                                )}
                            </div>

                            {flippedAccountIndex === influencers.index && (
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
                                                    {influencers.musicStyle && influencers.musicSubStyles && (
                                                        <li>{getDisplayGenre(influencers.musicSubStyles, influencers.musicStyle, influencers.musicStyleOther)}</li>
                                                    )}
                                                    {influencers.musicStyleOther && influencers.musicStyleOther.map((genre, index) => (
                                                        <li key={index}>
                                                            {influencers.musicSubStyles && (genre === "Techno" || genre === "House") ? (
                                                                getDisplayGenre(influencers.musicSubStyles, genre, influencers.musicStyleOther)
                                                            ) : (genre)}
                                                        </li>
                                                    ))}
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
                        className={`account-client-choose-item ${item.connect ? "connect" : ""} ${activeIndices.includes(index) && !item.connect ? 'active' : ''} ${flippedAccountIndex === index ? 'flipped' : ''}`}
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
                            className={`account-client-choose-item-content ${item.connect ? "connect" : ""} ${activeIndices.includes(index) && !item.connect ? 'active' : ''} ${flippedAccountIndex === index ? 'flipped' : ''}`}>
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
                                    <p>PRICE<span>{calculatePriceForOffersAndInfluencers(doublePrice(item.price), currentCurrency)}{currentCurrency}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="account-client-choose-item-content-third-container">
                            {flippedAccountIndex !== index && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSeeMoreClick(index);
                                    }}
                                    className="see-more-button"
                                >See More</button>
                            )}
                        </div>

                        {flippedAccountIndex === index && (
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
                                                {item.musicStyle && item.musicSubStyles && (
                                                    <li>{getDisplayGenre(item.musicSubStyles, item.musicStyle, item.musicStyleOther)}</li>
                                                )}
                                                {item.musicStyleOther && item.musicStyleOther.map((genre, index) => (
                                                    <li key={index}>
                                                        {item.musicSubStyles && (genre === "Techno" || genre === "House") ? (
                                                            getDisplayGenre(item.musicSubStyles, genre, item.musicStyleOther)
                                                        ) : (genre)}
                                                    </li>
                                                ))}
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