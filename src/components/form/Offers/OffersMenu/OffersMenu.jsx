import React from "react";
import Genres from "./Genres/Genres";
import Countries from "./Countries/Contries";
import Categories from "./Categories/Categories";
import "./offersMenu.css";
import line from "../../../../images/line-32.png";

const OffersMenu = ({genres, countries, categories}) => {
    return (
        <div className="menu">
            <div className="genres">
                <Genres genres={genres}/>
            </div>
            <img src={line} alt="line"/>
            <div className="countries">
                <Countries countries={countries}/>
            </div>
            <img src={line} alt="line"/>
            <Categories categories={categories}/>
        </div>
    );
};

export default OffersMenu;