import React from "react";
import styles from "./style.module.css";

const SelectCurrency = ({selectedCurrency, setSelectedCurrency}) => {
    const handleSelect = (currency) => {
        setSelectedCurrency(currency);
    };

    return (
        <div className={styles.container}>
            <div
                className={`${styles.first} ${selectedCurrency === "€" ? styles.selected : ""}`}
                onClick={() => handleSelect("€")}
            >
                €
            </div>
            <div
                className={`${selectedCurrency === "£" ? styles.selected : ""}`}
                onClick={() => handleSelect("£")}
            >
                £
            </div>
            <div
                className={`${styles.third} ${selectedCurrency === "$" ? styles.selected : ""}`}
                onClick={() => handleSelect("$")}
            >
                $
            </div>
        </div>
    );
};

export default SelectCurrency;