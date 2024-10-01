import React from "react";
import "./searchbarresultslist.css";
import SearchBarResult from "../SearchBarResult/SearchBarResult";

const SearchBarResultsList = ({ results, onResultSelect }) => {
    return (
        <div className="results-list">
            {results.map((result, id) => (
                <SearchBarResult
                    result={result}
                    key={id}
                    onResultSelect={onResultSelect}
                />
            ))}
        </div>
    );
};

export default SearchBarResultsList;
