import React, { useState } from 'react';
import searchIcon from "../../../images/icons/search.png";
function OffersSearchBar() {
    const [searchTerm, setSearchTerm] = useState('');

    // const handleSearch = (event) => {
    //     setSearchTerm(event.target.value);
    //     // Perform search logic here
    // };

    return (
        <div className="searchbar">
            <img src={searchIcon} alt="search" />
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                // onChange={handleSearch}
            />
        </div>
    );
}

export default OffersSearchBar;
