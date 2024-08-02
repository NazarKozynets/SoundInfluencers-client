import React from "react";
import Genres from "./Genres/Genres";
import Countries from "./Countries/Countries";
import Categories from "./Categories/Categories";
import "./offersMenu.css";
import line from "../../../../images/line-32.png";

const OffersMenu = (props) => {
    return (
        <div className="menu">
            <div className="genres">
                <Genres influencers={props.influencers} 
                        setCheckedGenres={props.setCheckedGenres}
                        setFilteredInfluencersByGenres={props.setFilteredInfluencersByGenres}
                        applyFilters={props.applyFilters}/>
            </div>
            <img src={line} alt="line"/>
            <div className="countries">
                <Countries/>
            </div>
            <img src={line} alt="line"/>
            <Categories/>
        </div>
    );
};

export default OffersMenu;