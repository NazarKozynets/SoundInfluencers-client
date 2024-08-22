import React, {useEffect, useState} from "react";
import filterImg from '../../../../../../images/icons/filter.svg';
import OffersSearch from "../../../../../form/Offers/OffersSearchBar/OffersSearch";
import {Sheet} from 'react-modal-sheet';
import './mobileInfluencersMenu.css';
import closeImg from '../../../../../../images/icons/close.svg';
import OffersBudgetSelect from "../../../../../form/Offers/OffersBudgetSelect/OffersBudgetSelect";
import OffersSortMenu from "../../../../../form/Offers/OffersSortMenu/OffersSortMenu";
import OffersMenu from "../../../../../form/Offers/OffersMenu/OffersMenu";

const MobileInfluencersListMenu = (props) => {
    const [isFiltersWindowOpen, setIsFiltersWindowOpen] = useState(false);
    const [mobileFilterParams, setMobileFilterParams] = useState(props.filterParams);
    const [mobileBudget, setMobileBudget] = useState(null);
    
    return (
        <div>
            <div className="account-client-mobile-filtering-buttons">
                <button onClick={() => setIsFiltersWindowOpen(true)}
                        className="account-client-mobile-filtering-buttons-filters">
                    <img src={filterImg} alt="filter"/>
                    <span>Filters</span>
                </button>
                <OffersSearch filteredInfluencers={props.filteredInfluencers}
                              setSearchResult={props.setSearchResult}/>

                <Sheet isOpen={isFiltersWindowOpen} onClose={() => setIsFiltersWindowOpen(false)} disableDrag={false}>
                    <Sheet.Container className="filters-window-container">
                        <Sheet.Header className="filters-window-header">
                            <span>Filters</span>
                            <button onClick={() => setIsFiltersWindowOpen(false)}><img src={closeImg} alt=""/></button>
                        </Sheet.Header>
                        <Sheet.Content className="filters-window-content" disableDrag={true}>
                            <Sheet.Scroller>
                                    <div className="filters-window-content-budget">
                                        <OffersBudgetSelect setBudget={props.setBudget}
                                                            setFilteredInfluencersByBudget={props.setFilteredInfluencersByBudget}
                                                            applyFiltersByBudget={props.applyFiltersByBudget}
                                                            setMobileBudget={setMobileBudget}
                                                            mobileBudget={mobileBudget}
                                                            setActiveIndices={props.setActiveIndices}/>
                                    </div>
                                    <div className="filters-window-content-sort-menu">
                                        <OffersSortMenu selectedOption={props.selectedOption}
                                                        onSortChange={props.onSortChange}/>
                                    </div>
                                    <div className="filters-window-content-offers-menu">
                                        <OffersMenu influencers={props.influencers}
                                                    setCheckedGenres={props.setCheckedGenres}
                                                    setCheckedCategories={props.setCheckedCategories}
                                                    setCheckedSubGenres={props.setCheckedSubGenres}
                                                    setCheckedCountries={props.setCheckedCountries}
                                                    setFilteredInfluencersByGenres={props.setFilteredInfluencersByGenres}
                                                    setFilteredInfluencersByCountries={props.setFilteredInfluencersByCountries}
                                                    setFilteredInfluencersByCategories={props.setFilteredInfluencersByCategories}
                                                    checkedGenres={props.checkedGenres}
                                                    filterParams={props.filterParams}
                                                    checkedCategories={props.checkedCategories}
                                                    checkedSubGenres={props.checkedSubGenres}
                                                    updateFilterParams={props.updateFilterParams}/>
                                    </div>
                            </Sheet.Scroller>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop/>
                </Sheet>
            </div>
        </div>
    );
}

export default MobileInfluencersListMenu;