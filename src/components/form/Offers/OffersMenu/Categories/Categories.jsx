import React, {useEffect, useState} from "react";
import classNames from "classnames";
import styles from "./categories.module.css";
import {isMobile} from "react-device-detect";

const Categories = ({
                        filterParams,
                        checkedCategories,
                        influencers,
                        checkedGenres,
                        checkedSubGenres,
                        setCheckedCategories,
                        setFilteredInfluencersByCategories
                    }) => {
    const [localCheckedCategories, setLocalCheckedCategories] = useState({});

    const isMobile = window.innerWidth <= 768;
    
    const categories = [
        'Ibiza', 'Meme', 'Dancing'
    ];

    const handleCheckboxChange = (category, checked) => {
        const hasActiveGenres = Object.values(checkedGenres).some(value => value === true);
        const hasActiveSubGenres = Object.values(checkedSubGenres).some(value => value === true);

        if (hasActiveGenres || hasActiveSubGenres) {
            return;
        }
        const newCheckedCategories = {
            ...localCheckedCategories,
            [category]: checked
        };
        setLocalCheckedCategories(newCheckedCategories);
        setCheckedCategories(newCheckedCategories);
    }; 

    const getInfluencersCountForCategory = (category) => {
        return influencers.filter(influencer => influencer.categories && influencer.categories.includes(category)).length;
    };

    const seeAllCategories = () => {
        setLocalCheckedCategories({});
        setCheckedCategories({});
        setFilteredInfluencersByCategories(influencers);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.categories}>
                <div className={styles.header}>
                    <h2 className={styles.title}>CATEGORIES</h2>
                    <button className={styles.seeAllButton} onClick={seeAllCategories}>see all</button>
                </div>
                <ul className={styles.categoriesList}>
                    {categories.map((category, index) => (
                        <li key={index} className={styles.categoriesListItem}>
                            <div className={styles.categoryItem}>
                                <label>
                                    {isMobile ? (<input
                                        type="checkbox"
                                        checked={!!filterParams.checkedCategories[category] || !!localCheckedCategories[category]}
                                        onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                                        className={classNames({
                                            [styles.checkbox]: true,
                                            [styles.checkboxChecked]: !!filterParams.checkedCategories[category] || !!localCheckedCategories[category]
                                        })}
                                    />) : <input
                                        type="checkbox"
                                        checked={!!localCheckedCategories[category]}
                                        onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                                        className={classNames({
                                            [styles.checkbox]: true,
                                            [styles.checkboxChecked]: !!localCheckedCategories[category]
                                        })}
                                    />}
                                    {category}
                                </label>
                                <button
                                    className={styles.randomNumberButton}>{getInfluencersCountForCategory(category)}</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Categories;
