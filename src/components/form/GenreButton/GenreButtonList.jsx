import React, { useState } from 'react';
import GenreButton from './GenreButton';
import './genreButtonList.css';

const genres = [
    { genre: 'Techno', subText: 'Melodic, Minimal' },
    { genre: 'Techno', subText: 'Hard, Peak' },
    { genre: 'House', subText: 'Tech House' },
    { genre: 'House', subText: 'Melodic, Afro' },
    { genre: 'EDM' },
    { genre: 'D&B' },
    { genre: 'Bass' },
    { genre: 'Psy' }
];

const GenreButtonsList = () => {
    const [activeGenre, setActiveGenre] = useState(null);

    const handleGenreClick = (genre, subText) => {
        if (activeGenre && activeGenre.genre === genre && activeGenre.subText === subText) {
            setActiveGenre(null);
        } else {
            setActiveGenre({ genre, subText });
        }
    };

    return (
        <div className="genre-buttons-list">
            {genres.map(({ genre, subText }) => (
                <GenreButton
                    key={genre + (subText || '')}
                    genre={genre}
                    subText={subText}
                    isActive={activeGenre && JSON.stringify(activeGenre) === JSON.stringify({ genre, subText })}
                    onClick={handleGenreClick}
                />
            ))}
        </div>
    );
};

export default GenreButtonsList;
