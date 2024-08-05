import React from "react";
import "./offersSearchBarResultsList.css";
import OffersSearchBarResult from "../OffersSearchBarResult/OffersSearchBarResult";

const OffersSearchBarResultsList = ({ results, onResultSelect }) => {
    return (
        <div className="results-list">
            {results.map((result, id) => (
                <OffersSearchBarResult
                    result={result}
                    key={id}
                    onResultSelect={onResultSelect}
                />
            ))}
        </div>
    );
};

export default OffersSearchBarResultsList;
