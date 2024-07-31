import React, { useState } from 'react';
import styles from './seeAll.module.css'; 
const SeeAll = ({ items, resetSelections }) => {
    // Generate random numbers for the button labels
    const getRandomNumber = () => Math.floor(Math.random() * 100) + 1;

    const [selectedItems, setSelectedItems] = useState({});

    const handleButtonClick = (item) => {
        setSelectedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const handleReset = () => {
        setSelectedItems({});
        resetSelections();
    };

    return (
        <div className={styles.container}>
            <button className={styles.seeAllButton} onClick={handleReset}>
                See All
            </button>
            <div className={styles.buttonsContainer}>
                {items.map((item, index) => (
                    <div key={index} className={styles.buttonWrapper}>
                        <button
                            className={`${styles.itemButton} ${selectedItems[item] ? styles.selected : ''}`}
                            onClick={() => handleButtonClick(item)}
                        >
                            {getRandomNumber()}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeeAll;
