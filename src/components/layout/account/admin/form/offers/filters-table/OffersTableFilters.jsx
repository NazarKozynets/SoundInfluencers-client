import React, {useEffect, useState} from "react";
import "./offers-table-filters.scss";
import OffersTableFiltersGenres from "./OffersTableFiltersGenres";
import OffersTableFiltersCategories from "./OffersTableFiltersCategories";

const OffersTableFilters = ({influencers, setFilteredInfluencers}) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        if (selectedGenres.length > 0) {
            let filteredInfluencersList = [];

            if (selectedGenres.includes('Techno') && (selectedGenres.includes('Melodic, Minimal') || selectedGenres.includes('Hard, Peak'))) {
                filteredInfluencersList.push(...influencers.filter((influencer) => {
                    return (influencer.musicSubStyles && influencer.musicSubStyles.includes('Hard, Peak')) ||
                        (influencer.musicSubStyles && influencer.musicSubStyles.includes('Melodic, Minimal'));
                }));
            }

            if (selectedGenres.includes('House') && (selectedGenres.includes('Tech House') || selectedGenres.includes('Melodic, Afro'))) {
                filteredInfluencersList.push(...influencers.filter((influencer) => {
                    return (influencer.musicSubStyles && influencer.musicSubStyles.includes('Tech House')) ||
                        (influencer.musicSubStyles && influencer.musicSubStyles.includes('Melodic, Afro'));
                }));
            }

            filteredInfluencersList.push(...influencers.filter((influencer) => {
                return selectedGenres.some(genre =>
                    (influencer.musicStyle && influencer.musicStyle.includes(genre)) ||
                    (influencer.musicStyleOther && influencer.musicStyleOther.includes(genre))
                );
            }));

            setFilteredInfluencers(filteredInfluencersList);
        }
        else if (selectedCategories.length > 0) {
            let filteredInfluencersList = [];

            selectedCategories.forEach(category => {
                filteredInfluencersList.push(...influencers.filter((influencer) => {
                    return influencer.categories.some(influencerCategory => influencerCategory === category);
                }));
            });

            setFilteredInfluencers(filteredInfluencersList);
        } else {
            setFilteredInfluencers(influencers);
        }
    }, [selectedGenres, selectedCategories]);

    return (
        <div className="admin-offers-table-filters">
            <div>
                <p>GENRES</p>
                <OffersTableFiltersGenres selectedCategories={selectedCategories} influencers={influencers}
                                          selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
            </div>
            <div style={{marginTop: 42}}>
                <p>CATEGORIES</p>
                <OffersTableFiltersCategories selectedGenres={selectedGenres} influencers={influencers}
                                              selectedCategories={selectedCategories}
                                              setSelectedCategories={setSelectedCategories}/>
            </div>
        </div>
    );
}

export default OffersTableFilters;