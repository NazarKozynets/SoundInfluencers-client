import React, {useEffect, useState} from "react";
import TitleSection from "../../../../TitleSection";
import choose1 from "../../../../../images/gentleman.png";
import instagram from "../../../../../images/icons/instagram.svg";
import axios from "axios";
import StandardButton from "../../../../form/StandardButton";
import {useDispatch, useSelector} from "react-redux";
import {
    setClearForm,
    setCurrentWindow, setSelectAmount, setSelectInfluencer, setSelectPrice, setSelectPriceInfluencers
} from "../../../../../redux/slice/create-promo";
import {useNavigate} from "react-router-dom";
import OffersMenu from "../../../../form/Offers/OffersMenu/OffersMenu";
import OffersSortMenu from "../../../../form/Offers/OffersSortMenu/OffersSortMenu";
import OffersBudgetSelect from "../../../../form/Offers/OffersBudgetSelect/OffersBudgetSelect";
import arrow from "../../../../../images/icons/arrow.svg";
import OffersSearch from "../../../../form/Offers/OffersSearchBar/OffersSearch";
import OffersList from "./AccountClientOffersComponents/OffersList";
import InfluencersList from "./AccountClientOffersComponents/InfluencersList";
import {
    calculatePriceForOffersAndInfluencers,
    calculatePricePerFollower,
    doublePrice
} from "../../../../../utils/price";
import MobileInfluencersList from "./AccountClientOffersComponents/MobileInfluencersList";
import MobileInfluencersListMenu from "./AccountClientOffersComponents/MobileInfluencersList";
import OffersFooter from "../../../../form/Offers/OffersFooterSection/OffersFooter";
import PageLoading from "../../../../form/PageLoading/pageLoading";

