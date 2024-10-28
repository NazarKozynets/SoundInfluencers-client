import React from "react";
import "./searchbarresult.css";

const SearchBarResult = ({result, onResultSelect, typeOfSearch}) => {
    const handleClick = () => {
        onResultSelect(result);
    };

    const showResult = () => {
        switch (typeOfSearch) {
            case "companyNameForInvoices":
                return result.companyName + "   " + result.amount + "€";
            case "influencers":
                if (result.instagram !== undefined) {
                    return result.instagram.instagramUsername;
                } else {
                    return result.instagramUsername;
                }
            case "campaigns":
                return result.campaignName;
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
