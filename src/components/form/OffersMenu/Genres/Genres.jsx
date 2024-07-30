import React, {useState} from "react";
import styles from './genres.module.css'; 

const Genres = () => {
    const [checkedGenres, setCheckedGenres] = useState({});

    const genres = [
        {genre: 'Techno', subText: 'Melodic, Minimal'},
        {genre: 'Techno', subText: 'Hard, Peak'},
        {genre: 'House', subText: 'Tech House'},
        {genre: 'House', subText: 'Melodic, Afro'},
        {genre: 'EDM'},
        {genre: 'D&B'},
        {genre: 'Bass'},
        {genre: 'Psy'}
    ];

    const groupedGenres = genres.reduce((acc, {genre, subText}) => {
        if (!acc[genre]) {
            acc[genre] = [];
        }
        if (subText) {
            acc[genre].push(subText);
        }
        return acc;
    }, {});

    const handleCheckboxChange = (genre, checked) => {
        setCheckedGenres(prevCheckedGenres => ({
            ...prevCheckedGenres,
            [genre]: checked
        }));
    };

    return (
        <div className={styles.genres}>
            <h2 className={styles.title}>GENRES</h2>
            <ul className={styles.genresList}>
                {Object.keys(groupedGenres).map((genre, index) => (
                    <li key={index} className={styles.genresListItem}>
                        <label>
                            <input
                                type="checkbox"
                                className={checkedGenres[genre] ? styles.checkboxChecked : styles.checkbox}
                                checked={!!checkedGenres[genre]}
                                onChange={(e) => handleCheckboxChange(genre, e.target.checked)}
                            />
                            {genre}
                        </label>
                        {groupedGenres[genre].length > 0 && (
                            <ul className={styles.subgenresList}>
                                {groupedGenres[genre].map((subText, subIndex) => (
                                    <li key={subIndex} className={styles.subgenresListItem}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                className={checkedGenres[subText] ? styles.checkboxChecked : styles.checkbox}
                                                checked={!!checkedGenres[subText]}
                                                onChange={(e) => handleCheckboxChange(subText, e.target.checked)}
                                            />
                                            {subText}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Genres;
