import React from "react";
import searchIcon from "../../../../images/icons/search.svg";
import "./searchbarinput.css";

const SearchBarInput = ({ input, onChange }) => {
    const handleChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9\s-]*$/;

        if (regex.test(value)) {
            onChange(value);
        }
    };

    return (
        <div className={`input-wrapper`}>
            <img src={searchIcon} className="search-icon" />
            <input
                placeholder="Search"
                value={input}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBarInput;
