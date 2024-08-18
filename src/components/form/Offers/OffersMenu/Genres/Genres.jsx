import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './genres.module.css';

const Genres = ({ setCheckedGenres, influencers, setFilteredInfluencersByGenres, applyFilters }) => {
    const [localCheckedGenres, setLocalCheckedGenres] = useState({});

    const genres = [
        { genre: 'Techno', subText: 'Melodic, Minimal' },
        { genre: 'Techno', subText: 'Hard, Peak' },
        { genre: 'House', subText: 'Tech House' },
        { genre: 'House', subText: 'Melodic, Afro' },
        { genre: 'EDM' },
        { genre: 'D&B' },
        { genre: 'Bass' },
        { genre: 'Psy, Trance' },
        { genre: 'Dubstep' }
    ];

    const groupedGenres = genres.reduce((acc, { genre, subText }) => {
        if (!acc[genre]) {
            acc[genre] = [];
        }
        if (subText) {
            acc[genre].push(subText);
        }
        return acc;
    }, {});

    const handleCheckboxChange = (genre, checked) => {
        const newCheckedGenres = {
            ...localCheckedGenres,
            [genre]: checked
        };
        setLocalCheckedGenres(newCheckedGenres);
        setCheckedGenres(newCheckedGenres);
        applyFilters(); 
    };

    const getInfluencerCountForGenre = (musicStyle) => {
        return influencers.filter(influencer => influencer.musicStyle === musicStyle).length;
    };

    const getInfluencerCountForSubGenre = (subGenre) => {
        return influencers.filter(influencer =>
            influencer.musicSubStyles && influencer.musicSubStyles.some(style => style === subGenre)
        ).length;
    };

    const seeAllGenres = () => {
        setLocalCheckedGenres({});
        setCheckedGenres({});
        setFilteredInfluencersByGenres(influencers);
        applyFilters(); 
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.genresSection}>
                <div className={styles.header}>
                    <h2 className={styles.title}>GENRES</h2>
                    <button className={styles.seeAllButton} onClick={seeAllGenres} >see all</button>
                </div>
                <ul className={styles.genresList}>
                    {Object.keys(groupedGenres).map((genre, index) => (
                        <li key={index} className={styles.genresListItem}>
                            <div className={styles.genreItem}>
                                <label>
                                    <input
                                        type="checkbox"
                                        className={classNames(styles.checkbox, { [styles.checkboxChecked]: localCheckedGenres[genre] })}
                                        checked={!!localCheckedGenres[genre]}
                                        onChange={(e) => handleCheckboxChange(genre, e.target.checked)}
                                    />
                                    {genre}
                                </label>
                                <button className={styles.randomNumberButton}>{getInfluencerCountForGenre(genre)}</button>
                            </div>
                            {groupedGenres[genre].length > 0 && (
                                <ul className={styles.subgenresList}>
                                    {groupedGenres[genre].map((subText, subIndex) => (
                                        <li key={subIndex} className={styles.subgenresListItem}>
                                            <div className={styles.subgenreItem}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        className={classNames(styles.checkbox, { [styles.checkboxChecked]: localCheckedGenres[subText] })}
                                                        checked={!!localCheckedGenres[subText]}
                                                        // onChange={(e) => handleCheckboxChange(subText, e.target.checked)}
                                                    />
                                                    {subText}
                                                </label>
                                                <button className={styles.randomNumberButton}>{getInfluencerCountForSubGenre(subText)}</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Genres;
