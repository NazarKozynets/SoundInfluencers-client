import React, { useState } from 'react';
import GenreButton from './GenreButton';
import './genreButtonList.css';

const genres = [
    { genre: 'Techno', subText: 'Melodic' },
    { genre: 'Techno', subText: 'Hard' },
    { genre: 'House', subText: 'Tech House' },
    { genre: 'House', subText: 'Melodic, Afro' },
    { genre: 'EDM' },
    { genre: 'D&B' },
    { genre: 'Bass' },
    { genre: 'Dubstep' },
    { genre: 'Dance' },
];

const GenreButtonsList = ({ setSelectedOffersGenres }) => {
    const [activeGenre, setActiveGenre] = useState(null);

    const handleGenreClick = (genre, subText) => {
        const selectedGenre = subText ? `${genre} (${subText})` : genre;

        if (activeGenre === selectedGenre) {
            setActiveGenre(null);
            setSelectedOffersGenres([]);  
        } else {
            setActiveGenre(selectedGenre);
            setSelectedOffersGenres([selectedGenre]);  
        }
    };

    return (
        <div className="genre-buttons-list">
            {genres.map(({ genre, subText }) => {
                const selectedGenre = subText ? `${genre} (${subText})` : genre;
                return (
                    <GenreButton
                        key={selectedGenre}
                        genre={genre}
                        subText={subText}
                        isActive={activeGenre === selectedGenre}
                        onClick={() => handleGenreClick(genre, subText)}
                    />
                );
            })}
        </div>
    );
};

export default GenreButtonsList;
