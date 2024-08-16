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
    const [filteredInfluencersByBudget, setFilteredInfluencersByBudget] = useState([]);
    const [checkedGenres, setCheckedGenres] = useState({});
    const [checkedCountries, setCheckedCountries] = useState({});
    const [budget, setBudget] = useState(10000000);
    const [sortMethod, setSortMethod] = useState('Best Match');
    const [searchResult, setSearchResult] = useState(null);
    const [selectedOffersGenres, setSelectedOffersGenres] = useState([]);
    const [filteredOffersByGenres, setFilteredOffersByGenres] = useState(prices);


    const currentPrice = useSelector((state) => state.createPromo.data.selectPrice.variant);

    const dataForm = useSelector((state) => state.createPromo.data);

    const customAmount = useSelector((state) => state.createPromo.data.selectPrice.amount);

    const customePrice = useSelector((state) => state.createPromo.data.selectPrice.price);

    const selectInfluencers = useSelector((state) => state.createPromo.data.selectInfluencers);

    const currentCurrency = useSelector((state) => state.createPromo.data.currency);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setFilteredInfluencers(influencers);
    }, [influencers]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [sortMethod, checkedGenres]);

    useEffect(() => {
        applyBudgetFilter();
    }, [budget]);

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
        const result = await axios(
            `${process.env.REACT_APP_SERVER}/auth/influencers`
        );

        const offers = await axios(`${process.env.REACT_APP_SERVER}/promos/offers`);

        if (offers.data.code === 200) {
            setPrices(offers.data.offers.sort((a, b) => a.id - a.b));
        }
        if (result.data.code === 200) {
            if (selectInfluencers.length !== 0) {
                const list = result.data.influencers.map((item) => {
                    const findInfluencer = selectInfluencers.find(
                        (inf) =>
                            inf.influencerId === item._id &&
                            inf.instagramUsername === item.instagramUsername
                    );
                    if (findInfluencer) {
                        return {
                            ...item,
                            active: true,
                            connect: false,
                        };
                    }

                    return {
                        ...item,
                        active: false,
                        connect: false,
                    };
                });
                return setInfluencers(list);
            }
            const listInfluencers = result.data.influencers.map((item) => ({
                ...item,
                active: false,
                connect: false,
            })).sort((a, b) => {
                const orderA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
                const orderB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;

                return orderA - orderB;
            });

            // const connectInfluencer = offers.data.offers.flatMap((offer) => offer.connectInfluencer);
            // const influencerIds = [...new Set(connectInfluencer.map((inf) => inf.influencerId))];
            //
            // const influencerPromises = influencerIds.map((id) => axios.get(`${process.env.REACT_APP_SERVER}/auth/influencer/${id}`));
            // const influencerResponses = await Promise.all(influencerPromises);
            //
            // const musicStyles = influencerResponses.flatMap((response) => {
            //     if (response.data.code === 200) {
            //         return response.data.influencer.instagram.map((instagram) => instagram.musicStyle);
            //     }
            //     return [];
            // });
            //
            // const resultObject = {
            //     offerId: offers.data.offers.map((offer) => offer.id),
            //     musicStyles: Array.from(new Set(musicStyles)), 
            // };
            //
            // console.log(resultObject, "resultObject")
            //
            // setOffersInfluencersAndGenres(resultObject);
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

    const handleSeeMoreClick = (index) => {
        setFlippedAccountIndex(index === flippedAccountIndex ? null : index);
    };

    const applyFiltersAndSort = () => {
        let filtered = [...influencers];

        // if (budget) {
        //     const budgetValue = parseFloat(budget.toString().replace(/[^0-9.]/g, ''));
        //     if (budgetValue < 10000000) {
        //         filtered = filtered.filter(item => {
        //             const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        //             return itemPrice <= budgetValue;
        //         });
        //     }
        // }

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

    const applyBudgetFilter = () => {
        if (budget) {
            const budgetValue = (parseFloat(budget.toString().replace(/[^0-9.]/g, ''))) * 0.5;
            const parsePrice = (price) => parseFloat(price.toString().replace(/[^0-9.]/g, ''));

            let affordableInfluencers = filteredInfluencers.filter(influencer => {
                const price = parsePrice(influencer.price);
                return price > 0 && price <= budgetValue;
            });

            let selectedInfluencers = [];
            let totalBudget = 0;

            affordableInfluencers = affordableInfluencers.sort(() => Math.random() - 0.5);

            while (totalBudget < budgetValue && affordableInfluencers.length > 0) {
                const influencer = affordableInfluencers.pop();
                const influencerPrice = parsePrice(influencer.price);
                if (totalBudget + influencerPrice <= budgetValue) {
                    selectedInfluencers.push(influencer);
                    totalBudget += influencerPrice;
                }
            }

            if (selectedInfluencers.length < 4) {
                selectedInfluencers = [...selectedInfluencers, ...affordableInfluencers.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)).slice(0, 4 - selectedInfluencers.length)];
            }

            setFilteredInfluencersByBudget(selectedInfluencers);
        }
    };
    
    const handleSortChange = (newSortMethod) => {
        setSortMethod(newSortMethod);
    };

    function doublePrice(priceString) {
        const currencySymbols = ['€', '$', '£'];
        const currencySymbol = currencySymbols.find(symbol => priceString.includes(symbol));
        let numericPart = currencySymbol
            ? priceString.replace(currencySymbol, '').trim()
            : priceString.trim();
        const price = parseFloat(numericPart);
        if (isNaN(price)) {
            throw new Error('Invalid price format');
        }
        const doubledPrice = price * 2;
        return currencySymbol
            ? `${doubledPrice}${currencySymbol}`
            : `${doubledPrice}`;
    }

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

    const calculatePriceForOffersAndInfluencers = (price) => {
        let priceString = String(price);
        let priceWithoutCurrency = parseInt(priceString.replace(/\D/g, ""), 10);

        switch (currentCurrency) {
            case "€":
                return priceWithoutCurrency;
            case "£":
                return Math.round(0.8559 * priceWithoutCurrency);
            case "$":
                return Math.round(1.10 * priceWithoutCurrency);
            default:
                return priceWithoutCurrency;
        }
    }

    return (<section className="account-client">
            <div className="account-client-block" style={{position: "relative"}}>
                <h1 className="account-client-title">service offered</h1>
                <h2 className="account-client-second">influencers post for clients</h2>
                <TitleSection title="Our" span="offers"/>
                <button style={{
                    position: "absolute", top: 0, left: 50, width: 50, height: 50, cursor: "pointer",
                }} onClick={() => {
                    navigation("/account/client/list-promo");
                }}>
                    <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                </button>

                <div className="account-client-offers">
                    <div className="genre-swiper-container">
                        <GenreButtonList onGenreSelect={handleOffersGenreSelect}/>
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
                                340: {
                                    slidesPerView: 1,
                                    spaceBetween: 10, // уменьшите значение
                                },
                                550: {
                                    slidesPerView: 1,
                                    spaceBetween: 10, // уменьшите значение
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20, // уменьшите значение
                                },
                                992: {
                                    slidesPerView: 3,
                                    spaceBetween: 20, // уменьшите значение
                                },
                                1200: {
                                    slidesPerView: 4,
                                    spaceBetween: 30, // уменьшите значение
                                },
                                1400: {
                                    slidesPerView: 4,
                                    spaceBetween: 20, // уменьшите значение
                                },
                                1800: {
                                    slidesPerView: 4,
                                    spaceBetween: 30, // уменьшите значение
                                }
                            }}
                            style={{
                                padding: "30px 0px 180px 40px",
                                "--swiper-navigation-size": "80px",
                                "--swiper-navigation-top-offset": "40%",
                                overflow: "hidden"
                            }}
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

                <TitleSection title="Pick &" span="choose"/>

                <div className="account-client-container"
                     style={{display: 'flex', flexDirection: 'row', marginTop: 35}}>
                    <OffersMenu
                        influencers={influencers}
                        setCheckedGenres={setCheckedGenres}
                        setCheckedCountries={setCheckedCountries}
                        setFilteredInfluencersByGenres={setFilteredInfluencers}
                        setFilteredInfluencersByCountries={setFilteredInfluencers}
                        applyFilters={applyFiltersAndSort}
                    />
                    <div className="account-client-container-right-side">
                        <div className="account-client-container-right-side-upper-side">
                            <OffersBudgetSelect
                                setBudget={setBudget}
                                filteredInfluencersByBudget={filteredInfluencersByBudget}
                                setFilteredInfluencersByBudget={setFilteredInfluencersByBudget}
                                selectInfluencer={selectInfluencer}
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
                                        onClick={() => {
                                            if (!searchResult.connect) {
                                                setActiveIndices(prevIndices =>
                                                    prevIndices.includes(searchResult.index)
                                                        ? prevIndices.filter(i => i !== searchResult.index)
                                                        : [...prevIndices, searchResult.index]
                                                );
                                                selectInfluencer(searchResult.instagramUsername);
                                            }
                                        }}
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
                                            <div
                                                className="account-client-choose-item-content-second-container">
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
                                                    <p>PRICE<span>{calculatePriceForOffersAndInfluencers(doublePrice(searchResult.price))}{currentCurrency}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="account-client-choose-item-content-third-container">
                                            {flippedAccountIndex !== searchResult.index && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSeeMoreClick(searchResult.index);
                                                    }}
                                                    className="see-more-button"
                                                >
                                                    See More
                                                </button>
                                            )}
                                        </div>

                                        {flippedAccountIndex === searchResult.index && (
                                            <div
                                                className={`account-client-choose-item-expanded-content ${searchResult.connect ? 'connect' : ''} ${activeIndices.includes(searchResult.index) ? 'active' : ''}`}>
                                                <div
                                                    className={`account-client-choose-item-back show ${searchResult.connect ? 'connect' : ''} ${activeIndices.includes(searchResult.index) ? 'active' : ''}`}>
                                                    <div className="account-client-choose-item-horizontal-line">
                                                        <div
                                                            className="account-client-choose-item-back-left-side">
                                                            <span
                                                                className="account-client-choose-item-back-countries-title">Countries</span>
                                                            <ul className="account-client-choose-item-back-left-side-countries">
                                                                {searchResult && searchResult.countries && Array.isArray(searchResult.countries) && searchResult.countries.length > 0 ? (
                                                                    searchResult.countries.map((country, index) => (
                                                                        <li key={index}
                                                                            className="account-client-choose-item-back-left-side-country-percentage">
                                                                                <span
                                                                                    className="country-name">{country.country}</span>
                                                                            <span
                                                                                className="country-percentage">{country.percentage}%</span>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li>No countries available</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <div
                                                            className="account-client-choose-item-back-right-side">
                                                            <span
                                                                className="account-client-choose-item-back-genres-title">Genres</span>
                                                            <ul className="account-client-choose-item-back-right-side-genres">
                                                                {searchResult.musicStyle && searchResult.musicSubStyles && (
                                                                    <li>
                                                                        {getDisplayGenre(searchResult.musicSubStyles, searchResult.musicStyle, searchResult.musicStyleOther)}
                                                                    </li>
                                                                )}
                                                                {searchResult.musicStyleOther && searchResult.musicStyleOther.map((genre, index) => (
                                                                    <li key={index}>
                                                                        {searchResult.musicSubStyles && (genre === "Techno" || genre === "House") ? (
                                                                            getDisplayGenre(searchResult.musicSubStyles, genre, searchResult.musicStyleOther)
                                                                        ) : (
                                                                            genre
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>

                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSeeMoreClick(searchResult.index);
                                                    }}
                                                    className="see-less-button"
                                                >
                                                    See Less
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                </ul>
                            ) : filteredInfluencersByBudget.length > 0 ? (
                                (<ul className="account-client-choose-list">
                                    {filteredInfluencersByBudget.map((item, index) => (
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
                                                <div
                                                    className="account-client-choose-item-content-second-container">
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
                                                        <p>PRICE<span>{calculatePriceForOffersAndInfluencers(doublePrice(item.price))}{currentCurrency}</span></p>
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
                                                    >
                                                        See More
                                                    </button>
                                                )}
                                            </div>

                                            {flippedAccountIndex === index && (
                                                <div
                                                    className={`account-client-choose-item-expanded-content ${item.connect ? 'connect' : ''} ${activeIndices.includes(index) ? 'active' : ''}`}>
                                                    <div
                                                        className={`account-client-choose-item-back show ${item.connect ? 'connect' : ''} ${activeIndices.includes(index) ? 'active' : ''}`}>
                                                        <div
                                                            className="account-client-choose-item-horizontal-line">
                                                            <div
                                                                className="account-client-choose-item-back-left-side">
                                                                <span
                                                                    className="account-client-choose-item-back-countries-title">Countries</span>
                                                                <ul className="account-client-choose-item-back-left-side-countries">
                                                                    {item && item.countries && Array.isArray(item.countries) && item.countries.length > 0 ? (
                                                                        item.countries.map((country, index) => (
                                                                            <li key={index}
                                                                                className="account-client-choose-item-back-left-side-country-percentage">
                                                                                <span
                                                                                    className="country-name">{country.country}</span>
                                                                                <span
                                                                                    className="country-percentage">{country.percentage}%</span>
                                                                            </li>
                                                                        ))
                                                                    ) : (
                                                                        <li>No countries available</li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                            <div
                                                                className="account-client-choose-item-back-right-side">
                                                                <span
                                                                    className="account-client-choose-item-back-genres-title">Genres</span>
                                                                <ul className="account-client-choose-item-back-right-side-genres">
                                                                    {item.musicStyle && item.musicSubStyles && (
                                                                        <li>
                                                                            {getDisplayGenre(item.musicSubStyles, item.musicStyle, item.musicStyleOther)}
                                                                        </li>
                                                                    )}
                                                                    {item.musicStyleOther && item.musicStyleOther.map((genre, index) => (
                                                                        <li key={index}>
                                                                            {item.musicSubStyles && (genre === "Techno" || genre === "House") ? (
                                                                                getDisplayGenre(item.musicSubStyles, genre, item.musicStyleOther)
                                                                            ) : (
                                                                                genre
                                                                            )}
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
                                                    >
                                                        See Less
                                                    </button>
                                                </div>
                                            )}


                                        </li>
                                    ))}
                                </ul>)
                            ) : (<ul className="account-client-choose-list">
                                {filteredInfluencers.map((item, index) => (
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
                                            <div
                                                className="account-client-choose-item-content-second-container">
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
                                                    <p>PRICE<span>{calculatePriceForOffersAndInfluencers(doublePrice(item.price))}{currentCurrency}</span>
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
                                                >
                                                    See More
                                                </button>
                                            )}
                                        </div>

                                        {flippedAccountIndex === index && (
                                            <div
                                                className={`account-client-choose-item-expanded-content ${item.connect ? 'connect' : ''} ${activeIndices.includes(index) ? 'active' : ''}`}>
                                                <div
                                                    className={`account-client-choose-item-back show ${item.connect ? 'connect' : ''} ${activeIndices.includes(index) ? 'active' : ''}`}>
                                                    <div className="account-client-choose-item-horizontal-line">
                                                        <div
                                                            className="account-client-choose-item-back-left-side">
                                                                <span
                                                                    className="account-client-choose-item-back-countries-title">Countries</span>
                                                            <ul className="account-client-choose-item-back-left-side-countries">
                                                                {item && item.countries && Array.isArray(item.countries) && item.countries.length > 0 ? (
                                                                    item.countries.map((country, index) => (
                                                                        <li key={index}
                                                                            className="account-client-choose-item-back-left-side-country-percentage">
                                                                                <span
                                                                                    className="country-name">{country.country}</span>
                                                                            <span
                                                                                className="country-percentage">{country.percentage}%</span>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li>No countries available</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <div
                                                            className="account-client-choose-item-back-right-side">
                                                                <span
                                                                    className="account-client-choose-item-back-genres-title">Genres</span>
                                                            <ul className="account-client-choose-item-back-right-side-genres">
                                                                {item.musicStyle && item.musicSubStyles && (
                                                                    <li>
                                                                        {getDisplayGenre(item.musicSubStyles, item.musicStyle, item.musicStyleOther)}
                                                                    </li>
                                                                )}
                                                                {item.musicStyleOther && item.musicStyleOther.map((genre, index) => (
                                                                    <li key={index}>
                                                                        {item.musicSubStyles && (genre === "Techno" || genre === "House") ? (
                                                                            getDisplayGenre(item.musicSubStyles, genre, item.musicStyleOther)
                                                                        ) : (
                                                                            genre
                                                                        )}
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
                                                >
                                                    See Less
                                                </button>
                                            </div>
                                        )}


                                    </li>
                                ))}
                            </ul>)
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <p className="account-client-choose-total">
                        Total{" "}
                        <span
                            className="account-client-choose-total-span">{calculatePriceForOffersAndInfluencers(customePrice)} {currentCurrency}</span>
                    </p>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 40,
                    }}>
                        <StandardButton text="Continue" onClick={nextForm}/>
                    </div>
                </div>
            </div>
        </section>
    )
        ;
};

export default AccountClientOffers;
