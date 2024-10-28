import React, {useState} from "react";

const OffersTableFiltersGenres = ({influencers, setSelectedGenres, selectedGenres, selectedCategories}) => {
    const [genres, setGenres] = useState({
        'Techno': false,
        'House': false,
        'EDM': false,
        'D&B': false,
        'Bass': false,
        'Psy, Trance': false,
        'Dubstep': false,
    });

    const [subGenres, setSubGenres] = useState({
        'Melodic, Minimal': false,
        'Hard, Peak': false,
        'Tech House': false,
        'Melodic, Afro': false,
    });

    const handleGenreChange = (genre) => {
        if (selectedCategories.length === 0) {
            const updatedGenres = {...genres, [genre]: !genres[genre]};
            setGenres(updatedGenres);

            if (!genres[genre]) {
                setSelectedGenres([...selectedGenres, genre]);
            } else {
                setSelectedGenres(selectedGenres.filter(selected => selected !== genre));
            }
        }
    };

    const handleSubGenreChange = (mainGenre, subGenre) => {
        if (selectedCategories.length === 0) {
            const updatedSubGenres = {...subGenres, [subGenre]: !subGenres[subGenre]};
            setSubGenres(updatedSubGenres);

            if (['Melodic, Minimal', 'Hard, Peak'].includes(subGenre)) {
                mainGenre = 'Techno';
            } else if (['Tech House', 'Melodic, Afro'].includes(subGenre)) {
                mainGenre = 'House';
            }

            if (!subGenres[subGenre]) {
                setGenres({...genres, [mainGenre]: true});
                if (!selectedGenres.includes(mainGenre)) {
                    setSelectedGenres([...selectedGenres, mainGenre]);
                }
            }

            if (!subGenres[subGenre]) {
                setSelectedGenres(prevSelected => {
                    const newSelected = [...prevSelected];
                    if (!newSelected.includes(subGenre)) newSelected.push(subGenre);
                    if (!newSelected.includes(mainGenre)) newSelected.push(mainGenre);
                    return newSelected;
                });
            } else {
                setSelectedGenres(selectedGenres.filter(selected => selected !== subGenre));
            }
        }
    };

    const getInfluencerCountForGenre = (genre) => {
        return influencers.filter(influencer =>
            influencer.musicStyle === genre ||
            (influencer.musicStyleOther && influencer.musicStyleOther.includes(genre))
        ).length;
    };

    const getInfluencerCountForSubGenre = (subGenre) => {
        return influencers.filter(influencer =>
            influencer.musicSubStyles && influencer.musicSubStyles.some(style => style === subGenre)
        ).length;
    };

    return (
        <div className="list">
            {Object.keys(genres).map((genre, index) => {
                if (genre !== 'Techno' && genre !== 'House') {
                    return (
                        <div key={index} className='list-item'>
                            <div style={{display: 'flex'}}>
                                <input
                                    type='checkbox'
                                    checked={genres[genre]}
                                    onChange={() => handleGenreChange(genre)}
                                />
                                <p>{genre}</p>
                            </div>
                            <div>
                                <span className="list-item-num-of-networks">
                                    {getInfluencerCountForGenre(genre)}
                                </span>
                            </div>
                        </div>
                    );
                } else if (genre === 'Techno') {
                    return (
                        <div key={index}>
                            <div className='list-item'>
                                <div style={{display: 'flex'}}>
                                    <input
                                        type='checkbox'
                                        checked={genres[genre]}
                                        onChange={() => handleGenreChange(genre)}
                                    />
                                    <p>{genre}</p>
                                </div>
                                <div>
                                    <span className="list-item-num-of-networks">
                                        {getInfluencerCountForGenre(genre)}
                                    </span>
                                </div>
                            </div>
                            <div className='sub-list'>
                                {Object.keys(subGenres).slice(0, 2).map((subGenre, index) => (
                                    <div key={index} className='list-item'>
                                        <div style={{display: 'flex'}}>
                                            <input
                                                type='checkbox'
                                                checked={subGenres[subGenre]}
                                                onChange={() => handleSubGenreChange('Techno', subGenre)}
                                            />
                                            <p>{subGenre}</p>
                                        </div>
                                        <div>
                                            <span className="list-item-num-of-networks">
                                                {getInfluencerCountForSubGenre(subGenre)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                } else if (genre === 'House') {
                    return (
                        <div key={index}>
                            <div className='list-item'>
                                <div style={{display: 'flex'}}>
                                    <input
                                        type='checkbox'
                                        checked={genres[genre]}
                                        onChange={() => handleGenreChange(genre)}
                                    />
                                    <p>{genre}</p>
                                </div>
                                <div>
                                    <span className="list-item-num-of-networks">
                                        {getInfluencerCountForGenre(genre)}
                                    </span>
                                </div>
                            </div>
                            <div className='sub-list'>
                                {Object.keys(subGenres).slice(-2).map((subGenre, index) => (
                                    <div key={index} className='list-item'>
                                        <div style={{display: 'flex'}}>
                                            <input
                                                type='checkbox'
                                                checked={subGenres[subGenre]}
                                                onChange={() => handleSubGenreChange('House', subGenre)}
                                            />
                                            <p>{subGenre}</p>
                                        </div>
                                        <div>
                                            <span className="list-item-num-of-networks">
                                                {getInfluencerCountForSubGenre(subGenre)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default OffersTableFiltersGenres;
