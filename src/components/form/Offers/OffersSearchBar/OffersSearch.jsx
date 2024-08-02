import React from "react";  
import { useState } from "react";
import SearchBar from "./OffersSearchBar/OffersSearchBar";
import OffersSearchBarResult from "./OffersSearchBarResult/OffersSearchBarResult";
import OffersSearchBarResultsList from "./OffersSearchBarResultList/OffersSearchBarResultsList";

const OffersSearch = () => {
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState([]);

    const influencers = [
        {name: 'Influencer 1'},
        {name: 'Influencer 2'},
        {name: 'Influencer 3'},
        // добавьте свои данные
    ];

    const handleSearchInputChange = (input) => {
        setSearchInput(input);
        if (input === "") {
            setResults([]);
        } else {
            const filteredResults = influencers.filter(influencer =>
                influencer.name.toLowerCase().includes(input.toLowerCase())
            );
            setResults(filteredResults);
        }
    };

    return (
        <div className="search-container">
            <SearchBar input={searchInput} onChange={handleSearchInputChange}/>
            <OffersSearchBarResultsList results={results}/>
        </div>
    );
}

export default OffersSearch;