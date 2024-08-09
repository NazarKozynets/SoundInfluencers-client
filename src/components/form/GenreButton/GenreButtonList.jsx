import React, {useState} from 'react';
import GenreButton from './GenreButton';
import './genreButtonList.css';

const genres = [
    {genre: 'Techno', subText: 'Melodic'},
    {genre: 'Techno', subText: 'Hard'},
    {genre: 'House', subText: 'Groovy'},
    {genre: 'House', subText: 'Melodic, Afro'},
    {genre: 'EDM'},
    {genre: 'D&B'},
    {genre: 'Bass'},
    {genre: 'Dubstep'},
    {genre: 'Dance'},
];

const GenreButtonsList = ({ onGenreSelect }) => {
    const [activeGenres, setActiveGenres] = useState([]);

    const handleGenreClick = (genre, subText) => {
        const selectedGenre = subText ? `${genre} (${subText})` : genre;
        let newActiveGenres;

        if (activeGenres.includes(selectedGenre)) {
            newActiveGenres = activeGenres.filter(g => g !== selectedGenre);
        } else {
            newActiveGenres = [...activeGenres, selectedGenre];
        }

        setActiveGenres(newActiveGenres);
        onGenreSelect(newActiveGenres); 
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
                        isActive={activeGenres.includes(selectedGenre)}
                        onClick={handleGenreClick}
                    />
                );
            })}
        </div>
    );
};

export default GenreButtonsList;