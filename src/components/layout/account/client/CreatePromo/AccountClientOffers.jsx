import React, {useEffect, useState} from "react";
import TitleSection from "../../../../TitleSection";
import choose1 from "../../../../../images/gentleman.png";
import instagram from "../../../../../images/icons/instagram.svg";
import axios from "axios";
import StandardButton from "../../../../form/StandardButton";
import {useDispatch, useSelector} from "react-redux";
import {
    setCurrentWindow, setSelectAmount, setSelectInfluencer, setSelectPrice,
} from "../../../../../redux/slice/create-promo";
import ImageWithFallback from "../../../../ImageWithFallback";
import altLogo from "../../../../../images/alt-logo.jpg";
import {Swiper, SwiperSlide} from "swiper/react";
import {
    A11y, Autoplay, Navigation, Pagination, Scrollbar,
} from "swiper/modules";
import GenreButtonList from "../../../../form/GenreButton/GenreButtonList";
import {useNavigate} from "react-router-dom";
import OffersMenu from "../../../../form/Offers/OffersMenu/OffersMenu";
import OffersSearchBar from "../../../../form/Offers/OffersSearchBar/OffersSearchBar/OffersSearchBar";
import offersSortMenu from "../../../../form/Offers/OffersSortMenu/OffersSortMenu";
import OffersSortMenu from "../../../../form/Offers/OffersSortMenu/OffersSortMenu";
import OffersBudgetSelect from "../../../../form/Offers/OffersBudgetSelect/OffersBudgetSelect";
import arrow from "../../../../../images/icons/arrow.svg";
import OffersSearch from "../../../../form/Offers/OffersSearchBar/OffersSearch";

