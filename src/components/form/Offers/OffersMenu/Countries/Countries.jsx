import React, {useState} from 'react';
import classNames from 'classnames';
import styles from './countries.module.css';

const Countries = ({influencers, setCheckedCountries, setFilteredInfluencersByCountries, applyFilters}) => {
    const [localCheckedCountries, setLocalCheckedCountries] = useState({});

    const categories = {
        'North America': ['USA', 'Canada'],
        'Europe': ['UK', 'Germany', 'Italy', 'Spain', 'France', 'Netherlands', 'Belgium'],
        'LATAM': ['Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile']
    };

    const handleCheckboxChange = (country, checked) => {
        const newCheckedCountries = {
            ...localCheckedCountries,
            [country]: checked
        };
        setLocalCheckedCountries(newCheckedCountries);
    };

    const getInfluencerCount = (targetCountry) => {
        if (!Array.isArray(influencers)) {
            return 0;
        }

        const lowerCaseTargetCountry = targetCountry.toLowerCase();

        let count = 0;

        influencers.forEach(influencer => {
            if (influencer.countries && Array.isArray(influencer.countries)) {
                const countries = influencer.countries;

                const highestPercentageCountry = countries.reduce((max, current) => {
                    if (current.percentage > max.percentage) {
                        return current;
                    }
                    return max;
                }, {percentage: -Infinity});

                if (highestPercentageCountry.country.toLowerCase() === lowerCaseTargetCountry) {
                    count++;
                }
            }
            // } else {
            //     console.warn("Invalid countries data for influencer:", influencer);
            // }
        });

        return count;
    };

    const seeAllCountries = () => {
        setLocalCheckedCountries({});
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.countriesSection}>
                <div className={styles.header}>
                    <h2 className={styles.title}>COUNTRIES</h2>
                    <button className={styles.seeAllButton} onClick={seeAllCountries} style={{}}><span>see all</span>
                    </button>
                </div>
                <ul className={styles.categoriesList}>
                    {Object.keys(categories).map((region, index) => (
                        <li key={index} className={styles.categoriesListItem}>
                            <div className={styles.categoryItem}>
                                <label>
                                    {/*<input*/}
                                    {/*    type="checkbox"*/}
                                    {/*    className={classNames(styles.checkbox, { [styles.checkboxChecked]: localCheckedCountries[region] })}*/}
                                    {/*    checked={!!localCheckedCountries[region]}*/}
                                    {/*    onChange={(e) => handleCheckboxChange(region, e.target.checked)}*/}
                                    {/*/>*/}
                                    {region}:
                                </label>
                                {/*<button className={styles.randomNumberButton}>0</button>*/}
                            </div>
                            {categories[region].length > 0 && (
                                <ul className={styles.countriesList}>
                                    {categories[region].map((country, idx) => (
                                        <li key={idx} className={styles.countriesListItem}>
                                            <div className={styles.countryItem}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        className={classNames(styles.checkbox, {[styles.checkboxChecked]: localCheckedCountries[country]})}
                                                        checked={!!localCheckedCountries[country]}
                                                        onChange={(e) => handleCheckboxChange(country, e.target.checked)}
                                                    />
                                                    {country}
                                                </label>
                                                <button
                                                    className={styles.randomNumberButton}>{getInfluencerCount(country)}</button>
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
