import React, {useEffect, useState} from "react";
import TitleSection from "../../../TitleSection";
import backBtn from "../../../../images/icons/arrow.svg";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import PageLoading from "../../../form/PageLoading/pageLoading";
import instaIcon from "../../../../images/icons/socialMedias/instagram.png";
import tiktokIcon from "../../../../images/icons/socialMedias/tiktok.png";
import facebookIcon from "../../../../images/icons/socialMedias/facebook.png";
import youtubeIcon from "../../../../images/icons/socialMedias/youtube.png";
import spotifyIcon from "../../../../images/icons/socialMedias/spotify.png";
import soundcloudIcon from "../../../../images/icons/socialMedias/soundcloud.png";
import tabletIcon from "../../../../images/icons/socialMedias/tablet.png";
import altAvatar from "../../../../images/icons/rkqZiVo 69.svg"
import watch from "../../../../images/icons/view 1.svg";
import edit from "../../../../images/icons/edit 1.svg";
import linkIcon from "../../../../images/icons/iconsForCampaignReport/link 1.svg";
import instaRefLogo from "../../../../images/icons/iconsForCampaignReport/instagram 1.svg";
import hiddenIcon from "../../../../images/icons/hidden 63.svg";
import SearchBarComponent from "../../../form/SearchBar/SearchBar";
import genres from "../../../form/Offers/OffersMenu/Genres/Genres";