const AccountClientOffers = () => {
    const navigation = useNavigate();
    const [prices, setPrices] = useState([]);
    const [selectedOffersGenres, setSelectedOffersGenres] = useState([]);
    const [filteredOffersByGenres, setFilteredOffersByGenres] = useState(prices);
    const dispatch = useDispatch();
    const [influencers, setInfluencers] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [activeIndices, setActiveIndices] = useState([]);
    const [filteredInfluencers, setFilteredInfluencers] = useState(influencers);
    const [checkedGenres, setCheckedGenres] = useState({});
    const [checkedSubGenres, setCheckedSubGenres] = useState({});
    const [checkedCountries, setCheckedCountries] = useState({});
    const [checkedCategories, setCheckedCategories] = useState({});
    const [budget, setBudget] = useState(null);
    const [searchResult, setSearchResult] = useState(null);
    const [filterParams, setFilterParams] = useState({
        sortMethod: 'Best Match',
        checkedGenres: {},
        checkedCategories: {},
        checkedSubGenres: {},
        checkedCountries: {},
        budget: null
    });

    const [filteredInfluencersByBudget, setFilteredInfluencersByBudget] = useState([]);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const currentPrice = useSelector((state) => state.createPromo.data.selectPrice.variant);

    const dataForm = useSelector((state) => state.createPromo.data);

    const customAmount = useSelector((state) => state.createPromo.data.selectPrice.amount);

    const customePrice = useSelector((state) => state.createPromo.data.selectPrice.price);

    const selectInfluencers = useSelector((state) => state.createPromo.data.selectInfluencers);
    
    const selectPriceInfluencers = useSelector((state) => state.createPromo.data.selectPriceInfluencers);
    
    const currentCurrency = useSelector((state) => state.createPromo.data.currency);
    
    const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', checkIsMobile);
        checkIsMobile();
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const updateList = selectPriceInfluencers.forEach((item) => {
            const influencerIndex = selectInfluencers.findIndex(
                (inf) => inf.influencerId === item.influencerId && inf.instagramUsername === item.instagramUsername
            );

            if (influencerIndex !== -1) {
                const updatedInfluencers = [
                    ...selectInfluencers.slice(0, influencerIndex),
                    ...selectInfluencers.slice(influencerIndex + 1)
                ];

                dispatch(setSelectInfluencer(updatedInfluencers));
            }
        });
    }, [selectInfluencers, selectPriceInfluencers]);
    
    useEffect(() => {
        setFilteredInfluencers(influencers);
    }, [influencers]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [influencers, filterParams]);

    useEffect(() => {
        setFilteredOffersByGenres(prices);
    }, [prices]);

    const selectPrice = (id) => {
        let balance = window.sessionStorage.getItem("balance");

        const calculatePrice = (price) => calculatePriceForOffersAndInfluencers(price, currentCurrency);

        if (selectedOffersGenres.length > 0 && selectedOffersGenres) {
            const searchPrice = filteredOffersByGenres.find((item) => item.id === id);
            const matchingStyle = searchPrice.musicStyles.find(style => {
                const styleGenres = style.genres;
                return selectedOffersGenres.every(genre => styleGenres.includes(genre)) &&
                    styleGenres.length === selectedOffersGenres.length;
            });

            searchPrice.matchingStyle = matchingStyle;
            const offerPrice = matchingStyle ? matchingStyle.price : searchPrice.price;
            const updateList = influencers.map((item) => {
                if (matchingStyle.connectInfluencer.find((fin) => fin.influencerId === item._id && fin.instagramUsername === item.instagramUsername)) {
                    return {
                        ...item, active: false, connect: true, connect_text: `Offer ${searchPrice.id}`,
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

            const filterInfluencers = matchingStyle.connectInfluencer.map((item) => ({
                influencerId: item.influencerId,
                confirmation: "wait",
                instagramUsername: item.instagramUsername,
                connect: true,
                active: false
            }));

            if (selectInfluencers.length !== 0) {
                const currentSelectInfluencers = selectInfluencers.map((item) => ({
                    influencerId: item.influencerId,
                    confirmation: "wait",
                    instagramUsername: item.instagramUsername,
                    connect: item.connect,
                    active: item.active
                }));
                const filterCurrentSelectInfluencer = [];
                [...filterInfluencers].forEach((item) => {
                    const checkUnion = filterCurrentSelectInfluencer.find((fin) => fin.instagramUsername === item.instagramUsername);
                    if (!checkUnion) {
                        filterCurrentSelectInfluencer.push(item);
                    }
                });
                dispatch(setSelectPriceInfluencers(filterCurrentSelectInfluencer));
            } else {
                dispatch(setSelectPriceInfluencers(filterInfluencers));
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
                    influencerId: item._id,
                    confirmation: "wait",
                    instagramUsername: item.instagramUsername,
                    connect: item.connect,
                    active: item.active
                }));
                dispatch(setSelectPriceInfluencers(totalSelectInfluencers));

                let newPrice = influencers.reduce((acc, current) => {
                    if (!current.price) return acc;
                    let price = current.price.replace(/\D/g, "");

                    if (current.customePrice) {
                        price = current.customePrice;
                    }

                    if (current.active) {
                        if (!current.connect) {
                            const influencerPrice = calculatePrice(price) * 2;
                            return acc + influencerPrice;
                        } else {
                            return acc;
                        }
                    } else {
                        return acc;
                    }
                }, 0);

                dispatch(setSelectPrice({
                    variant: 0, price: newPrice
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

                    const checkConnect = matchingStyle.connectInfluencer.find((item) => item.influencerId === current._id && item.instagramUsername === current.instagramUsername);

                    if (checkConnect) return acc;

                    if (current.active) {
                        if (!current.connect) {
                            const influencerPrice = calculatePrice(price) * 2;
                            return acc + influencerPrice;
                        } else {
                            return acc;
                        }
                    } else {
                        return acc;
                    }
                }, 0);

                dispatch(setSelectPrice({
                    variant: id, price: calculatePrice(matchingStyle.price) + newPrice,
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
                            return acc + calculatePrice(price) * 2;
                        } else {
                            return acc + calculatePrice(price) * 2;
                        }
                    } else {
                        return acc;
                    }
                } else {
                    return acc;
                }
            }, 0);

            let totalOffer = calculatePrice(offerPrice);
            let totalCustomOffer = totalOffer + newPrice;

            if (totalCustomOffer > balance) totalCustomOffer = totalCustomOffer - balance;
            if (newPrice > balance) newPrice = newPrice - balance;
            if (totalOffer > balance) totalOffer = totalOffer - balance;

            dispatch(setSelectAmount(totalCustomOffer > 0 ? calculatePrice(totalCustomOffer) : newPrice));
            dispatch(setSelectPrice({
                variant: id, price: totalOffer,
            }));
        } else {
            const searchPrice = prices.find((item) => item.id === id);

            const updateList = influencers.map((item) => {
                const isInfluencerConnected = searchPrice.connectInfluencer.find(
                    (fin) => fin.influencerId === item._id && fin.instagramUsername === item.instagramUsername
                );

                if (isInfluencerConnected) {
                    return {
                        ...item,
                        active: false,
                        connect: true,
                        connect_text: `Offer ${searchPrice.id}`,
                    };
                } else {
                    return {
                        ...item,
                        active:  false, 
                        connect:  false, 
                    };
                }
            });

            const filterInfluencers = searchPrice.connectInfluencer.map((item) => ({
                influencerId: item.influencerId,
                confirmation: "wait",
                instagramUsername: item.instagramUsername,
                connect: true,  
                active: false,  
            }));

            if (selectInfluencers.length !== 0) {
                const currentSelectInfluencers = selectInfluencers.map((item) => ({
                    influencerId: item.influencerId,
                    confirmation: "wait",
                    instagramUsername: item.instagramUsername,
                    connect: item.connect ?? false,  
                    active: item.active ?? false,   
                }));

                const filterCurrentSelectInfluencer = [];

                [...filterInfluencers].forEach((item) => {
                    const checkUnion = filterCurrentSelectInfluencer.find(
                        (fin) => fin.instagramUsername === item.instagramUsername
                    );
                    if (!checkUnion) {
                        filterCurrentSelectInfluencer.push(item);
                    }
                });

                dispatch(setSelectPriceInfluencers(filterCurrentSelectInfluencer));
            } else {
                dispatch(setSelectPriceInfluencers(filterInfluencers));
            }
            setInfluencers(updateList);

            if (currentPrice === id) {
                const checkInfluencers = influencers.map((item) => {
                    if (item.connect) {
                        return {
                            ...item,
                            connect: false, 
                            active: false,
                        };
                    } else {
                        return {
                            ...item,
                        };
                    }
                });

                setInfluencers(checkInfluencers);

                const currentSelectInfluencers = influencers.filter(
                    (item) => !item.connect && item.active
                );

                const totalSelectInfluencers = currentSelectInfluencers.map((item) => ({
                    influencerId: item._id,
                    confirmation: "wait",
                    instagramUsername: item.instagramUsername,
                }));

                dispatch(setSelectPriceInfluencers(totalSelectInfluencers));

                let newPrice = influencers.reduce((acc, current) => {
                    if (!current.price) return acc;
                    let price = current.price.replace(/\D/g, "");

                    if (current.customPrice) {
                        price = current.customPrice;
                    }

                    if (current.active && !current.connect) {
                        return acc + calculatePrice(price) * 2;
                    } else {
                        return acc;
                    }
                }, 0);

                dispatch(setSelectPrice({
                    variant: 0,
                    price: newPrice,
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
                            return acc + calculatePrice(price) * 2;
                        } else {
                            return acc;
                        }
                    } else {
                        return acc;
                    }
                }, 0);

                const priceOffer = prices.find((item) => item.id === id);

                dispatch(setSelectPrice({
                    variant: id, price: calculatePrice(priceOffer.price) + newPrice,
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
                            return acc + calculatePrice(price) * 2;
                        } else {
                            return acc + calculatePrice(price) * 2;
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

            dispatch(setSelectAmount(priceOffer ? calculatePrice(totalCustomOffer) : newPrice));

            dispatch(setSelectAmount(calculatePrice(totalOffer)));

            if (totalCustomOffer > balance) totalCustomOffer = totalCustomOffer - balance;
            if (newPrice > balance) newPrice = newPrice - balance;
            if (totalOffer > balance) totalOffer = totalOffer - balance;

            dispatch(setSelectPrice({
                variant: id, price: calculatePrice(priceOffer ? totalCustomOffer : newPrice),
            }));

            dispatch(setSelectPrice({
                variant: id, price: calculatePrice(totalOffer),
            }));
        }
    };

    const selectInfluencer = (instagramUsername) => {
        let balance = window.sessionStorage.getItem("balance");
        let updateList;

        if (filteredInfluencersByBudget.length > 0) {
            updateList = filteredInfluencersByBudget.map((item) => {
                if (item.instagramUsername === instagramUsername) {
                    if (item.active) {
                        return {
                            ...item,
                            active: false,
                            connect: false,
                        };
                    }
                    return {
                        ...item,
                        active: true,
                        connect: false,
                    };
                }

                return item;
            });
        } else {
            updateList = influencers.map((item) => {
                if (item.instagramUsername === instagramUsername) {
                    if (item.active) {
                        return {
                            ...item,
                            active: false,
                            connect: false,
                        };
                    }
                    return {
                        ...item,
                        active: true,
                        connect: false,
                    };
                }

                return item;
            });
        }

        let newPrice = updateList.reduce((acc, current) => {
            if (!current.price) return acc;
            let price = current.price.replace(/\D/g, "");
            if (current.customPrice) {
                price = current.customPrice;
            }

            if (current.active) {
                if (!current.connect) {
                    return acc + calculatePriceForOffersAndInfluencers(price, currentCurrency) * 2;
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
                influencerId: item._id,
                instagramUsername: item.instagramUsername,
                confirmation: "wait",
                connect: item.connect,
                active: item.active
            }));

        const selectedGenres = selectedOffersGenres.length > 0;
        let totalCustomOffer;
        if (selectedGenres) {
            const searchPrice = filteredOffersByGenres.find((item) => item.id === currentPrice);
            const matchingStyle = searchPrice?.musicStyles.find(style => {
                const styleGenres = style.genres;
                return selectedOffersGenres.every(genre => styleGenres.includes(genre)) &&
                    styleGenres.length === selectedOffersGenres.length;
            });
            const matchingStylePrice = matchingStyle ? matchingStyle.price : 0;
            totalCustomOffer = calculatePriceForOffersAndInfluencers(matchingStylePrice, currentCurrency) + newPrice;
        } else {
            totalCustomOffer = priceOffer ? calculatePriceForOffersAndInfluencers(priceOffer.price, currentCurrency) + newPrice : newPrice;
        }

        dispatch(setSelectAmount(totalCustomOffer));

        if (totalCustomOffer > balance) totalCustomOffer = totalCustomOffer - balance;
        if (newPrice > balance) newPrice = newPrice - balance;

        dispatch(setSelectPrice({
            variant: currentPrice,
            price: totalCustomOffer,
        }));

        // Обновление selectInfluencers
        // Обновление selectInfluencers
        // const updatedSelectInfluencers = selectInfluencers
        //     .filter(influencer => !filterInfluencers.some(newInfluencer => newInfluencer.influencerId === influencer.influencerId))
        //     .concat(
        //         filterInfluencers
        //     );
        //
        //
        // dispatch(setSelectInfluencer(updatedSelectInfluencers));

        
        dispatch(setSelectInfluencer([...filterInfluencers]));

        if (filteredInfluencersByBudget.length > 0) {
            setFilteredInfluencersByBudget(updateList);
        } else {
            setInfluencers(updateList);
        }
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
                    if (findInfluencer && findInfluencer.active === true) {
                        return {
                            ...item,
                            active: true,
                            connect: false,
                        };
                    }
                    if (findInfluencer && findInfluencer.connect === true) {
                        return {
                            ...item,
                            active: false,
                            connect: true,
                        };
                    }


                    return {
                        ...item,
                        active: false,
                        connect: false,
                    };
                });
                setInfluencers(list);
                return;
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
            setInfluencers(listInfluencers);
        }
    };

    const nextForm = () => {
        if (customAmount === 0 || selectInfluencers.length === 0) return;
        dispatch(setCurrentWindow(1));
    };
    
    const applyFiltersAndSort = () => {
        let filtered = [...influencers];
        const {sortMethod, checkedGenres, checkedCategories, checkedSubGenres, checkedCountries, budget} = filterParams;

        const selectedGenres = Object.keys(checkedGenres).filter(key => checkedGenres[key]);
        const selectedCategories = Object.keys(checkedCategories).filter(key => checkedCategories[key]);
        const selectedSubGenres = Object.keys(checkedSubGenres).filter(key => checkedSubGenres[key]);

        if (selectedGenres.length > 0 && selectedCategories.length === 0) {
            filtered = filtered.filter(item =>
                selectedGenres.includes(item.musicStyle) ||
                (item.musicSubStyles && item.musicSubStyles.some(subGenre => selectedSubGenres.includes(subGenre)))
            );
        } else if (selectedCategories.length > 0 && selectedGenres.length === 0) {
            filtered = filtered.filter(item =>
                item.categories && selectedCategories.some(category => item.categories.includes(category))
            );
        }

        if (!selectedCategories.length > 0 && selectedSubGenres.length > 0) {
            filtered = filtered.filter(item => {
                return item.musicSubStyles && item.musicSubStyles.length > 0 && item.musicSubStyles.some(subGenre => selectedSubGenres.includes(subGenre));
            });
        }

        const selectedCountries = Object.keys(checkedCountries).filter(key => checkedCountries[key]);
        if (selectedCountries.length > 0) {
            filtered = filtered.filter(item => {
                return item.countries && item.countries.length > 0 && item.countries.some(country => selectedCountries.includes(country.country));
            });
        }

        if (budget !== null) {
            // let totalPrice = 0;
            // const influencersFilteredByBudget = [];
            // const selectedInfluencers = new Set();
            // let attempts = 0;
            // const maxAttempts = 1000;
            //
            // while (attempts < maxAttempts && filtered.length > 0) {
            //     attempts++;
            //     let randomInfluencer = filtered[Math.floor(Math.random() * filtered.length)];
            //     let influencerPrice = parseFloat(randomInfluencer.price.replace(/[^0-9.]/g, '')) * 2;
            //
            //     if (!selectedInfluencers.has(randomInfluencer) && (influencerPrice + totalPrice <= budget)) {
            //         influencersFilteredByBudget.push(randomInfluencer);
            //         selectedInfluencers.add(randomInfluencer);
            //         totalPrice += influencerPrice;
            //
            //         let difference = budget - totalPrice;
            //
            //         if (difference <= 50 && difference >= 0) {
            //             break;
            //         }
            //     }
            // }


            // const influencersFilteredByBudget = [];

            const influencersFilteredByBudget = [];
            const sortedInfluencers = filtered.sort((a, b) => {
                const pricePerFollowerA = calculatePricePerFollower(a, currentCurrency);
                const pricePerFollowerB = calculatePricePerFollower(b, currentCurrency);
                return pricePerFollowerA - pricePerFollowerB;
            });
            let totalPrice = 0;
            for (let i = 0; i < sortedInfluencers.length; i++) {
                const influencer = sortedInfluencers[i];
                const influencerPrice = calculatePriceForOffersAndInfluencers(influencer.price, currentCurrency) * 2;

                if (totalPrice + influencerPrice <= budget) {
                    influencersFilteredByBudget.push(influencer);
                    totalPrice += influencerPrice;
                }
            }

            filtered = influencersFilteredByBudget;
            setFilteredInfluencersByBudget(filtered);
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
                filtered.sort((a, b) => {
                    const pricePerFollowerA = parseFloat(a.price.replace(/[^0-9.]/g, '')) / a.followersNumber;
                    const pricePerFollowerB = parseFloat(b.price.replace(/[^0-9.]/g, '')) / b.followersNumber;
                    return pricePerFollowerA - pricePerFollowerB; 
                });
                break;
            default:
                break;
        }

        setFilteredInfluencers(filtered);
    };

    const handleSetCheckedGenres = (newCheckedGenres) => {
        if (Object.keys(newCheckedGenres).length > 0) {
            setCheckedCategories({});
        }
        setCheckedGenres(newCheckedGenres);
        updateFilterParams({checkedGenres: newCheckedGenres});
    };

    const handleSetCheckedSubGenres = (newCheckedSubGenres) => {
        if (Object.keys(newCheckedSubGenres).length > 0) {
            setCheckedCategories({});
        }
        setCheckedSubGenres(newCheckedSubGenres);
        updateFilterParams({checkedSubGenres: newCheckedSubGenres});
    };

    const handleSetCheckedCategories = (newCheckedCategories) => {
        if (Object.keys(newCheckedCategories).length > 0) {
            setCheckedGenres({});
            setCheckedSubGenres({});
        }
        setCheckedCategories(newCheckedCategories);
        updateFilterParams({checkedCategories: newCheckedCategories});
    };

    const handleSetCheckedCountries = (newCheckedCountries) => {
        setCheckedCountries(newCheckedCountries);
        updateFilterParams({checkedCountries: newCheckedCountries});
    };

    const handleSortChange = (sortMethod) => {
        updateFilterParams({
            sortMethod: sortMethod
        });
    };

    const updateFilterParams = (newParams) => {
        setFilterParams(prevParams => ({
            ...prevParams,
            ...newParams
        }));
    };

    return (<section className="account-client">
            <div className="account-client-block" style={{position: "relative", marginBottom: '40px'}}>
                <div className="account-client-back-button">
                    <button style={{
                        position: "absolute", top: 0, left: 50, width: 48, height: 48, cursor: "pointer",
                    }} onClick={() => {
                        dispatch(setClearForm());
                        navigation("/account/client/list-promo");
                    }}>
                        <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                    </button>
                </div>

                <div className="account-client-title-block">
                    <h1 className="account-client-title">service offered</h1>
                    <h2 className="account-client-second">influencers post for clients</h2>
                </div>

                <div className="account-client-title-offers">
                    <TitleSection title="Our" span="offers"/>
                </div>

                {influencers.length > 0 ? (
                    <div>
                        <OffersList prices={prices}
                                    setFilteredOffersByGenres={setFilteredOffersByGenres}
                                    selectPrice={selectPrice}
                                    filteredOffersByGenres={filteredOffersByGenres}
                                    selectedOffersGenres={selectedOffersGenres}
                                    influencers={influencers}
                                    setSelectedOffersGenres={setSelectedOffersGenres}/>
                        <div className="account-client-influencers-list-title">
                            <TitleSection title="Pick &" span="choose"/>
                        </div>

                        <div className="account-client-container"
                             style={{
                                 display: 'flex',
                                 flexDirection: 'row',
                                 marginTop: 35
                             }}>
                            {isMobile ? null : <OffersMenu
                                influencers={influencers}
                                setCheckedGenres={handleSetCheckedGenres}
                                setCheckedCategories={handleSetCheckedCategories}
                                setCheckedSubGenres={handleSetCheckedSubGenres}
                                setCheckedCountries={handleSetCheckedCountries}
                                setFilteredInfluencersByGenres={setFilteredInfluencers}
                                setFilteredInfluencersByCountries={setFilteredInfluencers}
                                setFilteredInfluencersByCategories={setFilteredInfluencers}
                                checkedGenres={checkedGenres}
                                checkedCategories={checkedCategories}
                                checkedSubGenres={checkedSubGenres}
                                updateFilterParams={updateFilterParams}
                            />}
                            <div className="account-client-container-right-side">
                                {isMobile ? <MobileInfluencersListMenu filteredInfluencers={filteredInfluencers}
                                                                       setSearchResult={setSearchResult}
                                                                       setBudget={setBudget}
                                                                       selectedOption={filterParams.sortMethod}
                                                                       onSortChange={handleSortChange}
                                                                       influencers={influencers}
                                                                       setCheckedGenres={handleSetCheckedGenres}
                                                                       setCheckedCategories={handleSetCheckedCategories}
                                                                       setCheckedSubGenres={handleSetCheckedSubGenres}
                                                                       setCheckedCountries={handleSetCheckedCountries}
                                                                       setFilteredInfluencersByGenres={setFilteredInfluencers}
                                                                       setFilteredInfluencersByCountries={setFilteredInfluencers}
                                                                       setFilteredInfluencersByCategories={setFilteredInfluencers}
                                                                       budget={budget}
                                                                       checkedGenres={checkedGenres}
                                                                       checkedCategories={checkedCategories}
                                                                       checkedSubGenres={checkedSubGenres}
                                                                       filterParams={filterParams}
                                                                       updateFilterParams={updateFilterParams}
                                                                       applyFiltersAndSort={applyFiltersAndSort}
                                                                       setFilteredInfluencersByBudget={setFilteredInfluencersByBudget}
                                                                       setActiveIndices={setActiveIndices}/> :
                                    <div className="account-client-container-right-side-upper-side">
                                        <OffersBudgetSelect
                                            budget={budget}
                                            setBudget={setBudget}
                                            applyFiltersAndSort={applyFiltersAndSort}
                                            updateFilterParams={updateFilterParams}
                                            setActiveIndices={setActiveIndices}
                                            setMobileBudget={null}
                                            setFilteredInfluencersByBudget={setFilteredInfluencersByBudget}
                                        />
                                        <div className="account-client-container-right-side-upper-side-offers-search">
                                            <OffersSearch
                                                filteredInfluencers={filteredInfluencers}
                                                setSearchResult={setSearchResult}
                                            />
                                            <OffersSortMenu
                                                selectedOption={filterParams.sortMethod}
                                                onSortChange={handleSortChange}
                                            />
                                        </div>
                                    </div>}
                                <div className="account-client-choose" style={{flex: 3, marginLeft: '20px'}}>
                                    {searchResult ? (
                                        <InfluencersList influencers={searchResult}
                                                         activeIndices={activeIndices}
                                                         setActiveIndices={setActiveIndices}
                                                         selectInfluencer={selectInfluencer}
                                                         isSearch={true}/>
                                    ) : filteredInfluencersByBudget.length > 0 ? (
                                        <InfluencersList influencers={filteredInfluencersByBudget}
                                                         activeIndices={activeIndices}
                                                         setActiveIndices={setActiveIndices}
                                                         selectInfluencer={selectInfluencer}
                                                         isSearch={false}/>
                                    ) : (
                                        <InfluencersList influencers={filteredInfluencers}
                                                         activeIndices={activeIndices}
                                                         setActiveIndices={setActiveIndices}
                                                         selectInfluencer={selectInfluencer}
                                                         isSearch={false}/>
                                    )}
                                </div>
                            </div>
                            <OffersFooter/>
                        </div>

                        {window.innerWidth < 768 && (
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
                                    <StandardButton text="Continue" onClick={nextForm}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{margin: '0 auto'}}>
                        <PageLoading/>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AccountClientOffers;
