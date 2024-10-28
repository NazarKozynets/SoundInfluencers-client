import React, { useState } from "react";

const OffersTableFiltersCategories = ({ influencers, selectedCategories, setSelectedCategories, selectedGenres }) => {
    const [categories, setCategories] = useState({
        'Ibiza': false,
        'Meme': false,
        'Dancing': false,
    });

    const getInfluencersCountForCategory = (category) => {
        return influencers.filter(influencer => influencer.categories && influencer.categories.includes(category)).length;
    };

    const handleCategoryChange = (category) => {
        if (selectedGenres.length === 0) {
            const updatedCategories = {...categories, [category]: !categories[category]};
            setCategories(updatedCategories);

            if (!categories[category]) {
                setSelectedCategories([...selectedCategories, category]);
            } else {
                setSelectedCategories(selectedCategories.filter(selected => selected !== category));
            }
        }
    };

    return (
        <div className="list">
            {Object.keys(categories).map((category, index) => {
                return (
                    <div key={index} className='list-item'>
                        <div style={{display: 'flex'}}>
                            <input type='checkbox' checked={categories[category]}
                                   onChange={() => handleCategoryChange(category)} />
                            <p>{category}</p>
                        </div>
                        <div>
                            <span className="list-item-num-of-networks"> 
                                {getInfluencersCountForCategory(category)}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OffersTableFiltersCategories;
