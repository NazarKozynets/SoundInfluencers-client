import React, {useEffect, useRef, useState} from "react";
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
import SubmitButton from "./form/Influencers/SubmitFooter/SubmitButton";
import {formatDateString, formatDateStringReport} from "../../../../utils/validations";
import ModalWindow from "../../../ModalWindow";
import TextInput from "../../../form/TextInput";

const AdminInfluencers = () => {
    const [data, setData] = useState([]);
    const [searchResult, setSearchResult] = useState(null);
    const [activePlatform, setActivePlatform] = useState("Instagram");
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [tableWidth, setTableWidth] = useState(500);

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

    const [fieldsForChange, setFieldsForChange] = useState({
        instagramId: '',
        influencerId: '',
        instagramUsername: '',
        firstName: '',
        email: '',
        phone: '',
        followersNumber: '',
        instagramLink: '',
        price: '',
        balance: '',
        internalNote: '',
        genres: [],
        categories: [],
        countries: []
    })

    const containerRef = useRef(null);
    const saveChangesRef = useRef(null);

    const genres = ['Techno (Melodic, Minimal)', 'Techno (Hard, Peak)', 'House (Tech House)', 'House (Melodic, Afro)', 'EDM', 'D&B', 'BASS', 'PSY']
    const categories = ['Dancing', 'Meme', 'Ibiza']
    const countries = ['US', 'Canada', 'UK', 'Germany', 'Italy', 'Spain', 'France', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Russia', 'India', 'Indonesia', 'Chile', 'Serbia', 'Croatia', 'Ireland', 'Australia', 'Romania', 'Czech Republic', 'Austria', 'New Zealand', 'Kazakhstan', 'Iran', 'Portugal', 'UAE', 'Slovakia', 'Egypt', 'Tunisia', 'Libya', 'Algeria', 'Turkey', 'Morocco', 'Guatemala', 'Peru', 'Malaysia', 'South Africa', 'Ukraine', 'Moldova', 'Poland', 'Netherlands', 'Georgia', 'Ecuador', 'Sri Lanka']
    const [hiddenGenres, setHiddenGenres] = useState(false);
    const [hiddenCategories, setHiddenCategories] = useState(false);
    const [hiddenCountries, setHiddenCountries] = useState(false);


    const toggleHiddenGenres = () => {
        setHiddenGenres(!hiddenGenres);
    };

    const toggleHiddenCategories = () => {
        setHiddenCategories(!hiddenCategories);
    };

    const toggleHiddenCountries = () => {
        setHiddenCountries(!hiddenCountries);
    };

    const isColumnHidden = (column) => hiddenColumns.includes(column);
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                saveChangesRef.current &&
                !saveChangesRef.current.contains(event.target)
            ) {
                setFieldsForChange({
                    instagramId: '',
                    influencerId: '',
                    instagramUsername: '',
                    firstName: '',
                    email: '',
                    phone: '',
                    followersNumber: '',
                    instagramLink: '',
                    price: '',
                    balance: '',
                    internalNote: '',
                });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectInfluencer = (influencer) => {
        if (fieldsForChange.instagramId !== influencer.instagram._id) {
            setFieldsForChange({
                instagramId: influencer.instagram._id,
                influencerId: influencer.influencerId,
                instagramUsername: influencer.instagram.instagramUsername,
                firstName: influencer.firstName,
                email: influencer.email,
                phone: influencer.phone,
                followersNumber: influencer.instagram.followersNumber,
                instagramLink: influencer.instagram.instagramLink,
                price: influencer.instagram.price,
                balance: influencer.balance,
                internalNote: influencer.internalNote,
            });
        }
    }

    const updateInfluencerFieldsInput = (e) => {
        setFieldsForChange({
            ...fieldsForChange,
            [e.target.name]: e.target.value,
        });
    }

    const updateInfluencerOnServer = async () => {
        const result = await axios.put(
            `${process.env.REACT_APP_SERVER}/admin/influencer/update/personal`,
            {
                id: fieldsForChange.influencerId,
                firstName: fieldsForChange.firstName,
                email: fieldsForChange.email,
                phone: fieldsForChange.phone,
                balance: fieldsForChange.balance,
                internalNote: fieldsForChange.internalNote,
            }
        );

        if (result.status === 200) {
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/admin/influencer/update/instagram`,
                {
                    influencerId: fieldsForChange.influencerId,
                    instagramId: fieldsForChange.instagramId,
                    instagramUsername: fieldsForChange.instagramUsername,
                    followersNumber: fieldsForChange.followersNumber,
                    instagramLink: fieldsForChange.instagramLink,
                    price: fieldsForChange.price,
                }
            );

            if (result.status === 200) {
                await updateInfluencerData(fieldsForChange);
                setFieldsForChange({
                    instagramId: '',
                    influencerId: '',
                    instagramUsername: '',
                    firstName: '',
                    email: '',
                    phone: '',
                    followersNumber: '',
                    instagramLink: '',
                    price: '',
                    balance: '',
                    internalNote: '',
                });
            }
        }
    }

    const updateInfluencerData = async (influencer) => {
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_SERVER}/admin/influencer/getOne/${influencer.influencerId}/${influencer.instagramUsername}`
            );
            if (result.status === 200) {
                const updatedInfluencer = result.data.data;

                const updatedInfluencers = data.map((item) => {
                    if (item.influencerId === updatedInfluencer.influencerId) {
                        return {
                            ...item,
                            firstName: updatedInfluencer.firstName,
                            phone: updatedInfluencer.phone,
                            balance: updatedInfluencer.balance,
                            email: updatedInfluencer.email,
                            internalNote: updatedInfluencer.internalNote,
                            instagram: {
                                ...item.instagram,
                                ...(item.instagram.instagramUsername === updatedInfluencer.instagram.instagramUsername
                                    ? updatedInfluencer.instagram
                                    : {}),
                            },
                        };
                    }
                    return item;
                });

                setData(updatedInfluencers);
            } else {
                console.warn("Сервер вернул некорректный статус:", result.status);
            }
        } catch (error) {
            console.error("Ошибка при обновлении данных инфлюенсера:", error);
        }
    };

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

    const calculatePublicPrice = (price) => {
        const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return 0;
        return numericPrice * 2;
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
        const foundCountry = instagram.countries.find(item => item.country === country);

        return foundCountry ? {found: true, percentage: foundCountry.percentage} : {found: false};
    };

    const handleHiddenColumns = (column) => {
        if (hiddenColumns.includes(column)) {
            setHiddenColumns(hiddenColumns.filter(item => item !== column));
        } else {
            setHiddenColumns([...hiddenColumns, column]);
        }
    };

    const restoreColumn = (column) => {
        setHiddenColumns(hiddenColumns.filter(item => item !== column));
    };

    const calculateTableWidth = () => {
        const hiddenCount = hiddenColumns.length;
        const countTrue = [hiddenGenres, hiddenCategories, hiddenCountries].filter(Boolean).length;

        if (countTrue === 3) {
            return 100;
        } else if (countTrue === 2) {
            if (hiddenCountries) {
                return 150;
            } else {
                return 330;
            }
        } else if (countTrue === 1) {
            if (hiddenCountries) {
                return 150;
            } else {
                return 400;
            }
        }

        let width = 500;

        const additionalReduction = Math.max(0, hiddenCount - 3) * 25;
        return Math.max(0, width - additionalReduction);
    };

    useEffect(() => {
        setTableWidth(calculateTableWidth());
    }, [hiddenColumns, hiddenGenres, hiddenCategories, hiddenCountries]);

    const EditLinkModal = () => {
        return (
            <div style={{}}>
                <p style={{
                    fontFamily: "Geometria",
                    fontSize: 20,
                    fontWeight: 700,
                    paddingLeft: 20,
                }}>Current {getSecondNameForActivePlatform()} Link:</p>
                <p style={{
                    fontFamily: "Geometria",
                    fontSize: 18,
                    fontWeight: 500,
                    paddingLeft: 20,
                }}>
                    {fieldsForChange.instagramLink}
                </p>
            </div>
        );
    }

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
                        {fieldsForChange.influencerId && (
                            <SubmitButton ref={saveChangesRef} onSubmit={updateInfluencerOnServer}/>
                        )}

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

                        <div className="hidden-columns-list">
                            {hiddenColumns.map((column, index) => (
                                <div key={index} className="hidden-column-item">
                                    <button onClick={() => restoreColumn(column)} style={{cursor: 'pointer'}}>
                                        <img src={hiddenIcon} alt="restore"/>
                                    </button>
                                    <span>{column}</span>
                                </div>
                            ))}
                            {hiddenGenres && (
                                <div className="hidden-column-item">
                                    <button onClick={toggleHiddenGenres} style={{cursor: 'pointer'}}>
                                        <img src={hiddenIcon} alt="restore"/>
                                    </button>
                                    <span>Genres</span>
                                </div>
                            )}
                            {hiddenCategories && (
                                <div className="hidden-column-item">
                                    <button onClick={toggleHiddenCategories} style={{cursor: 'pointer'}}>
                                        <img src={hiddenIcon} alt="restore"/>
                                    </button>
                                    <span>Categories</span>
                                </div>
                            )}
                            {hiddenCountries && (
                                <div className="hidden-column-item">
                                    <button onClick={toggleHiddenCountries} style={{cursor: 'pointer'}}>
                                        <img src={hiddenIcon} alt="restore"/>
                                    </button>
                                    <span>Countries</span>
                                </div>
                            )}
                        </div>

                        <div className="admin-influencers-table-container" ref={containerRef}>
                            <table className="admin-influencers-table"
                                   style={{width: `${tableWidth}%`}}>
                                <thead className="admin-influencers-table-header">
                                <tr>
                                    <th>
                                        <div className="admin-influencers-table-header-th">
                                            <div className="admin-influencers-table-header-button" id="first"></div>
                                            <div className="admin-influencers-table-header-text"></div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="admin-influencers-table-header-th">
                                            <div className="admin-influencers-table-header-button" id="second"></div>
                                            <div className="admin-influencers-table-header-text">
                                                <p>Networks</p>
                                            </div>
                                        </div>
                                    </th>
                                    {!isColumnHidden('First Name') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('First Name')}>
                                                        <img
                                                            src={hiddenColumns.includes('First Name') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>First Name</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Email') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Email')}>
                                                        <img
                                                            src={hiddenColumns.includes('Email') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Email</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Phone') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Phone')}>
                                                        <img
                                                            src={hiddenColumns.includes('Phone') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Phone</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Followers Number') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Followers Number')}>
                                                        <img
                                                            src={hiddenColumns.includes('Followers Number') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Followers</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Instagram Link') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Instagram Link')}>
                                                        <img
                                                            src={hiddenColumns.includes('Instagram Link') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>{getSecondNameForActivePlatform()} Link</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Public Price') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Public Price')}>
                                                        <img
                                                            src={hiddenColumns.includes('Public Price') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Public Price</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Internal Price') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Internal Price')}>
                                                        <img
                                                            src={hiddenColumns.includes('Internal Price') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Internal Price</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Price per Follower') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Price per Follower')}>
                                                        <img
                                                            src={hiddenColumns.includes('Price per Follower') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Price per Follower</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Id') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Id')}>
                                                        <img
                                                            src={hiddenColumns.includes('Id') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                }} className="admin-influencers-table-header-text">
                                                    <p style={{marginTop: '-12px'}}>ID</p>
                                                    <SearchBarComponent data={data} setSearchResult={setSearchResult}
                                                                        searchFunction={searchById} className="small"/>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Balance') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Balance')}>
                                                        <img
                                                            src={hiddenColumns.includes('Balance') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Balance</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Campaigns Completed') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Campaigns Completed')}>
                                                        <img
                                                            src={hiddenColumns.includes('Campaigns Completed') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Campaigns Completed</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Campaigns Denied') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Campaigns Denied')}>
                                                        <img
                                                            src={hiddenColumns.includes('Campaigns Denied') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Campaigns Denied</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Latest Invoice') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Latest Invoice')}>
                                                        <img
                                                            src={hiddenColumns.includes('Latest Invoice') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Latest Invoice</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!isColumnHidden('Internal Note') && (
                                        <th>
                                            <div className="admin-influencers-table-header-th">
                                                <div className="admin-influencers-table-header-button">
                                                    <button onClick={() => handleHiddenColumns('Internal Note')}>
                                                        <img
                                                            src={hiddenColumns.includes('Internal Note') ? hiddenIcon : watch}
                                                            alt="hidden"
                                                        />
                                                    </button>
                                                </div>
                                                <div className="admin-influencers-table-header-text">
                                                    <p>Internal Note</p>
                                                </div>
                                            </div>
                                        </th>
                                    )}
                                    {!hiddenGenres && genres.map((genre, index) => (
                                        <th key={index}>
                                            <div className="admin-influencers-table-header-th">
                                                {index === 0 ? (
                                                    <div className="admin-influencers-table-header-button">
                                                        <button onClick={toggleHiddenGenres}>
                                                            <img
                                                                src={hiddenGenres ? hiddenIcon : watch}
                                                                alt="toggle"
                                                            />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="admin-influencers-table-header-button"></div>
                                                )}
                                                <div className="admin-influencers-table-header-text">
                                                    <p style={{display: hiddenGenres && index > 0 ? 'none' : 'block'}}>{genre}</p>
                                                </div>
                                            </div>
                                        </th>
                                    ))}

                                    {!hiddenCategories && categories.map((category, index) => (
                                        <th key={index}>
                                            <div className="admin-influencers-table-header-th">
                                                {index === 0 ? (
                                                    <div className="admin-influencers-table-header-button">
                                                        <button onClick={toggleHiddenCategories}>
                                                            <img
                                                                src={hiddenCategories ? hiddenIcon : watch}
                                                                alt="toggle"
                                                            />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="admin-influencers-table-header-button"></div>
                                                )}
                                                <div className="admin-influencers-table-header-text">
                                                    <p style={{display: hiddenCategories && index > 0 ? 'none' : 'block'}}>{category}</p>
                                                </div>
                                            </div>
                                        </th>
                                    ))}

                                    {!hiddenCountries && countries.map((country, index) => (
                                        <th key={index}>
                                            <div className="admin-influencers-table-header-th">
                                                {index === 0 ? (
                                                    <div className="admin-influencers-table-header-button">
                                                        <button onClick={toggleHiddenCountries}>
                                                            <img
                                                                src={hiddenCountries ? hiddenIcon : watch}
                                                                alt="toggle"
                                                            />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="admin-influencers-table-header-button"></div>
                                                )}
                                                <div className="admin-influencers-table-header-text">
                                                    <p style={{display: hiddenCountries && index > 0 ? 'none' : 'block'}}>{country}</p>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="admin-influencers-table-body">
                                {searchResult ? (
                                    <tr onClick={() => selectInfluencer(searchResult)}>
                                        <td className="admin-influencers-table-body-td"
                                            style={{width: '70px', paddingLeft: 0}}>
                                            <img src={searchResult.avatar} alt={altAvatar}
                                                 style={{width: 40, margin: '0 auto'}}/>
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            width: 200,
                                            display: hiddenColumns.includes('Networks') ? 'none' : 'table-cell'
                                        }}>
                                            <input
                                                style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    textAlign: 'left',
                                                    width: '100%',
                                                }}
                                                value={fieldsForChange.instagramId === searchResult.instagram._id ? fieldsForChange.instagramUsername : (searchResult.instagram.instagramUsername ? searchResult.instagram.instagramUsername : 'N/A')}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            textAlign: "left",
                                            width: 100,
                                            display: hiddenColumns.includes('First Name') ? 'none' : 'table-cell'
                                        }}>
                                            <input
                                                style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "left",
                                                    width: '100%',
                                                }}
                                                value={fieldsForChange.instagramId === searchResult.instagram._id ? fieldsForChange.firstName : (searchResult.firstName ? searchResult.firstName : 'N/A')}
                                                name="firstName"
                                                onChange={(e) => updateInfluencerFieldsInput(e)}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            textAlign: "left",
                                            paddingRight: 6,
                                            width: 220,
                                            display: hiddenColumns.includes('Email') ? 'none' : 'table-cell'
                                        }}>
                                            <input
                                                style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "left",
                                                    width: '100%',
                                                }}
                                                value={fieldsForChange.instagramId === searchResult.instagram._id ? fieldsForChange.email : (searchResult.email ? searchResult.email : 'N/A')}
                                                name="email"
                                                onChange={(e) => updateInfluencerFieldsInput(e)}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            textAlign: "left",
                                            paddingRight: 6,
                                            width: 120,
                                            display: hiddenColumns.includes('Phone') ? 'none' : 'table-cell'
                                        }}>
                                            <input
                                                style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "left",
                                                    width: '100%',
                                                }}
                                                value={fieldsForChange.instagramId === searchResult.instagram._id ? fieldsForChange.phone : (searchResult.phone ? searchResult.phone : 'N/A')}
                                                name="phone"
                                                onChange={(e) => updateInfluencerFieldsInput(e)}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            width: 60,
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Followers Number') ? 'none' : 'table-cell'
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
                                                value={fieldsForChange.instagramId === searchResult.instagram._id ? fieldsForChange.followersNumber : searchResult.instagram.followersNumber}
                                                name="followersNumber"
                                                onChange={(e) => updateInfluencerFieldsInput(e)}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td"
                                            style={{
                                                paddingLeft: 0,
                                                width: 100,
                                                display: hiddenColumns.includes('Instagram Link') ? 'none' : 'table-cell'
                                            }}>
                                            <div style={{display: 'flex'}}>
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
                                            </div>
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            width: 80,
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Public Price') ? 'none' : 'table-cell'
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
                                                value={calculatePublicPrice(searchResult.instagram.price) + '€'}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            width: 80,
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Internal Price') ? 'none' : 'table-cell'
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
                                                value={fieldsForChange.instagramId === searchResult.instagram._id ? fieldsForChange.price : searchResult.instagram.price}
                                                name="price"
                                                onChange={(e) => updateInfluencerFieldsInput(e)}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            width: 80,
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Price per Follower') ? 'none' : 'table-cell'
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
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Influencer Id') ? 'none' : 'table-cell'
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
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Balance') ? 'none' : 'table-cell'
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
                                                value={fieldsForChange.instagramId === searchResult.instagram._id ? fieldsForChange.balance : searchResult.balance}
                                                name="balance"
                                                onChange={(e) => updateInfluencerFieldsInput(e)}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            width: 90,
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Campaigns Completed') ? 'none' : 'table-cell'
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
                                                value={searchResult.campaignsCompleted}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            width: 90,
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Campaigns Denied') ? 'none' : 'table-cell'
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
                                                value={searchResult.campaignsDenied}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            width: 90,
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Latest Invoice') ? 'none' : 'table-cell'
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
                                                value={formatDateStringReport(searchResult.latestInvoice.createdAt)}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td className="admin-influencers-table-body-td" style={{
                                            fontFamily: "Geometria",
                                            fontSize: 12,
                                            fontWeight: 400,
                                            width: 150,
                                            paddingLeft: 0,
                                            display: hiddenColumns.includes('Internal Note') ? 'none' : 'table-cell'
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
                                                value={fieldsForChange.instagramId === searchResult.instagram._id ? fieldsForChange.internalNote : (searchResult.internalNote ? searchResult.internalNote : '')}
                                            />
                                        </td>
                                        {genres.map((genre, index) => (
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: checkGenre(genre, searchResult.instagram) ? 700 : 400,
                                                width: 100,
                                                paddingLeft: 0,
                                                display: hiddenGenres ? 'none' : 'table-cell'
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
                                                paddingLeft: 0,
                                                display: hiddenCategories ? 'none' : 'table-cell'
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
                                                    paddingLeft: 0,
                                                    display: hiddenCountries ? 'none' : 'table-cell'
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
                                        <tr key={index} onClick={() => selectInfluencer(influencer)}>
                                            <td className="admin-influencers-table-body-td"
                                                style={{width: '70px', paddingLeft: 0}}>
                                                <img src={influencer.avatar} alt={altAvatar}
                                                     style={{width: 40, margin: '0 auto'}}/>
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                width: 200,
                                                display: hiddenColumns.includes('Networks') ? 'none' : 'table-cell'
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        textAlign: 'left',
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange.instagramId === influencer.instagram._id ? fieldsForChange.instagramUsername : (influencer.instagram.instagramUsername ? influencer.instagram.instagramUsername : 'N/A')}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                width: 100,
                                                display: hiddenColumns.includes('First Name') ? 'none' : 'table-cell'
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange.instagramId === influencer.instagram._id ? fieldsForChange.firstName : (influencer.firstName ? influencer.firstName : 'N/A')}
                                                    name="firstName"
                                                    onChange={(e) => updateInfluencerFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                paddingRight: 6,
                                                width: 220,
                                                display: hiddenColumns.includes('Email') ? 'none' : 'table-cell'
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange.instagramId === influencer.instagram._id ? fieldsForChange.email : (influencer.email ? influencer.email : 'N/A')}
                                                    name="email"
                                                    onChange={(e) => updateInfluencerFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                paddingRight: 6,
                                                width: 120,
                                                display: hiddenColumns.includes('Phone') ? 'none' : 'table-cell'
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange.instagramId === influencer.instagram._id ? fieldsForChange.phone : (influencer.phone ? influencer.phone : 'N/A')}
                                                    name="phone"
                                                    onChange={(e) => updateInfluencerFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 60,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Followers Number') ? 'none' : 'table-cell'
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
                                                    value={fieldsForChange.instagramId === influencer.instagram._id ? fieldsForChange.followersNumber : influencer.instagram.followersNumber}
                                                    name="followersNumber"
                                                    onChange={(e) => updateInfluencerFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td"
                                                style={{
                                                    paddingLeft: 0,
                                                    width: 100,
                                                    display: hiddenColumns.includes('Instagram Link') ? 'none' : 'table-cell'
                                                }}>
                                                <div style={{display: 'flex'}}>
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
                                                </div>
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Public Price') ? 'none' : 'table-cell'
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
                                                    value={calculatePublicPrice(influencer.instagram.price) + '€'}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Internal Price') ? 'none' : 'table-cell'
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
                                                    value={fieldsForChange.instagramId === influencer.instagram._id ? fieldsForChange.price : influencer.instagram.price}
                                                    name="price"
                                                    onChange={(e) => updateInfluencerFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Price per Follower') ? 'none' : 'table-cell'
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
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Id') ? 'none' : 'table-cell'
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
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 80,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Balance') ? 'none' : 'table-cell'
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
                                                    value={fieldsForChange.instagramId === influencer.instagram._id ? fieldsForChange.balance : influencer.balance}
                                                    name="balance"
                                                    onChange={(e) => updateInfluencerFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Campaigns Completed') ? 'none' : 'table-cell'
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
                                                    value={influencer.campaignsCompleted}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Campaigns Denied') ? 'none' : 'table-cell'
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
                                                    value={influencer.campaignsDenied}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 90,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Latest Invoice') ? 'none' : 'table-cell'
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
                                                    value={formatDateStringReport(influencer.latestInvoice.createdAt)}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-influencers-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                width: 150,
                                                paddingLeft: 0,
                                                display: hiddenColumns.includes('Internal Note') ? 'none' : 'table-cell'
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
                                                    value={fieldsForChange.instagramId === influencer.instagram._id ? fieldsForChange.internalNote : (influencer.internalNote ? influencer.internalNote : '')}
                                                />
                                            </td>
                                            {genres.map((genre, index) => (
                                                <td className="admin-influencers-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: checkGenre(genre, influencer.instagram) ? 700 : 400,
                                                    width: 100,
                                                    paddingLeft: 0,
                                                    display: hiddenGenres ? 'none' : 'table-cell'
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
                                                    paddingLeft: 0,
                                                    display: hiddenCategories ? 'none' : 'table-cell'
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
                                                        paddingLeft: 0,
                                                        display: hiddenCountries ? 'none' : 'table-cell'
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