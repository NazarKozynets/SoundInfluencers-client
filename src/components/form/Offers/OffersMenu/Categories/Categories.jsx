import React, {useEffect, useState} from "react";
import classNames from "classnames";
import styles from "./categories.module.css";

const Categories = ({
                        checkedCategories,
                        influencers,
                        setCheckedCategories,
                        setFilteredInfluencersByCategories
                    }) => {
    const [localCheckedCategories, setLocalCheckedCategories] = useState({});

    useEffect(() => {
        setLocalCheckedCategories(checkedCategories || {});
    }, [checkedCategories]);

    const categories = [
        'Ibiza', 'Memes', 'Dancing'
    ];

    const handleCheckboxChange = (category, checked) => {
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
                                <input
                                    type="checkbox"
                                    checked={!!localCheckedCategories[category]}
                                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                                    className={classNames({
                                        [styles.checkbox]: true,
                                        [styles.checkboxChecked]: !!localCheckedCategories[category]
                                    })}
                                />
                                {category}
                            </label>
                            <button
                                className={styles.randomNumberButton}>{getInfluencersCountForCategory(category)}</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
