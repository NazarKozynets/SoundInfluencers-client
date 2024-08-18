import React, { useState, useEffect, useRef } from "react";
import "./offersBudgetSelect.css";
import lineImg from './Line 34.svg';
import {useDispatch, useSelector} from "react-redux";
import {setSelectCurrency} from "../../../../redux/slice/create-promo";

const OffersBudgetSelect = ({ budget, setBudget, setFilteredInfluencersByBudget }) => {
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

    const handleCalculate = () => {
        if (budget != null) {
            setFilteredInfluencersByBudget([]); 
            const newBudget = `${value}${currency}`;
            if (newBudget !== budget) {
                setBudget(newBudget);
                
            }
        } else {
            setBudget(`${value}${currency}`);
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
                    value={value}
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