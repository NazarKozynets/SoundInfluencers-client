import React, { useState, useEffect, useRef } from "react";
import "./offersBudgetSelect.css";
import lineImg from './Line 35.svg';

const OffersBudgetSelect = () => {
    const [value, setValue] = useState("");
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const newValue = e.target.value.replace(/[^0-9]/g, '');
        setValue(newValue);
    };

    useEffect(() => {
        if (inputRef.current) {
            const placeholderWidth = inputRef.current.placeholder.length * 10; // Настройте коэффициент по необходимости
            inputRef.current.style.width = `${Math.max(placeholderWidth + 20, value.length * 10 + 20)}px`;
        }
    }, [value]);

    return (
        <div className="offers-budget-select">
            <div className="offers-budget-select-title">
                <span>BUDGET</span>
            </div>
            <div className="offers-budget-select-currency">
                <button>€</button>
                <img src={lineImg} alt="line"/>
                <button>£</button>
                <img src={lineImg} alt="line"/>
                <button>$</button>
            </div>
            <div className="offers-budget-select-input-budget">
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    ref={inputRef}
                    placeholder={"Input your budget..."}
                />
            </div>
        </div>
    );
}

export default OffersBudgetSelect;
