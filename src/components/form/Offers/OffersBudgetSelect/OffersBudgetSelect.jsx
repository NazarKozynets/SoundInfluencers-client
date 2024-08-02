import React, { useState, useEffect, useRef } from "react";
import "./offersBudgetSelect.css";
import lineImg from './Line 35.svg';

const OffersBudgetSelect = ({ budget, setBudget, applyFilters }) => {
    const [value, setValue] = useState("");
    const [currency, setCurrency] = useState(""); // No default currency
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const newValue = e.target.value.replace(/[^0-9]/g, '');
        setValue(newValue);
        // Reset budget to default if input is cleared
        if (newValue === '') {
            setBudget("10000000");
            setCurrency(""); // Reset currency to show all accounts
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (value === '') {
                // Reset to default budget and currency if input is empty
                setBudget("10000000");
                setCurrency("");
            } else {
                const newBudget = `${value}${currency}`;
                setBudget(newBudget);
            }
            applyFilters(); // Call applyFilters when budget is set
        }
    };

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        if (value) {
            const newBudget = `${value}${newCurrency}`;
            setBudget(newBudget);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            const placeholderWidth = inputRef.current.placeholder.length * 10; // Adjust coefficient as necessary
            inputRef.current.style.width = `${Math.max(placeholderWidth + 20, value.length * 10 + 20)}px`;
        }
    }, [value]);

    return (
        <div className="offers-budget-select">
            <div className="offers-budget-select-title">
                <span>BUDGET</span>
            </div>
            <div className="offers-budget-select-currency">
                <button onClick={() => handleCurrencyChange("€")}>€</button>
                <img src={lineImg} alt="line"/>
                <button onClick={() => handleCurrencyChange("£")}>£</button>
                <img src={lineImg} alt="line"/>
                <button onClick={() => handleCurrencyChange("$")}>$</button>
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
