import React, { useState } from "react";
import styles from "./countries.module.css";
import vectorImage from "../../../../images/vector.png"; // Убедитесь, что путь правильный

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

    const checkboxStyle = {
        width: '20px',
        height: '20px',
        border: '2px solid #3330E4',
        borderRadius: '3px',
        position: 'relative',
        marginRight: '10px',
        cursor: 'pointer',
        verticalAlign: 'middle',
    };

    const checkedCheckboxStyle = {
        ...checkboxStyle,
        backgroundColor: '#3330E4',
        backgroundImage: `url(${vectorImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    };

    return (
        <div className={styles.countries}>
            <h2 className={styles.title}>COUNTRIES</h2>
            <ul className={styles.countriesList}>
                {countries.map((country, index) => (
                    <li key={index} className={styles.countriesListItem}>
                        <input
                            type="checkbox"
                            checked={!!checkedCountries[country]}
                            onChange={(e) => handleCheckboxChange(country, e.target.checked)}
                            style={checkedCountries[country] ? checkedCheckboxStyle : checkboxStyle}
                        />
                        {country}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Countries;
