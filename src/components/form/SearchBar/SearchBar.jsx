import React, { useEffect, useState } from "react";
import SearchBarInput from "./SearchBarInput/SearchBarInput";
import SearchBarResultsList from "./SearchBarResultsList/SearchBarResultsList";
import "./searchbar.css";

const SearchBarComponent = ({ data, searchFunction, setSearchResult, className, typeOfSearch }) => {
    const [searchInput, setSearchInput] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (searchInput === "") {
            setSearchResult(null);
            setShowResults(false);
        } else {
            const filteredResults = searchFunction(data, searchInput);
            setResults(filteredResults);
            setShowResults(true);
        }
    }, [searchInput]);

    const handleSearchInputChange = (input) => {
        setSearchInput(input);
    };

    const handleResultSelect = (result) => {
        setSearchResult(result);
        setTimeout(() => {
            setShowResults(false);
        }, 0);
    };

    return (
        <div className={`search-container ${className}`}>
            <SearchBarInput input={searchInput} onChange={handleSearchInputChange}/>
            {showResults && searchInput && (
                <SearchBarResultsList
                    results={results}
                    onResultSelect={handleResultSelect}
                    typeOfSearch={typeOfSearch}
                />
            )}
        </div>
    );
}

export default SearchBarComponent;
