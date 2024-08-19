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
import {useNavigate} from "react-router-dom";
import OffersMenu from "../../../../form/Offers/OffersMenu/OffersMenu";
import OffersSortMenu from "../../../../form/Offers/OffersSortMenu/OffersSortMenu";
import OffersBudgetSelect from "../../../../form/Offers/OffersBudgetSelect/OffersBudgetSelect";
import arrow from "../../../../../images/icons/arrow.svg";
import OffersSearch from "../../../../form/Offers/OffersSearchBar/OffersSearch";
import OffersList from "./AccountClientOffersComponents/OffersList";
import InfluencersList from "./AccountClientOffersComponents/InfluencersList";
import {calculatePriceForOffersAndInfluencers, doublePrice} from "../../../../../utils/price";


const AccountClientOffers = () => {
    const navigation = useNavigate();
    const [prices, setPrices] = useState([]);
    const dispatch = useDispatch();
    const [influencers, setInfluencers] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false)
    const [activeIndices, setActiveIndices] = useState([]);
    const [filteredInfluencers, setFilteredInfluencers] = useState(influencers);
    const [filteredInfluencersByBudget, setFilteredInfluencersByBudget] = useState([]);
    const [checkedGenres, setCheckedGenres] = useState({});
    const [checkedCountries, setCheckedCountries] = useState({});
    const [budget, setBudget] = useState(null);
    const [sortMethod, setSortMethod] = useState('Best Match');
    const [searchResult, setSearchResult] = useState(null);

    const currentPrice = useSelector((state) => state.createPromo.data.selectPrice.variant);

    const dataForm = useSelector((state) => state.createPromo.data);

    const customAmount = useSelector((state) => state.createPromo.data.selectPrice.amount);

    const customePrice = useSelector((state) => state.createPromo.data.selectPrice.price);

    const selectInfluencers = useSelector((state) => state.createPromo.data.selectInfluencers);

    const selectInfluencersByBudget = useSelector((state) => state.createPromo.data.selectInfluencersByBudget);

    const currentCurrency = useSelector((state) => state.createPromo.data.currency);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setFilteredInfluencers(influencers);
    }, [influencers]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [sortMethod, checkedGenres, checkedCountries]);

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
                    // Преобразование цены в соответствии с валютой
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
                influencerId: item._id, instagramUsername: item.instagramUsername, confirmation: "wait",
            }));

        // Преобразование цены предложения в соответствии с валютой
        let totalCustomOffer = priceOffer ? calculatePriceForOffersAndInfluencers(priceOffer.price, currentCurrency) + newPrice : newPrice;

        dispatch(setSelectAmount(priceOffer ? totalCustomOffer : newPrice));

        if (totalCustomOffer > balance) totalCustomOffer = totalCustomOffer - balance;
        if (newPrice > balance) newPrice = newPrice - balance;

        dispatch(setSelectPrice({
            variant: currentPrice,
            price: totalCustomOffer,
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

    const applyFiltersAndSort = () => {
        let filtered = [...influencers];

        const selectedGenres = Object.keys(checkedGenres).filter(key => checkedGenres[key]);
        if (selectedGenres.length > 0) {
            filtered = filtered.filter(item => selectedGenres.includes(item.musicStyle));
        }

        const selectedCountries = Object.keys(checkedCountries).filter(key => checkedCountries[key]);
        if (selectedCountries.length > 0) {
            filtered = filtered.filter(item =>
                Array.isArray(item.countries) &&
                item.countries.some(country =>
                    selectedCountries.includes(country.country)
                )
            );
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

    const applyFiltersByBudget = () => {
        let filtered = [...influencers];
        if (budget) {
            let totalPrice = 0;
            const numberOfInfluencersFilteredByBudget = Math.floor(Math.random() * (10 - 4 + 1)) + 4;
            const influencersFilteredByBudget = [];
            const selectedInfluencers = new Set();
            let attempts = 0;
            const maxAttempts = 1000;

            while (attempts < maxAttempts) {
                attempts++;
                let randomInfluencer = filtered[Math.floor(Math.random() * filtered.length)];
                let influencerPrice = parseFloat(randomInfluencer.price.replace(/[^0-9.]/g, '')) * 2;

                if (!selectedInfluencers.has(randomInfluencer) && (influencerPrice + totalPrice <= budget)) {
                    influencersFilteredByBudget.push(randomInfluencer);
                    selectedInfluencers.add(randomInfluencer);
                    totalPrice += influencerPrice;

                    let difference = budget - totalPrice;

                    if (difference <= 50 && difference >= 0) {
                        break;
                    }
                }
            }

            setFilteredInfluencersByBudget(influencersFilteredByBudget);
        }
    };

    const handleSortChange = (newSortMethod) => {
        setSortMethod(newSortMethod);
    };

    return (<section className="account-client">
            <div className="account-client-block" style={{position: "relative"}}>
                <h1 className="account-client-title">service offered</h1>
                <h2 className="account-client-second">influencers post for clients</h2>
                <TitleSection title="Our" span="offers"/>
                <button style={{
                    position: "absolute", top: 0, left: 50, width: 50, height: 50, cursor: "pointer",
                }} onClick={() => navigation("/account/client/list-promo")}>
                    <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                </button>

                <OffersList prices={prices} selectPrice={selectPrice}
                            calculatePriceForOffersAndInfluencers={calculatePriceForOffersAndInfluencers}/>

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
                                applyFiltersByBudget={applyFiltersByBudget}
                                budget={budget}
                                setBudget={setBudget}
                                setFilteredInfluencersByBudget={setFilteredInfluencersByBudget}
                            />
                            <div className="account-client-container-right-side-upper-side-offers-search">
                                <OffersSearch
                                    filteredInfluencers={filteredInfluencers}
                                    setSearchResult={setSearchResult}
                                />
                                <OffersSortMenu
                                    selectedOption={sortMethod}
                                    onSortChange={handleSortChange}
                                />
                            </div>
                        </div>
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
