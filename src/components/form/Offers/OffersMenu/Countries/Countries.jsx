import React, { useState } from "react";
import styles from "./countries.module.css";

const Countries = () => {
    const [checkedCountries, setCheckedCountries] = useState({});

    const countries = [
        'USA', 'UK', 'Germany', 'France', 'Japan', 'South Korea', 'Canada', 'Australia', 'Italy', 'Spain'
    ];

    const handleCheckboxChange = (country, checked) => {
        setCheckedCountries(prevCheckedCountries => ({
            ...prevCheckedCountries,
            [country]: checked
        }));
    };

    const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

    return (
        <div className={styles.countries}>
            <div className={styles.header}>
                <h2 className={styles.title}>COUNTRIES</h2>
                <button className={styles.seeAllButton}>see all</button>
            </div>
            <ul className={styles.countriesList}>
                {countries.map((country, index) => (
                    <li key={index} className={styles.countriesListItem}>
                        <div className={styles.countryItem}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!checkedCountries[country]}
                                    onChange={(e) => handleCheckboxChange(country, e.target.checked)}
                                    className={`${styles.checkbox} ${checkedCountries[country] ? styles.checkboxChecked : ''}`}
                                />
                                {country}
                            </label>
                            <button className={styles.randomNumberButton}>{0}</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Countries;
