import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './countries.module.css';

const Countries = ({ influencers, setCheckedCountries, setFilteredInfluencersByCountries, applyFilters }) => {
    const [localCheckedCountries, setLocalCheckedCountries] = useState({});

    const categories = {
        'North America': ['US', 'Canada'],
        'Europe': ['UK', 'Germany', 'Italy', 'Spain', 'France', 'Netherlands', 'Belgium'],
        'LATAM': ['Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile']
    };

    const handleCheckboxChange = (item, checked) => {
        let newCheckedCountries = { ...localCheckedCountries };

        if (categories[item]) {
            categories[item].forEach(country => {
                newCheckedCountries[country] = checked;
            });
            newCheckedCountries[item] = checked;
        } else {
            newCheckedCountries[item] = checked;
        }

        setLocalCheckedCountries(newCheckedCountries);
        setCheckedCountries(newCheckedCountries);
        applyFilters();
    };

    const getInfluencerCountForCountry = (targetCountry) => {
        if (!Array.isArray(influencers)) {
            return 0;
        }

        const lowerCaseTargetCountry = targetCountry.toLowerCase();

        return influencers.filter(influencer =>
            Array.isArray(influencer.countries) &&
            influencer.countries.some(country =>
                country.country.toLowerCase() === lowerCaseTargetCountry
            )
        ).length;
    };

    const getSelectedStateForRegion = (region) => {
        if (!categories[region]) return false;

        return categories[region].every(country => localCheckedCountries[country]);
    };

    const seeAllCountries = () => {
        setLocalCheckedCountries({});
        setCheckedCountries({});
        setFilteredInfluencersByCountries(influencers);
        applyFilters();
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.countriesSection}>
                <div className={styles.header}>
                    <h2 className={styles.title}>COUNTRIES</h2>
                    <button className={styles.seeAllButton} onClick={seeAllCountries}>see all</button>
                </div>
                <ul className={styles.categoriesList}>
                    {Object.keys(categories).map((region, index) => (
                        <li key={index} className={styles.categoriesListItem}>
                            <div className={styles.categoryItem}>
                                <label>
                                    <input
                                        type="checkbox"
                                        className={classNames(styles.checkbox, { [styles.checkboxChecked]: getSelectedStateForRegion(region) })}
                                        checked={!!localCheckedCountries[region]}
                                        onChange={(e) => handleCheckboxChange(region, e.target.checked)}
                                    />
                                    {region}:
                                </label>
                                <button className={styles.randomNumberButton}>
                                    {categories[region].reduce((sum, country) => sum + getInfluencerCountForCountry(country), 0)}
                                </button>
                            </div>
                            {categories[region].length > 0 && (
                                <ul className={styles.countriesList}>
                                    {categories[region].map((country, idx) => (
                                        <li key={idx} className={styles.countriesListItem}>
                                            <div className={styles.countryItem}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        className={classNames(styles.checkbox, { [styles.checkboxChecked]: localCheckedCountries[country] })}
                                                        checked={!!localCheckedCountries[country]}
                                                        onChange={(e) => handleCheckboxChange(country, e.target.checked)}
                                                    />
                                                    {country}
                                                </label>
                                                <button className={styles.randomNumberButton}>
                                                    {getInfluencerCountForCountry(country)}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Countries;
