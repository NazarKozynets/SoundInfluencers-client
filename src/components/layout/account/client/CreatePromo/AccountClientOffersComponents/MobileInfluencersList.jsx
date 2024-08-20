import React, {useEffect} from "react";
import filterImg from '../../../../../../images/icons/filter.svg';
import OffersSearch from "../../../../../form/Offers/OffersSearchBar/OffersSearch";

const MobileInfluencersList = (props) => {

    return (
        <div>
            <div className="account-client-mobile-filtering-buttons">
                <button onClick={() => console.log(props.filteredInfluencers, 'filtered')}
                        className="account-client-mobile-filtering-buttons-filters">
                    <img src={filterImg} alt="filter"/>
                    <span>Filters</span>
                </button>
                <OffersSearch filteredInfluencers={props.filteredInfluencers}
                              setSearchResult={props.setSearchResult}/>
            </div>
        </div>
    );
}

export default MobileInfluencersList;