const AccountClientOffers = () => {
    const navigation = useNavigate();
    const [prices, setPrices] = useState([]);
    const dispatch = useDispatch();
    const [influencers, setInfluencers] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false)
    const [flippedAccountIndex, setFlippedAccountIndex] = useState(null);
    const [activeIndices, setActiveIndices] = useState([]);
    const [filteredInfluencers, setFilteredInfluencers] = useState(influencers);
    const [checkedGenres, setCheckedGenres] = useState({});
    const [budget, setBudget] = useState(10000000);
    const [filteredInfluencersByGenres, setFilteredInfluencersByGenres] = useState([]);
    const [sortMethod, setSortMethod] = useState('Best Match');
    const [searchResult, setSearchResult] = useState(null);

    const currentPrice = useSelector((state) => state.createPromo.data.selectPrice.variant);

    const dataForm = useSelector((state) => state.createPromo.data);

    const customAmount = useSelector((state) => state.createPromo.data.selectPrice.amount);

    const customePrice = useSelector((state) => state.createPromo.data.selectPrice.price);

    const selectInfluencers = useSelector((state) => state.createPromo.data.selectInfluencers);

    const selectPrice = (id) => {
        let balance = window.sessionStorage.getItem("balance");

        const searchPrice = prices.find((item) => item.id === id);

        const updateList = influencers.map((item, index) => {
            if (searchPrice.connectInfluencer.find((fin) => fin.influencerId === item._id && fin.instagramUsername === item.instagramUsername)) {
                return {
                    ...item, active: true, connect: true, connect_text: `Offer ${searchPrice.id}`,
                };
            } else {
                if (item.active && item.connect) {
                    return {
                        ...item, active: false, connect: false,
                    };
                }
                return {
                    ...item,
                };
            }
        });

        const filterInfluencers = searchPrice.connectInfluencer.map((item) => ({
            influencerId: item.influencerId, confirmation: "wait", instagramUsername: item.instagramUsername,
        }));

        if (selectInfluencers.length !== 0) {
            const currentSelectInfluencers = selectInfluencers.map((item) => ({
                influencerId: item.influencerId, confirmation: "wait", instagramUsername: item.instagramUsername,
            }));
            const filterCurrentSelectInfluencer = [];
            const mass = [...filterInfluencers].forEach((item) => {
                const checkUnion = filterCurrentSelectInfluencer.find((fin) => fin.instagramUsername === item.instagramUsername);

                if (!checkUnion) {
                    filterCurrentSelectInfluencer.push(item);
                }
            });
            dispatch(setSelectInfluencer(filterCurrentSelectInfluencer));
        } else {
            dispatch(setSelectInfluencer(filterInfluencers));
        }
        setInfluencers(updateList);

        if (currentPrice === id) {
            const checkInfluencers = influencers.map((item) => {
                if (item.connect) {
                    return {
                        ...item, connect: false, active: false,
                    };
                } else {
                    return {
                        ...item,
                    };
                }
            });

            setInfluencers(checkInfluencers);

            const currentSelectInfluencers = influencers.filter((item) => !item.connect && item.active);

            const totalSelectInfluencers = currentSelectInfluencers.map((item) => ({
                influencerId: item._id, confirmation: "wait", instagramUsername: item.instagramUsername,
            }));
            dispatch(setSelectInfluencer(totalSelectInfluencers));
            let newPrice = influencers.reduce((acc, current) => {
                if (!current.price) return acc;
                let price = current.price.replace(/\D/g, "");

                if (current.customPrice) {
                    price = current.customPrice;
                }

                if (current.active) {
                    if (!current.connect) {
                        return acc + Number(price) * 2;
                    } else {
                        return acc;
                    }
                } else {
                    return acc;
                }
            }, 0);

            dispatch(setSelectPrice({
                variant: 0, price: 0 + newPrice
            }));
            return;
        }

        if (customePrice !== 0) {
            const newPrice = influencers.reduce((acc, current) => {
                if (!current.price) return acc;
                let price = current.price.replace(/\D/g, "");

                if (current.customPrice) {
                    price = current.customPrice;
                }


                const checkConnect = (() => {
                    const searchPrice = prices.find((item) => item.id === id);
                    if (!searchPrice) return false;
                    return searchPrice.connectInfluencer.find((item) => item.influencerId === current._id && item.instagramUsername === current.instagramUsername);
                })();

                if (checkConnect) return acc;

                if (current.active) {
                    if (!current.connect) {
                        return acc + Number(price) * 2;
                    } else {
                        return acc;
                    }
                } else {
                    return acc;
                }
            }, 0);

            const priceOffer = prices.find((item) => item.id === id);

            dispatch(setSelectPrice({
                variant: id, price: priceOffer.price + newPrice,
            }));
            return;
        }

        let newPrice = influencers.reduce((acc, current) => {
            if (!current.price) return acc;
            let price = current.price.replace(/\D/g, "");

            if (current.customPrice) {
                price = current.customPrice;
            }

            if (current.active) {
                if (!current.connect) {
                    if (currentPrice !== 0) {
                        return acc + Number(price) * 2;
                    } else {
                        return acc + Number(price) * 2;
                    }
                } else {
                    return acc;
                }
            } else {
                return acc;
            }
        }, 0);

        const priceOffer = prices.find((item) => item.id === currentPrice);
        let totalOffer = prices.find((item) => item.id === id).price;
        let totalCustomOffer = priceOffer?.price + newPrice;

        dispatch(setSelectAmount(priceOffer ? totalCustomOffer : 0 + newPrice));

        dispatch(setSelectAmount(totalOffer));

        if (totalCustomOffer > balance) totalCustomOffer = totalCustomOffer - balance;
        if (newPrice > balance) newPrice = newPrice - balance;
        if (totalOffer > balance) totalOffer = totalOffer - balance;

        dispatch(setSelectPrice({
            variant: id, price: priceOffer ? totalCustomOffer : 0 + newPrice,
        }));

        dispatch(setSelectPrice({
            variant: id, price: totalOffer,
        }));
    };

    const selectInfluencer = (instagramUsername) => {
        console.log("ok2");
        // dispatch(
        //   setSelectPrice({
        //     variant: 0,
        //     price: 0,
        //   })
        // );
        let balance = window.sessionStorage.getItem("balance");

        const updateList = influencers.map((item) => {
            if (item.instagramUsername === instagramUsername) {
                if (item.active) {
                    return {
                        ...item, active: false, connect: false,
                    };
                }
                return {
                    ...item, active: true, connect: false,
                };
            }

            return item;
        });

        let newPrice = updateList.reduce((acc, current) => {
            if (!current.price) return acc;
            let price = current.price.replace(/\D/g, "");

            if (current.customPrice) {
                price = current.customPrice;
            }

            if (current.active) {
                if (!current.connect) {
                    if (currentPrice !== 0) {
                        return acc + Number(price) * 2;
                    } else {
                        return acc + Number(price) * 2;
                    }
                } else {
                    return acc;
                }
            } else {
                return acc;
            }
        }, 0);

        const priceOffer = prices.find((item) => item.id === currentPrice);

        const filterInfluencers = updateList
            .filter((item) => item.active)
            .map((item) => ({
                influencerId: item._id, instagramUsername: item.instagramUsername, confirmation: "wait",
            }));

        let totalCustomOffer = priceOffer?.price + newPrice;

        dispatch(setSelectAmount(priceOffer ? totalCustomOffer : 0 + newPrice));

        if (totalCustomOffer > balance) totalCustomOffer = totalCustomOffer - balance;
        if (newPrice > balance) newPrice = newPrice - balance;

        dispatch(setSelectPrice({
            variant: currentPrice, price: priceOffer ? totalCustomOffer : 0 + newPrice,
        }));

        dispatch(setSelectInfluencer([...filterInfluencers]));
        setInfluencers(updateList);
    };

    const getData = async () => {
        const result = await axios(`${process.env.REACT_APP_SERVER}/auth/influencers`);

        const offers = await axios(`${process.env.REACT_APP_SERVER}/promos/offers`);

        if (offers.data.code === 200) {
            setPrices(offers.data.offers.sort((a, b) => a.id - a.b));
        }
        if (result.data.code === 200) {
            if (selectInfluencers.length !== 0) {
                const list = result.data.influencers.map((item) => {
                    const findInfluencer = selectInfluencers.find((inf) => inf.influencerId === item._id && inf.instagramUsername === item.instagramUsername);
                    if (findInfluencer) {
                        return {
                            ...item, active: true, connect: false,
                        };
                    }

                    return {
                        ...item, active: false, connect: false,
                    };
                });
                return setInfluencers(list);
            }
            const listInfluencers = result.data.influencers.map((item) => ({
                ...item, active: false, connect: false,
            })).sort((a, b) => {
                // Assign a high order value for items without the order field
                const orderA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
                const orderB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;

                return orderA - orderB;
            });

            setInfluencers(listInfluencers);
        }
    };

    const nextForm = () => {
        if (customePrice === 0 || selectInfluencers.length === 0) return;
        console.log(dataForm, "1 dataForm");
        dispatch(setCurrentWindow(1));
    };

    const createInfList = (score) => {
        const list = [];
        let sum = 0;
        while (sum <= score) {
            sum += 1;
            if (sum > score) break;
            list.push(<li key={sum} className="account-client-offers-text-item">
                Influencer {sum}
            </li>);
        }
        return list;
    };


    const toggleSelectAll = () => {
        let balance = window.sessionStorage.getItem("balance");

        const updateList = influencers.map((item) => {
            return {
                ...item, active: !isSelectAll, connect: false,
            };
        });

        let newPrice = updateList.reduce((acc, current) => {
            if (!current.price) return acc;
            let price = current.price.replace(/\D/g, "");

            if (current.customPrice) {
                price = current.customPrice;
            }

            if (current.active) {
                if (!current.connect) {
                    if (currentPrice !== 0) {
                        return acc + Number(price) * 2;
                    } else {
                        return acc + Number(price) * 2;
                    }
                } else {
                    return acc;
                }
            } else {
                return acc;
            }
        }, 0);

        const priceOffer = prices.find((item) => item.id === currentPrice);

        const filterInfluencers = updateList
            .filter((item) => item.active)
            .map((item) => ({
                influencerId: item._id, instagramUsername: item.instagramUsername, confirmation: "wait",
            }));

        let totalCustomOffer = priceOffer?.price + newPrice;

        dispatch(setSelectAmount(priceOffer ? totalCustomOffer : 0 + newPrice));

        if (totalCustomOffer > balance) totalCustomOffer = totalCustomOffer - balance;
        if (newPrice > balance) newPrice = newPrice - balance;

        dispatch(setSelectPrice({
            variant: currentPrice, price: priceOffer ? totalCustomOffer : 0 + newPrice,
        }));

        dispatch(setSelectInfluencer([...filterInfluencers]));
        setInfluencers(updateList);
        setIsSelectAll(!isSelectAll)
    };

    const formatFollowersNumber = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number;
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleCardClick = (index, isConnect) => {
        if (!isConnect) {
            setActiveIndices(prevIndices =>
                prevIndices.includes(index)
                    ? prevIndices.filter(i => i !== index)
                    : [...prevIndices, index]
            );
        }
        setFlippedAccountIndex(null);
    };

    const handleSeeMoreClick = (index) => {
        setFlippedAccountIndex(index === flippedAccountIndex ? null : index);
    };

    useEffect(() => {
        setFilteredInfluencers(influencers);
    }, [influencers]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [sortMethod, budget, checkedGenres]);

    const applyFiltersAndSort = () => {
        let filtered = [...influencers]; 

        // Применение фильтров
        if (budget) {
            const budgetValue = parseFloat(budget.toString().replace(/[^0-9.]/g, ''));
            if (budgetValue < 10000000) {
                filtered = filtered.filter(item => {
                    const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                    return itemPrice <= budgetValue;
                });
            }
        }

        const selectedGenres = Object.keys(checkedGenres).filter(key => checkedGenres[key]);
        if (selectedGenres.length > 0) {
            filtered = filtered.filter(item => selectedGenres.includes(item.musicStyle));
        }

        switch (sortMethod) {
            case 'Lowest Price':
                filtered.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
                break;
            case 'Highest Price':
                filtered.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
                break;
            case 'Lowest Followers':
                filtered.sort((a, b) => a.followersNumber - b.followersNumber);
                break;
            case 'Highest Followers':
                filtered.sort((a, b) => b.followersNumber - a.followersNumber);
                break;
            case 'Best Match':
                // filtered = [...influencers];
                break;
            default:
                // filtered = [...influencers];
                break;
        }

        setFilteredInfluencers(filtered);
    };

    const handleSortChange = (newSortMethod) => {
        setSortMethod(newSortMethod);
    };

    return (<section className="account-client">
        {/* <div className="container"> */}
        <div className="account-client-block" style={{position: "relative"}}>
            <h1 className="account-client-title">service offered</h1>
            <h2 className="account-client-second">influencers post for clients</h2>

            <TitleSection title="Our" span="offers"/>

            <GenreButtonList prices={prices}/>

            <button
                style={{
                    position: "absolute", top: 0, left: 50, width: 50, height: 50, cursor: "pointer",
                }}
                onClick={() => {
                    navigation("/account/client/list-promo");
                }}
            >
                <img src={arrow} style={{transform: "rotate(180deg)"}}/>
            </button>

            {/* <ul className="account-client-offers"> */}
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
                navigation
                pagination={{
                    enabled: true, bulletElement: "button", clickable: true,
                }}
                breakpoints={{
                    340: {
                        slidesPerView: 1,
                    }, 550: {
                        slidesPerView: 1, spaceBetween: 15,
                    }, 768: {
                        slidesPerView: 2, spaceBetween: 40,
                    }, 992: {
                        slidesPerView: 3, spaceBetween: 30,
                    }, 1200: {
                        slidesPerView: 4, spaceBetween: 30,
                    }, 1400: {
                        slidesPerView: 4, spaceBetween: 40,
                    },
                }}
                onSwiper={(swiper) => console.log(swiper)}
                style={{padding: "30px 20px 180px 20px"}}
            >
                {prices.map((item, index) => (<SwiperSlide key={item.id}>
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
                                {item.connectInfluencer.map((item, index) => (<li
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
                                </li>))}
                            </ul>
                        </div>

                        <button
                            className={`account-client-offers-button ${currentPrice === item.id ? "active" : ""}`}
                        >
                            {item.price} €
                        </button>
                    </li>
                </SwiperSlide>))}
            </Swiper>

            {/* </ul> */}

            <TitleSection title="Pick &" span="choose"/>

            <div className="account-client-container" style={{display: 'flex', flexDirection: 'row', marginTop: 35}}>
                <OffersMenu
                    influencers={influencers}
                    setCheckedGenres={setCheckedGenres}
                    setFilteredInfluencersByGenres={setFilteredInfluencers}
                    applyFilters={applyFiltersAndSort}
                />
                <div className="account-client-container-right-side">
                    <div className="account-client-container-right-side-upper-side">
                        <OffersBudgetSelect
                            budget={budget}
                            setBudget={setBudget}
                            applyFilters={applyFiltersAndSort}
                        />
                        <OffersSearch
                            filteredInfluencers={filteredInfluencers}
                            setSearchResult={setSearchResult}
                        />
                        <OffersSortMenu
                            selectedOption={sortMethod}
                            onSortChange={handleSortChange}
                        />
                    </div>
                    <div className="account-client-choose" style={{flex: 3, marginLeft: '20px'}}>
                        {searchResult ? (
                            <ul className="account-client-choose-list">
                                <li
                                    className={`account-client-choose-item ${searchResult.connect ? "connect" : ""} ${activeIndices.includes(searchResult.index) && !searchResult.connect ? 'active' : ''} ${flippedAccountIndex === searchResult.index ? 'flipped' : ''}`}
                                    onClick={() => handleCardClick(searchResult.index, searchResult.connect)}
                                >
                                    {searchResult.connect && (
                                        <div className="account-client-choose-item-connect">
                                            <p className="account-client-choose-item-connect-text">
                                                {searchResult.connect_text}
                                            </p>
                                        </div>
                                    )}
                                    <div
                                        className={`account-client-choose-item-content ${searchResult.connect ? "connect" : ""} ${activeIndices.includes(searchResult.index) && !searchResult.connect ? 'active' : ''} ${flippedAccountIndex === searchResult.index ? 'flipped' : ''}`}>
                                        <ImageWithFallback
                                            src={searchResult.logo}
                                            fallbackSrc={altLogo}
                                            className="account-client-choose-item-image"
                                        />
                                        <p className="account-client-choose-item-content-username">
                                            {searchResult.instagramUsername}
                                        </p>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0,
                                        justifyContent: "center"
                                    }}>
                                        <div className="account-client-choose-item-content-second-container">
                                            <div
                                                className="account-client-choose-item-content-second-container-left-part">
                                    <span className="account-client-choose-item-content-icon-container">
                                        <img className="account-client-choose-item-content-icon" src={instagram}
                                             style={{paddingBottom: 0, pointerEvents: "none"}}/>
                                    </span>
                                                <p className="account-client-choose-item-content-text">
                                                    {formatFollowersNumber(searchResult.followersNumber)}
                                                </p>
                                            </div>
                                            <div className="account-client-choose-item-content-price">
                                                <p>PRICE<span>{searchResult.price}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="account-client-choose-item-content-third-container">
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            handleSeeMoreClick(searchResult.index);
                                        }}>
                                            {flippedAccountIndex === searchResult.index ? 'See Less' : 'See More'}
                                        </button>
                                    </div>
                                    <div
                                        className={`account-client-choose-item-back ${flippedAccountIndex === searchResult.index ? 'show' : ''}`}>
                                        <div className="account-client-choose-item-back-left-side">
                                            <span>Countries</span>
                                        </div>
                                        <div className="account-client-choose-item-back-right-side">
                                            <span>Genres</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        ) : (
                            <ul className="account-client-choose-list">
                                {filteredInfluencers.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`account-client-choose-item ${item.connect ? "connect" : ""} ${activeIndices.includes(index) && !item.connect ? 'active' : ''} ${flippedAccountIndex === index ? 'flipped' : ''}`}
                                        onClick={() => handleCardClick(index, item.connect)}
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
                                                <div
                                                    className="account-client-choose-item-content-second-container-left-part">
                                        <span className="account-client-choose-item-content-icon-container">
                                            <img className="account-client-choose-item-content-icon" src={instagram}
                                                 style={{paddingBottom: 0, pointerEvents: "none"}}/>
                                        </span>
                                                    <p className="account-client-choose-item-content-text">
                                                        {formatFollowersNumber(item.followersNumber)}
                                                    </p>
                                                </div>
                                                <div className="account-client-choose-item-content-price">
                                                    <p>PRICE<span>{item.price}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="account-client-choose-item-content-third-container">
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                handleSeeMoreClick(index);
                                            }}>
                                                {flippedAccountIndex === index ? 'See Less' : 'See More'}
                                            </button>
                                        </div>
                                        <div
                                            className={`account-client-choose-item-back ${flippedAccountIndex === index ? 'show' : ''}`}>
                                            <div className="account-client-choose-item-back-left-side">
                                                <span>Countries</span>
                                            </div>
                                            <div className="account-client-choose-item-back-right-side">
                                                <span>Genres</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <p className="account-client-choose-total">
                        Total{" "}
                        <span className="account-client-choose-total-span">
        {customePrice} €
      </span>
                    </p>
                </div>
            </div>
        </div>
    </section>);
};

export default AccountClientOffers;
