import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './genres.module.css';

const Genres = ({
                    checkedSubGenres,
                    checkedGenres,
                    filterParams,
                    setCheckedGenres,
                    setCheckedSubGenres,
                    influencers,
                    setFilteredInfluencersByGenres,
                    checkedCategories
                }) => {
    const [localCheckedGenres, setLocalCheckedGenres] = useState({});
    const [localCheckedSubGenres, setLocalCheckedSubGenres] = useState({});

    const isMobile = window.innerWidth <= 768;

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
        const hasActiveCategories = Object.values(checkedCategories).some(value => value === true);
        if (hasActiveCategories) {
            return;
        }

        const newCheckedGenres = {
            ...localCheckedGenres,
            [genre]: checked
        };

        setLocalCheckedGenres(newCheckedGenres);
        setCheckedGenres(newCheckedGenres);

        if (groupedGenres[genre]) {
            const newCheckedSubGenres = groupedGenres[genre].reduce((acc, subText) => {
                acc[subText] = checked;
                return acc;
            }, {});
            setLocalCheckedSubGenres({
                ...localCheckedSubGenres,
                ...newCheckedSubGenres
            });
            setCheckedSubGenres({
                ...checkedSubGenres,
                ...newCheckedSubGenres
            });
        }
    };

    const handleSubCheckboxChange = (subGenre, checked) => {
        const hasActiveCategories = Object.values(checkedCategories).some(value => value === true);
        if (hasActiveCategories) {
            return;
        }

        const newCheckedSubGenres = {
            ...localCheckedSubGenres,
            [subGenre]: checked
        };
        setLocalCheckedSubGenres(newCheckedSubGenres);
        setCheckedSubGenres(newCheckedSubGenres);

        const genre = Object.keys(groupedGenres).find(genre => groupedGenres[genre].includes(subGenre));
        if (genre) {
            const hasActiveSubGenres = groupedGenres[genre].some(subText => newCheckedSubGenres[subText]);

            if (hasActiveSubGenres) {
                setLocalCheckedGenres(prev => ({
                    ...prev,
                    [genre]: true
                }));
                setCheckedGenres(prev => ({
                    ...prev,
                    [genre]: true
                }));
            } else {
                setLocalCheckedGenres(prev => ({
                    ...prev,
                    [genre]: false
                }));
                setCheckedGenres(prev => ({
                    ...prev,
                    [genre]: false
                }));
            }
        }
    };


    const getInfluencerCountForGenre = (musicStyle) => {
        return influencers.filter(influencer => influencer.musicStyle === musicStyle).length;
    };

    const getInfluencerCountForSubGenre = (subGenre) => {
        return influencers.filter(influencer =>
            influencer.musicSubStyles && influencer.musicSubStyles.some(style => style === subGenre)
        ).length;
    };

    const getTotalInfluencerCountForGenre = (genre) => {
        let totalCount = getInfluencerCountForGenre(genre); 

        if (groupedGenres[genre] && groupedGenres[genre].length > 0) {
            groupedGenres[genre].forEach((subText) => {
                totalCount += getInfluencerCountForSubGenre(subText); 
            });
        }

        return totalCount;
    };

    const seeAllGenres = () => {
        setLocalCheckedGenres({});
        setCheckedGenres({});
        setLocalCheckedSubGenres({});
        setCheckedSubGenres({});
        setFilteredInfluencersByGenres(influencers);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.genresSection}>
                <div className={styles.header}>
                    <h2 className={styles.title}>GENRES</h2>
                    <button className={styles.seeAllButton} onClick={seeAllGenres}>see all</button>
                </div>
                <ul className={styles.genresList}>
                    {Object.keys(groupedGenres).map((genre, index) => (
                        <li key={index} className={styles.genresListItem}>
                            <div className={styles.genreItem}>
                                <label>
                                    {isMobile ? (
                                        <input
                                            type="checkbox"
                                            className={classNames(styles.checkbox, {
                                                [styles.checkboxChecked]: filterParams.checkedGenres[genre] || localCheckedGenres[genre]
                                            })}
                                            checked={!!filterParams.checkedGenres[genre] || !!localCheckedGenres[genre]}
                                            onChange={(e) => handleCheckboxChange(genre, e.target.checked)}
                                        />
                                    ) : (
                                        <input
                                            type="checkbox"
                                            className={classNames(styles.checkbox, { [styles.checkboxChecked]: localCheckedGenres[genre] })}
                                            checked={!!localCheckedGenres[genre]}
                                            onChange={(e) => handleCheckboxChange(genre, e.target.checked)}
                                        />
                                    )}
                                    {genre}
                                </label>
                                <button className={styles.randomNumberButton}>
                                    {getTotalInfluencerCountForGenre(genre)}
                                </button>
                            </div>
                            {groupedGenres[genre].length > 0 && (
                                <ul className={styles.subgenresList}>
                                    {groupedGenres[genre].map((subText, subIndex) => (
                                        <li key={subIndex} className={styles.subgenresListItem}>
                                            <div className={styles.subgenreItem}>
                                                <label>
                                                    {isMobile ? (
                                                        <input
                                                            type="checkbox"
                                                            className={classNames(styles.checkbox, {
                                                                [styles.checkboxChecked]: filterParams.checkedSubGenres[subText] || localCheckedSubGenres[subText]
                                                            })}
                                                            checked={!!filterParams.checkedSubGenres[subText] || !!localCheckedSubGenres[subText]}
                                                            onChange={(e) => handleSubCheckboxChange(subText, e.target.checked)}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            className={classNames(styles.checkbox, { [styles.checkboxChecked]: localCheckedSubGenres[subText] })}
                                                            checked={!!localCheckedSubGenres[subText]}
                                                            onChange={(e) => handleSubCheckboxChange(subText, e.target.checked)}
                                                            disabled={checkedCategories.length > 0}
                                                        />
                                                    )}
                                                    {subText}
                                                </label>
                                                <button
                                                    className={styles.randomNumberButton}>{getInfluencerCountForSubGenre(subText)}</button>
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
