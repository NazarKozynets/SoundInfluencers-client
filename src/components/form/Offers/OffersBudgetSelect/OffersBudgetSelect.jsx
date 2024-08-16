import React, { useState, useEffect, useRef } from "react";
import "./offersBudgetSelect.css";
import lineImg from './Line 35.svg';
import {useDispatch, useSelector} from "react-redux";
import {setSelectCurrency} from "../../../../redux/slice/create-promo";

const OffersBudgetSelect = ({ setBudget, setFilteredInfluencersByBudget }) => {
    const [value, setValue] = useState("");
    const [currency, setCurrency] = useState("€");
    const inputRef = useRef(null);

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const newValue = e.target.value.replace(/[^0-9]/g, '');
        setValue(newValue);
        if (newValue === '') {
            setFilteredInfluencersByBudget([]);
            setCurrency("€");
            dispatch(setSelectCurrency("€"));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const newBudget = `${value}${currency}`;
            setBudget(newBudget);
        }
    };

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        if (value) {
            const newBudget = `${value}${newCurrency}`;
            setBudget(newBudget);
        }
        dispatch(setSelectCurrency(newCurrency));
    };

    useEffect(() => {
        if (inputRef.current) {
            const placeholderWidth = inputRef.current.placeholder.length * 10;
            inputRef.current.style.width = `${Math.max(placeholderWidth + 20, value.length * 10 + 20)}px`;
        }
    }, [value]);

    return (
        <div className="offers-budget-select">
            <div className="offers-budget-select-title">
                <span>BUDGET</span>
            </div>
            <div className="offers-budget-select-currency">
                <button
                    className={currency === "€" ? "selected" : ""}
                    onClick={() => handleCurrencyChange("€")}
                >
                    €
                </button>
                <img src={lineImg} alt="line"/>
                <button
                    className={currency === "£" ? "selected" : ""}
                    onClick={() => handleCurrencyChange("£")}
                >
                    £
                </button>
                <img src={lineImg} alt="line"/>
                <button
                    className={currency === "$" ? "selected" : ""}
                    onClick={() => handleCurrencyChange("$")}
                >
                    $
                </button>
            </div>
            <div className="offers-budget-select-input-budget">
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    ref={inputRef}
                    placeholder={"Input your budget..."}
                />
            </div>
        </div>
    );
}

export default OffersBudgetSelect;