import React, { useState, useEffect, useRef } from "react";
import "./offersBudgetSelect.css";
import lineImg from './Line 34.svg';
import {useDispatch, useSelector} from "react-redux";
import {setSelectCurrency} from "../../../../redux/slice/create-promo";

const OffersBudgetSelect = ({ budget, setBudget, setFilteredInfluencersByBudget, applyFiltersByBudget }) => {
    const [currency, setCurrency] = useState("€");
    const inputRef = useRef(null);

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setBudget(e.target.value);
        if (e.target.value === "") {
            setFilteredInfluencersByBudget([]);
        }
    };

    const handleCalculate = () => {
        applyFiltersByBudget();
    };

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
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
                        className={`euro ${currency === "€" ? "selected" : ""}`}
                        onClick={() => handleCurrencyChange("€")}
                    >
                        €
                    </button>
                    <img src={lineImg} alt="line"/>
                    <button
                        className={`pound ${currency === "£" ? "selected" : ""}`}
                        onClick={() => handleCurrencyChange("£")}
                    >
                        £
                    </button>
                    <img src={lineImg} alt="line"/>
                    <button
                        className={`dollar ${currency === "$" ? "selected" : ""}`}
                        onClick={() => handleCurrencyChange("$")}
                    >
                        $
                    </button>
                </div>
            </div>
            <div className="offers-budget-select-input-budget">
                <input
                    type="text"
                    onChange={handleChange}
                    ref={inputRef}
                    placeholder={"Input your budget..."}
                />
                <button onClick={() => handleCalculate()}>Calculate</button>
            </div>
        </div>

    );
}

export default OffersBudgetSelect;