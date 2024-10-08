import React from "react";
import "./searchbarresult.css";

const SearchBarResult = ({ result, onResultSelect, typeOfSearch}) => {
    const handleClick = () => {
        onResultSelect(result);
    };

    const showResult = () => {
        switch (typeOfSearch) {
            case "companyNameForInvoices":
                return result.companyName + "   " + result.amount + "€";
            case "influencers":
                return result.instagram.instagramUsername || result.instagramUsername;
            default:
                break;
        }
    };
    
    return (
        <div
            className="search-result"
            onClick={handleClick}
        >
            {showResult()}
        </div>
    );
};

export default SearchBarResult;
