import React from "react";
import searchIcon from "../../../../images/icons/search.svg";
import "./searchbarinput.css";

const SearchBarInput = ({input, onChange}) => {
    const handleChange = (e) => {
        const value = e.target.value;

        onChange(value);
    };

    return (
        <div className={`input-wrapper`}>
            <img src={searchIcon} className="search-icon"/>
            <input
                placeholder="Search"
                value={input}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBarInput;
