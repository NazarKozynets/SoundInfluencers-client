import React, { useState, useEffect } from "react";
import SearchBar from "./OffersSearchBar/OffersSearchBar";
import OffersSearchBarResultsList from "./OffersSearchBarResultList/OffersSearchBarResultsList";
import "./offersSearch.css";

const OffersSearch = ({ filteredInfluencers, setSearchResult }) => {
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(true);

    useEffect(() => {
        if (searchInput === "") {
            setSearchResult(null);
            setShowResults(false); 
        } else {
            const filteredResults = filteredInfluencers.filter(influencer =>
                influencer.instagramUsername && influencer.instagramUsername.toLowerCase().includes(searchInput.toLowerCase())
            );
            setResults(filteredResults);
            setShowResults(true); 
        }
    }, [searchInput, filteredInfluencers, setSearchResult]);

    const handleSearchInputChange = (input) => {
        setSearchInput(input);
    };

    const handleResultSelect = (result) => {
        setSearchResult(result);
        setShowResults(false); 
    };

    return (
        <div className="search-container">
            <SearchBar input={searchInput} onChange={handleSearchInputChange} />
            {showResults && searchInput && (
                <OffersSearchBarResultsList
                    results={results}
                    onResultSelect={handleResultSelect}
                />
            )}
        </div>
    );
};

export default OffersSearch;
