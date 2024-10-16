import React from "react";
import "./offersSearchBarResult.css";

const OffersSearchBarResult = ({ result, onResultSelect }) => {
    const handleClick = () => {
        onResultSelect(result);
    };

    return (
        <div
            className="search-result"
            onClick={handleClick}
        >
            {result.instagramUsername || result.instagram.instagramUsername}
        </div>
    );
};

export default OffersSearchBarResult;
