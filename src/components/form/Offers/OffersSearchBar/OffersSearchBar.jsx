import React from "react";  
import { useState } from "react";
import searchIcon from "../../../../images/icons/search.svg";
import "./offersSearchBar.css";

const SearchBar = () => {
    const [input, setInput] = useState("");

    const handleChange = (value) => {
        setInput(value);
    };

    return (
        <div className="input-wrapper">
            <img src={searchIcon} className="search-icon"/>
            <input
                placeholder="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;