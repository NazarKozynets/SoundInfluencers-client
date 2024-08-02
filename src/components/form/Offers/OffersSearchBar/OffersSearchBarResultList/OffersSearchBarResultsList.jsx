import React from "react";
import "./offersSearchBarResultsList.css";
import OffersSearchBarResult from "../OffersSearchBarResult/OffersSearchBarResult";

const OffersSearchBarResultsList = ({ results }) => {
    return (
        <div className="results-list">
            {results.map((result, id) => {
                return <OffersSearchBarResult result={result.name} key={id} />;
            })}
        </div>
    );
};

export default OffersSearchBarResultsList;