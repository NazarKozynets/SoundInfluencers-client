import React, {useState, useEffect, useRef} from "react";
import "./offersBudgetSelect.css";
import lineImg from './Line 34.svg';
import searchImg from '../../../../images/icons/search.svg'
import {useDispatch, useSelector} from "react-redux";
import {setSelectCurrency, setSelectInfluencer, setSelectPrice } from "../../../../redux/slice/create-promo";

const OffersBudgetSelect = ({
                                budget,
                                mobileBudget,
                                setMobileBudget,
                                setBudget,
                                applyFiltersAndSort, 
                                setActiveIndices,
                                updateFilterParams,
                                setFilteredInfluencersByBudget
                            }) => {
    const inputRef = useRef(null);
    const currentCurrency = useSelector((state) => state.createPromo.data.currency);
    const dispatch = useDispatch();
    const isMobile = window.innerWidth <= 768;
    
    const handleChange = (e) => {
        const newBudget = e.target.value;
        setBudget(newBudget);

        if (isMobile) {
            setMobileBudget(newBudget);
        }

        if (newBudget === "") {
            setFilteredInfluencersByBudget([]);
            updateFilterParams({ budget: null });
            dispatch(setSelectInfluencer([]));
            dispatch(setSelectPrice({ variant: 0, price: 0 }));
            setActiveIndices([]);
        }
    };

    const handleCalculate = () => {
        updateFilterParams({ budget: budget });
        applyFiltersAndSort(); 
        dispatch(setSelectInfluencer([]));
        dispatch(setSelectPrice({ variant: 0, price: 0 }));
        setActiveIndices([]);
        console.log(budget);
    };

    const handleCurrencyChange = (newCurrency) => {
        dispatch(setSelectCurrency(newCurrency));
    };

    return (
        <div className={`offers-budget-select ${window.innerWidth <= "1600px" ? 'reversed' : ''}`}>
            <div className="offers-budget-select-title-currency">
                <div className="offers-budget-select-title">
                    <span>BUDGET</span>
                </div>
                <div className="offers-budget-select-currency">
                    <button
                        className={`euro ${currentCurrency === "€" ? "selected" : ""}`}
                        onClick={() => handleCurrencyChange("€")}
                    >
                        €
                    </button>
                    <img src={lineImg} alt="line"/>
                    <button
                        className={`pound ${currentCurrency === "£" ? "selected" : ""}`}
                        onClick={() => handleCurrencyChange("£")}
                    >
                        £
                    </button>
                    <img src={lineImg} alt="line"/>
                    <button
                        className={`dollar ${currentCurrency === "$" ? "selected" : ""}`}
                        onClick={() => handleCurrencyChange("$")}
                    >
                        $
                    </button>
                </div>
            </div>
            <div className="offers-budget-select-input-budget">
                {isMobile ? <>
                    <input
                        type="text"
                        onChange={handleChange}
                        value={mobileBudget ? mobileBudget : ""}
                        ref={inputRef}
                        placeholder="1000.."
                    />
                    <button onClick={() => handleCalculate()}
                            className="offers-mobile-budget-select-input-budget-button">
                        <img src={searchImg} alt=""/>
                    </button>
                </> : (
                    <>
                        <input
                            type="text"
                            onChange={handleChange}
                            ref={inputRef}
                            placeholder={"Input your budget..."}
                        />
                        <button onClick={() => handleCalculate()}>Calculate</button>
                    </>
                )}
            </div>

        </div>

    )
        ;
}

export default OffersBudgetSelect;