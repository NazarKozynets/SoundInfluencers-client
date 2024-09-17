import React, {useEffect, useState} from 'react';
import GenreButton from './GenreButton';
import './genreButtonList.css';

const genres = [
    { genre: 'Techno', subText: 'Melodic' },
    { genre: 'Techno', subText: 'Hard, Peak' },
    { genre: 'House', subText: 'Tech House' },
    { genre: 'House', subText: 'Melodic, Afro' },
    { genre: 'EDM' },
    { genre: 'D&B' },
    { genre: 'Bass' },
    { genre: 'Dubstep' },
    { genre: 'Dancing' },
];

const GenreButtonsList = ({ setSelectedOffersGenres }) => {
    const [activeGenre, setActiveGenre] = useState(null);

    useEffect(() => {
        const initialGenre = 'Techno (Melodic)';
        setActiveGenre(initialGenre);
        setSelectedOffersGenres([]);
    }, [setSelectedOffersGenres]);
    
    const handleGenreClick = (genre, subText) => {
        const selectedGenre = subText ? `${genre} (${subText})` : genre;
        
        if (activeGenre === selectedGenre) {
            setActiveGenre('Techno (Melodic)');
            setSelectedOffersGenres([]);  
        } else {
            setActiveGenre(selectedGenre);
            if (selectedGenre === 'Techno (Melodic)') {
                setSelectedOffersGenres([]);
            } else {
                setSelectedOffersGenres([selectedGenre]);
            }
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
