import React from "react";
import "./searchbarresultslist.css";
import SearchBarResult from "../SearchBarResult/SearchBarResult";

const SearchBarResultsList = ({ results, onResultSelect, typeOfSearch }) => {
    return (
        <div className="results-list">
            {results.map((result, id) => (
                <SearchBarResult
                    result={result}
                    key={id}
                    onResultSelect={onResultSelect}
                    typeOfSearch={typeOfSearch}
                />
            ))}
        </div>
    );
};

export default SearchBarResultsList;
