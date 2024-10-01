import React from "react";
import "./searchbarresult.css";

const SearchBarResult = ({ result, onResultSelect }) => {
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

export default SearchBarResult;
