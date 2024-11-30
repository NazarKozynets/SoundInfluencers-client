import React, {useState} from "react";
import {countries} from "../../../utils/countriesList";
import TextInput from "../TextInput";
import './search-country.css';

const SearchCountry = ({indexOfSelectingCountry, selectedCountries, handleCountryChange}) => {
    const [searchValue, setSearchValue] = useState('');

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' && !searchValue && selectedCountries[indexOfSelectingCountry]?.country) {
            handleCountryChange(indexOfSelectingCountry, "country", '');
        }
    };

    const availableCountries = countries
        .filter(country =>
            country.toLowerCase().includes(searchValue.toLowerCase()) && 
            !selectedCountries.some(selected => selected.country === country) 
        );

    return (
        <div className="search-country-block">
            <div className="input">
                <TextInput
                    style={{padding: '13px 10px'}}
                    silverColor={true}
                    value={selectedCountries[indexOfSelectingCountry]?.country ? selectedCountries[indexOfSelectingCountry]?.country : searchValue}
                    setValue={(value) => setSearchValue(value)}
                    placeholder='Find Country'
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className="search-result-container">
                {searchValue.length > 0 && availableCountries.map((country, index) => (
                    <div className="search-result" key={index}
                         onClick={() => {
                             handleCountryChange(indexOfSelectingCountry, "country", country);
                             setSearchValue('');
                         }}>{country}</div>
                ))}
            </div>
        </div>
    );
}

export default SearchCountry;
