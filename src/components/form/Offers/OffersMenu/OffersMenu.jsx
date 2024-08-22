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
                        checkedSubGenres={props.checkedSubGenres}
                        checkedCategories={props.checkedCategories}
                        filterParams={props.filterParams}/>
            </div>
            <img src={line} alt="line"/>
            <div className="countries">
                <Countries influencers={props.influencers}
                           setCheckedCountries={props.setCheckedCountries}
                           setFilteredInfluencersByCountries={props.setFilteredInfluencersByCountries}
                           updateFilterParams={props.updateFilterParams}
                           filterParams={props.filterParams}/>
            </div>
            <img src={line} alt="line"/>
            <div className="categories">
                <Categories checkedCategories={props.checkedCategories}
                            checkedGenres={props.checkedGenres}
                            checkedSubGenres={props.checkedSubGenres}
                            influencers={props.influencers}
                            setCheckedCategories={props.setCheckedCategories}
                            setFilteredInfluencersByCategories={props.setFilteredInfluencersByCategories}
                            filterParams={props.filterParams}/>
            </div>
        </div>
    );
};

export default OffersMenu;