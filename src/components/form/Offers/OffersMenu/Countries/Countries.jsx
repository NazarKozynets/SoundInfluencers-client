import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import styles from './countries.module.css';

const Countries = ({ filterParams, influencers, setCheckedCountries, setFilteredInfluencersByCountries, updateFilterParams }) => {
    const [localCheckedCountries, setLocalCheckedCountries] = useState({});

    const isMobile = window.innerWidth <= 768;

    const categories = {
        'North America': [
            'US', 'Canada', 'Mexico', 'Guatemala', 'Belize', 'El Salvador',
            'Honduras', 'Costa Rica', 'Nicaragua', 'Panama', 'Bermuda',
            'Bahamas', 'Haiti', 'Cuba', 'Jamaica', 'Dominican Republic',
            'Dominica', 'St. Kitts and Nevis', 'St. Lucia',
            'St. Vincent and The Grenadines', 'Barbados', 'Grenada',
            'Trinidad and Tobago'
        ],
        'Europe': [
            'UK', 'Germany', 'Italy', 'Spain', 'France', 'Netherlands',
            'Belgium', 'Ireland', 'Portugal', 'Switzerland', 'Austria',
            'Czech Republic', 'Poland', 'Romania', 'Slovakia', 'Croatia',
            'Serbia', 'Bosnia and Herzegovina', 'Montenegro', 'Albania',
            'Macedonia', 'Greece', 'Bulgaria', 'Norway', 'Sweden',
            'Finland', 'Denmark', 'Estonia', 'Latvia', 'Lithuania',
            'Belarus', 'Iceland', 'Andorra', 'Liechtenstein', 'Luxembourg',
            'Malta'
        ],
        'LATAM': [
            'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Bolivia',
            'Paraguay', 'Uruguay', 'Venezuela', 'Ecuador', 'Guyana',
            'Suriname'
        ],
        'Middle East': [
            'Turkey', 'UAE', 'Qatar', 'Bahrain', 'Saudi Arabia', 'Kuwait',
            'Iraq', 'Jordan', 'Israel', 'Lebanon', 'Syria', 'Oman', 'Yemen',
            'Iran', 'Armenia', 'Azerbaijan', 'Cyprus'
        ],
        'Asia': [
            'India', 'China', 'Japan', 'South Korea', 'North Korea', 'Mongolia',
            'Nepal', 'Sri Lanka', 'Maldives', 'Bhutan', 'Bangladesh', 'Myanmar',
            'Thailand', 'Laos', 'Cambodia', 'Vietnam', 'Malaysia',
            'Singapore', 'Brunei', 'Indonesia', 'East Timor', 'Pakistan',
            'Afghanistan', 'Turkmenistan', 'Uzbekistan', 'Tajikistan',
            'Kyrgyzstan', 'Kazakhstan', 'Georgia'
        ],
        'Africa': [
            'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Egypt', 'Mauritania',
            'Mali', 'Senegal', 'Gambia', 'Guinea Bissau', 'Guinea',
            'Sierra Leone', 'Liberia', 'Ivory Coast', 'Ghana', 'Burkina',
            'Togo', 'Benin', 'Niger', 'Nigeria', 'Chad', 'Cameroon',
            'Central African Republic', 'North Sudan', 'South Sudan',
            'Eritrea', 'Djibouti', 'Ethiopia', 'Somalia', 'Equatorial Guinea',
            'Gabon', 'Republic of Congo', 'Democratic Republic of Congo',
            'Uganda', 'Kenya', 'Rwanda', 'Burundi', 'Tanzania', 'Angola',
            'Zambia', 'Malawi', 'Mozambique', 'Namibia', 'Botswana',
            'Zimbabwe', 'South Africa', 'Lesotho', 'Swaziland',
            'Seychelles', 'Comoros', 'Madagascar', 'Mauritius', 'Cape Verde'
        ],
        'Oceania': [
            'Australia', 'New Zealand', 'Papua New Guinea', 'Fiji', 'Samoa',
            'Tonga', 'Vanuatu', 'Solomon Islands', 'Micronesia',
            'Marshall Islands', 'Palau', 'Nauru', 'Tuvalu', 'Kiribati'
        ]
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
    };


    const getInfluencerCountForCountry = (targetCountry) => {
        if (!Array.isArray(influencers)) {
            return 0;
        }

        const lowerCaseTargetCountry = targetCountry.toLowerCase();

        return influencers.filter(influencer =>
            Array.isArray(influencer.countries) &&
            influencer.countries.some(country =>
                country && country.country && country.country.toLowerCase() === lowerCaseTargetCountry
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
        updateFilterParams({ countries: [] });
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
                                    {isMobile ? (
                                        <input
                                            type="checkbox"
                                            className={classNames(styles.checkbox, {
                                                [styles.checkboxChecked]: filterParams.checkedCountries[region] || localCheckedCountries[region]
                                            })}
                                            checked={!!filterParams.checkedCountries[region] || !!localCheckedCountries[region]}
                                            onChange={(e) => handleCheckboxChange(region, e.target.checked)}
                                        />
                                    ) : (
                                        <input
                                            type="checkbox"
                                            className={classNames(styles.checkbox, {
                                                [styles.checkboxChecked]: localCheckedCountries[region]
                                            })}
                                            checked={!!localCheckedCountries[region]}
                                            onChange={(e) => handleCheckboxChange(region, e.target.checked)}
                                        />
                                    )}
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
                                                    {isMobile ? (
                                                        <input
                                                            type="checkbox"
                                                            className={classNames(styles.checkbox, {
                                                                [styles.checkboxChecked]: filterParams.checkedCountries[country] || localCheckedCountries[country]
                                                            })}
                                                            checked={!!filterParams.checkedCountries[country] || !!localCheckedCountries[country]}
                                                            onChange={(e) => handleCheckboxChange(country, e.target.checked)}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            className={classNames(styles.checkbox, {
                                                                [styles.checkboxChecked]: localCheckedCountries[country]
                                                            })}
                                                            checked={!!localCheckedCountries[country]}
                                                            onChange={(e) => handleCheckboxChange(country, e.target.checked)}
                                                        />
                                                    )}
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
