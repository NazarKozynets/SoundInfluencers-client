import React, { useState } from "react";
import styles from "./categories.module.css";
import vectorImage from "../../../../images/vector.png"; 

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

    const checkboxStyle = {
        width: '20px',
        height: '20px',
        border: '2px solid #3330E4',
        borderRadius: '3px',
        position: 'relative',
        marginRight: '10px',
        cursor: 'pointer',
        verticalAlign: 'middle',
    };

    const checkedCheckboxStyle = {
        ...checkboxStyle,
        backgroundColor: '#3330E4',
        backgroundImage: `url(${vectorImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    };

    return (
        <div className={styles.categories}>
            <h2 className={styles.title}>CATEGORIES</h2>
            <ul className={styles.categoriesList}>
                {categories.map((category, index) => (
                    <li key={index} className={styles.categoriesListItem}>
                        <input
                            type="checkbox"
                            checked={!!checkedCategories[category]}
                            onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                            style={checkedCategories[category] ? checkedCheckboxStyle : checkboxStyle}
                        />
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
