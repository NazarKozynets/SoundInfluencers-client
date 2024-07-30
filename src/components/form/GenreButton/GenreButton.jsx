import React from 'react';
import './genreButton.css';

const GenreButton = ({ genre, subText, isActive, onClick }) => {
    return (
        <button
            className={`genre-button ${isActive ? 'active' : ''}`}
            onClick={() => onClick(genre, subText)}
        >
            <div className="genre-text">{genre}</div>
            {subText && <div className="genre-subtext">{subText}</div>}
        </button>
    );
};

export default GenreButton;