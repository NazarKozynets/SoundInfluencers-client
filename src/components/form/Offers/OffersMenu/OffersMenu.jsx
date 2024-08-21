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
                <Genres checkedGenres={props.checkedGenres}
                        influencers={props.influencers}
                        setCheckedGenres={props.setCheckedGenres}
                        setFilteredInfluencersByGenres={props.setFilteredInfluencersByGenres}
                        setCheckedSubGenres={props.setCheckedSubGenres}
                        checkedSubGenres={props.checkedSubGenres}/>
            </div>
            <img src={line} alt="line"/>
            <div className="countries">
                <Countries influencers={props.influencers}
                           setCheckedCountries={props.setCheckedCountries}
                           setFilteredInfluencersByCountries={props.setFilteredInfluencersByCountries}
                           updateFilterParams={props.updateFilterParams}/>
            </div>
            <img src={line} alt="line"/>
            <Categories checkedCategories={props.checkedCategories}
                        influencers={props.influencers}
                        setCheckedCategories={props.setCheckedCategories}
                        setFilteredInfluencersByCategories={props.setFilteredInfluencersByCategories}/>
        </div>
    );
};

export default OffersMenu;