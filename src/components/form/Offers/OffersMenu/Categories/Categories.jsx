import React, { useState } from "react";
import classNames from "classnames";
import styles from "./categories.module.css";

const Categories = () => {
    const [checkedCategories, setCheckedCategories] = useState({});

    const categories = [
        'Ibiza', 'Memes', 'Dancing'
    ];

    const handleCheckboxChange = (category, checked) => {
        setCheckedCategories(prevCheckedCategories => ({
            ...prevCheckedCategories,
            [category]: checked
        }));
    };

    const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

    return (
        <div className={styles.categories}>
            <div className={styles.header}>
                <h2 className={styles.title}>CATEGORIES</h2>
                <button className={styles.seeAllButton}>see all</button>
            </div>
            <ul className={styles.categoriesList}>
                {categories.map((category, index) => (
                    <li key={index} className={styles.categoriesListItem}>
                        <div className={styles.categoryItem}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!checkedCategories[category]}
                                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                                    className={classNames({
                                        [styles.checkbox]: true,
                                        [styles.checkboxChecked]: !!checkedCategories[category]
                                    })}
                                />
                                {category}
                            </label>
                            <button className={styles.randomNumberButton}>{0}</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