const AdminInfluencers = () => {
    const [data, setData] = useState([]);
    const [searchResult, setSearchResult] = useState(null);
    const [activePlatform, setActivePlatform] = useState("Instagram");

    const platforms = [{
        name: 'Instagram',
        secondName: 'IG',
        icon: instaIcon
    }, {
        name: 'TikTok',
        secondName: 'TT',
        icon: tiktokIcon
    }, {
        name: 'Facebook',
        secondName: 'FB',
        icon: facebookIcon
    }, {
        name: 'Youtube',
        secondName: 'YT',
        icon: youtubeIcon
    }, {
        name: 'Spotify',
        secondName: 'SP',
        icon: spotifyIcon
    }, {
        name: 'Soundcloud',
        secondName: 'SC',
        icon: soundcloudIcon
    }, {
        name: 'Press',
        secondName: 'PR',
        icon: tabletIcon
    }]

    const genres = ['Techno (Melodic, Minimal)', 'Techno (Hard, Peak)', 'House (Tech House)', 'House (Melodic, Afro)', 'EDM', 'D&B', 'BASS', 'PSY']
    const categories = ['Dancing', 'Meme', 'Ibiza']
    const countries = ['US', 'Canada', 'UK', 'Germany', 'Italy', 'Spain', 'France', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Russia', 'India', 'Indonesia', 'Chile', 'Serbia', 'Croatia', 'Ireland', 'Australia', 'Romania', 'Czech Republic', 'Austria', 'New Zealand', 'Kazakhstan', 'Iran', 'Portugal', 'UAE', 'Slovakia', 'Egypt', 'Tunisia', 'Libya', 'Algeria', 'Turkey', 'Morocco', 'Guatemala', 'Peru', 'Malaysia', 'South Africa', 'Ukraine', 'Moldova', 'Poland', 'Netherlands', 'Georgia', 'Ecuador', 'Sri Lanka']

    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const result = await axios(
            `${process.env.REACT_APP_SERVER}/admin/influencer/getAll`
        );
        if (result.status === 200) {
            setData(result.data.data);
        }
    }

    const handlePlatformClick = (platform) => {
        if (platform === 'Instagram') {
            setActivePlatform('Instagram');
        } else {
            if (activePlatform === platform) {
                setActivePlatform('Instagram');
            } else {
                setActivePlatform(platform);
            }
        }
    }

    const getSecondNameForActivePlatform = () => {
        return platforms.find(platform => platform.name === activePlatform).secondName;
    }

    const searchByUsername = (data, searchInput) => {
        return data.filter(influencer =>
            influencer.instagram.instagramUsername && influencer.instagram.instagramUsername.toLowerCase().includes(searchInput.toLowerCase())
        );
    };
    
    const searchById = (data, searchInput) => {
        return data.filter(influencer =>
            influencer.influencerId && influencer.influencerId.toLowerCase().includes(searchInput.toLowerCase())
        );
    };

    const checkGenre = (genre, instagram) => {
        if (!instagram) return false; 

        const lowerCaseGenre = genre.toLowerCase();

        let normalizedGenre;
        switch (lowerCaseGenre) {
            case 'psy':
                normalizedGenre = 'Psy, Trance';
                break;
            case 'bass':
                normalizedGenre = 'Bass';
                break;
            default:
                normalizedGenre = genre;
        }

        const isKnownGenre = genres.includes(genre);

        if (isKnownGenre) {
            switch (normalizedGenre) {
                case 'Techno (Melodic, Minimal)':
                    return instagram.musicStyle === 'Techno' && instagram.musicSubStyles && instagram.musicSubStyles.includes('Melodic, Minimal');
                case 'Techno (Hard, Peak)':
                    return instagram.musicStyle === 'Techno' && instagram.musicSubStyles && instagram.musicSubStyles.includes('Hard, Peak');
                case 'House (Tech House)':
                    return instagram.musicStyle === 'House' && instagram.musicSubStyles && instagram.musicSubStyles.includes('Tech House');
                case 'House (Melodic, Afro)':
                    return instagram.musicStyle === 'House' && instagram.musicSubStyles && instagram.musicSubStyles.includes('Melodic, Afro');
                case 'EDM':
                    return instagram.musicStyle === 'EDM';
                case 'D&B':
                    return instagram.musicStyle === 'D&B';
                case 'Bass':
                    return instagram.musicStyle === 'Bass';
                case 'Psy, Trance':
                    return instagram.musicStyle === 'Psy, Trance';
                default:
                    return false;
            }
        }

        return instagram.musicStyleOther && instagram.musicStyleOther.includes(normalizedGenre);
    };

    const calculatePricePerFollower = (price, followers) => {
        const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
        if (followers === 0 || isNaN(numericPrice)) return 0;
        return (numericPrice / followers).toFixed(6);
    };
    
    const checkCategory = (category, instagram) => {
        if (!instagram.categories) return false;
        switch (category) {
            case 'Dancing':
                return instagram.categories.includes('Dancing');
            case 'Meme':
                return instagram.categories.includes('Meme');
            case 'Ibiza':
                return instagram.categories.includes('Ibiza');
            default:
                return false;
        }
    }

    const checkCountry = (country, instagram) => {
        if (!instagram.countries) return false;
console.log(instagram.countries, country) 
        const foundCountry = instagram.countries.find(item => item.country === country);

        return foundCountry ? { found: true, percentage: foundCountry.percentage } : { found: false };
    };


    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => navigate('/admin/home')}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title='Influencers'/>
                </div>

                {data.length > 0 ? (
                    <div>
                        <div className="admin-influencers-platforms">
                            <span style={{
                                fontFamily: "Geometria",
                                fontSize: '25px',
                                fontWeight: 800,
                                textAlign: 'center',
                                color: "#3330E4",
                            }}>
                                PLATFORMS
                            </span>
                            <div>
                                <ul className="admin-influencers-platforms-container">
                                    {platforms.map((platform, index) => (
                                        <li key={index}
                                            className={`admin-influencers-platforms-container-item ${activePlatform === platform.name ? 'active' : ''} ${platform.name !== 'Instagram' ? 'future' : ''}`}>
                                            <button onClick={() => {
                                                platform.name === 'Instagram' && handlePlatformClick(platform.name)
                                            }}>
                                                <img src={platform.icon} alt={'icon'} style={{width: 35}}/>
                                                {platform.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="admin-clients-searchbar">
                            <span style={{
                                fontFamily: "Geometria",
                                fontSize: '25px',
                                fontWeight: 800,
                                textAlign: 'center',
                                color: "#3330E4",
                            }}>
                                FULL LIST
                            </span>
                            <SearchBarComponent
                                data={data}
                                setSearchResult={setSearchResult}
                                searchFunction={searchByUsername}
                                className="large"
                            />
                        </div>

                        <div className="admin-influencers-table-container">
                            <table className="admin-influencers-table">
                                <thead className="admin-influencers-table-header">
                                <tr>
                                    <th></th>
                                    <th>Networks</th>
                                    <th>Edit</th>
                                    <th>First Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Followers</th>
                                    <th>{getSecondNameForActivePlatform()} Link</th>
                                    <th>Price Public</th>
                                    <th>Price Internal</th>
                                    <th>Price per Follower</th>
                                    <th>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            padding: '0 10px',
                                            gap: 5,
                                            marginBottom: 8
                                        }}>
                                            <p>ID</p>
                                            <SearchBarComponent data={data} setSearchResult={setSearchResult} searchFunction={searchById} className="small"/>
                                        </div>
                                    </th>
                                    <th>Balance</th>
                                    <th>Campaigns Completed</th>
                                    <th>Campaigns Denied</th>
                                    <th>Latest Invoice</th>
                                    <th>Internal Note</th>
                                    {genres.map((genre, index) => (
                                        <th>{genre}</th>
                                    ))}
                                    {categories.map((category, index) => (
                                        <th>{category}</th>
                                    ))}
                                    {countries.map((country, index) => (
                                        <th>{country}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="admin-influencers-table-body">
                                {searchResult ? (
                                        <tr>
                                            <td className="admin-influencers-table-body-td"
                                                style={{width: '70px', paddingLeft: 0, height: 50}}>
                                                <img src={searchResult.avatar} alt={altAvatar}
                                                     style={{width: 40, margin: '0 auto'}}/>
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{width: 200}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        textAlign: 'left',
                                                        width: '100%',
                                                    }}
                                                    value={searchResult.instagram.instagramUsername}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td"
                                                style={{paddingLeft: 0, width: 65}}>
                                                <button
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        width: 52,
                                                        height: 28,
                                                        borderRadius: "10px",
                                                        paddingLeft: 3,
                                                        paddingRight: 3,
                                                        border: "1.5px solid black",
                                                        boxSizing: 'border-box',
                                                        margin: '0 auto'
                                                    }}>
                                                    <img src={watch} alt="watch"/>
                                                    <img src={edit} alt="edit"/>
                                                </button>
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                width: 100
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={searchResult.firstName}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                paddingRight: 6,
                                                width: 220
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={searchResult.email}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                paddingRight: 6,
                                                width: 120
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={searchResult.phone}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 60,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={searchResult.instagram.followersNumber}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td"
                                                style={{paddingLeft: 0, width: 65}}>
                                                <button
                                                    onClick={() => {
                                                        window.open(searchResult.instagram.instagramLink, '_blank');
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        width: 52,
                                                        height: 28,
                                                        borderRadius: "10px",
                                                        paddingLeft: 3,
                                                        paddingRight: 3,
                                                        border: "1.5px solid black",
                                                        boxSizing: 'border-box',
                                                        margin: '0 auto',
                                                        cursor: 'pointer'
                                                    }}>
                                                    <img src={instaRefLogo} alt="watch"/>
                                                    <img src={linkIcon} alt="edit"/>
                                                </button>
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={searchResult.instagram.price}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={'ASK'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={calculatePricePerFollower(searchResult.instagram.price, searchResult.instagram.followersNumber)}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 190,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={searchResult.influencerId}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={searchResult.balance + '€'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={'0'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={'0'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={'Latest Invoice'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 150,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={searchResult.internalNote ? searchResult.internalNote : ''}
                                                />
                                            </td>
                                            {genres.map((genre, index) => (
                                                <td className="admin-influencers-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: checkGenre(genre, searchResult.instagram) ? 700 : 400,
                                                    width: 100,
                                                    paddingLeft: 0
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: checkGenre(genre, searchResult.instagram) ? 700 : 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: '0 auto'
                                                        }}
                                                        value={checkGenre(genre, searchResult.instagram) ? 'Yes' : 'No'}
                                                    />
                                                </td>
                                            ))}
                                            {categories.map((category, index) => (
                                                <td className="admin-influencers-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: checkCategory(category, searchResult.instagram) ? 700 : 400,
                                                    width: 100,
                                                    paddingLeft: 0
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: checkCategory(category, searchResult.instagram) ? 700 : 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: '0 auto'
                                                        }}
                                                        value={checkCategory(category, searchResult.instagram) ? 'Yes' : 'No'}
                                                    />
                                                </td>
                                            ))}
                                            {countries.map((country, index) => {
                                                const result = checkCountry(country, searchResult.instagram);

                                                return (
                                                    <td key={index} className="admin-influencers-table-body-td" style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: result.found ? 700 : 400,
                                                        width: 150,
                                                        paddingLeft: 0
                                                    }}>
                                                        <input
                                                            style={{
                                                                fontFamily: "Geometria",
                                                                fontSize: 12,
                                                                fontWeight: result.found ? 700 : 400,
                                                                textAlign: "center",
                                                                width: '100%',
                                                                margin: '0 auto'
                                                            }}
                                                            value={result.found ? `Yes (${result.percentage}%)` : 'No'}
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                ) : (
                                    data.map((influencer, index) =>
                                        <tr key={index}>
                                            <td className="admin-influencers-table-body-td"
                                                style={{width: '70px', paddingLeft: 0}}>
                                                <img src={influencer.avatar} alt={altAvatar}
                                                     style={{width: 40, margin: '0 auto'}}/>
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{width: 200}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        textAlign: 'left',
                                                        width: '100%',
                                                    }}
                                                    value={influencer.instagram.instagramUsername}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td"
                                                style={{paddingLeft: 0, width: 65}}>
                                                <button
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        width: 52,
                                                        height: 28,
                                                        borderRadius: "10px",
                                                        paddingLeft: 3,
                                                        paddingRight: 3,
                                                        border: "1.5px solid black",
                                                        boxSizing: 'border-box',
                                                        margin: '0 auto'
                                                    }}>
                                                    <img src={watch} alt="watch"/>
                                                    <img src={edit} alt="edit"/>
                                                </button>
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                width: 100
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={influencer.firstName}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                paddingRight: 6,
                                                width: 220
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={influencer.email}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                paddingRight: 6,
                                                width: 120
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={influencer.phone}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 60,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={influencer.instagram.followersNumber}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td"
                                                style={{paddingLeft: 0, width: 65}}>
                                                <button
                                                    onClick={() => {
                                                        window.open(influencer.instagram.instagramLink, '_blank');
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        width: 52,
                                                        height: 28,
                                                        borderRadius: "10px",
                                                        paddingLeft: 3,
                                                        paddingRight: 3,
                                                        border: "1.5px solid black",
                                                        boxSizing: 'border-box',
                                                        margin: '0 auto',
                                                        cursor: 'pointer'
                                                    }}>
                                                    <img src={instaRefLogo} alt="watch"/>
                                                    <img src={linkIcon} alt="edit"/>
                                                </button>
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={influencer.instagram.price}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={'ASK'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={calculatePricePerFollower(influencer.instagram.price, influencer.instagram.followersNumber)}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 190,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={influencer.influencerId}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={influencer.balance + '€'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={'0'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={'0'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={'Latest Invoice'}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 150,
                                                paddingLeft: 0
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        width: '100%',
                                                        margin: '0 auto',
                                                        paddingLeft: 5
                                                    }}
                                                    value={influencer.internalNote ? influencer.internalNote : '...'}
                                                />
                                            </td>
                                            {genres.map((genre, index) => (
                                                <td className="admin-influencers-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: checkGenre(genre, influencer.instagram) ? 700 : 400,
                                                    width: 100,
                                                    paddingLeft: 0
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: checkGenre(genre, influencer.instagram) ? 700 : 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: '0 auto'
                                                        }}
                                                        value={checkGenre(genre, influencer.instagram) ? 'Yes' : 'No'}
                                                    />
                                                </td>
                                            ))}
                                            {categories.map((category, index) => (
                                                <td className="admin-influencers-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: checkCategory(category, influencer.instagram) ? 700 : 400,
                                                    width: 100,
                                                    paddingLeft: 0
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: checkCategory(category, influencer.instagram) ? 700 : 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: '0 auto'
                                                        }}
                                                        value={checkCategory(category, influencer.instagram) ? 'Yes' : 'No'}
                                                    />
                                                </td>
                                            ))}
                                            {countries.map((country, index) => {
                                                const result = checkCountry(country, influencer.instagram); 

                                                return (
                                                    <td key={index} className="admin-influencers-table-body-td" style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: result.found ? 700 : 400,
                                                        width: 150,
                                                        paddingLeft: 0
                                                    }}>
                                                        <input
                                                            style={{
                                                                fontFamily: "Geometria",
                                                                fontSize: 12,
                                                                fontWeight: result.found ? 700 : 400,
                                                                textAlign: "center",
                                                                width: '100%',
                                                                margin: '0 auto'
                                                            }}
                                                            value={result.found ? `Yes (${result.percentage}%)` : 'No'}
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    )
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div style={{margin: '0 auto'}}>
                        <PageLoading/>
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminInfluencers;