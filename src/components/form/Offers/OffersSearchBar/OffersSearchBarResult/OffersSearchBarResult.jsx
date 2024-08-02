import React from "react";
import "./offersSearchBarResult.css";

const OffersSearchBarResult = ({ result }) => {
    return (
        <div
            className="search-result"
            onClick={(e) => alert(`You selected ${result}!`)}
        >
            {result}
        </div>
    );
};

export default OffersSearchBarResult;