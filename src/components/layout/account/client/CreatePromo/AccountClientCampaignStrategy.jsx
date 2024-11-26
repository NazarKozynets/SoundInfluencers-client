import React, {useEffect, useState} from 'react';
import TitleSection from "../../../../TitleSection";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import StandardButton from "../../../../form/StandardButton";
import {
    setCurrentWindow, setSocialMedia,
    updateSelectInfluencer, updateVideo
} from "../../../../../redux/slice/create-promo";
import arrow from "../../../../../images/icons/arrow.svg";
import watch from "../../../../../images/icons/view 1.svg"
import edit from "../../../../../images/icons/edit 1.svg"
import CustomSelect from "../../../../form/Offers/CampaignStrategySelect/CampaignStrategySelect";
import ModalWindow from "../../../../ModalWindow";
import TextInput from "../../../../form/TextInput";
import TextArea from "../../../../form/TextArea";


const AccountClientCampaignStrategy = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedDates, setSelectedDates] = useState({});
    const [selectedOptionDateRequest, setSelectedOptionDateRequest] = useState({});
    const [selectedVideos, setSelectedVideos] = useState({});
    const [showMore, setShowMore] = useState(false);
    const [editCampaign, setEditCampaign] = useState(false);
    const [selectedVideoToEdit, setSelectedVideoToEdit] = useState(null);

    const navigation = useNavigate();
    const dispatch = useDispatch();
    const dataPromo = useSelector((state) => state.createPromo.data);

    const {socialMedia} = useParams();

    const getSocialMediaAccounts = async () => {
        const selectInfluencers = dataPromo.selectInfluencers;

        try {
            let accountsList = [];

            for (let influencer of selectInfluencers) {
                const result = await axios.get(`${process.env.REACT_APP_SERVER}/auth/influencer/${influencer.influencerId}`);

                if (result.data.code === 200) {
                    const fetchedInfluencer = result.data.influencer;

                    switch (socialMedia) {
                        case 'instagram':
                            const instagramAccount = fetchedInfluencer.instagram.find(account => account.instagramUsername === influencer.instagramUsername);
                            accountsList.push(instagramAccount);
                            break;
                        case 'tiktok':
                            const tiktokAccount = fetchedInfluencer.tiktok.find(account => account.instagramUsername === influencer.instagramUsername);
                            accountsList.push(tiktokAccount);
                            break;
                        case 'spotify':
                            const spotifyAccount = fetchedInfluencer.spotify.find(account => account.instagramUsername === influencer.instagramUsername);
                            accountsList.push(spotifyAccount);
                            break;
                        case 'facebook':
                            const facebookAccount = fetchedInfluencer.facebook.find(account => account.instagramUsername === influencer.instagramUsername);
                            accountsList.push(facebookAccount);
                            break;
                        case 'soundcloud':
                            const soundcloudAccount = fetchedInfluencer.soundcloud.find(account => account.instagramUsername === influencer.instagramUsername);
                            accountsList.push(soundcloudAccount);
                            break;
                        case 'youtube':
                            const youtubeAccount = fetchedInfluencer.youtube.find(account => account.instagramUsername === influencer.instagramUsername);
                            accountsList.push(youtubeAccount);
                            break;
                        case 'press':
                            const pressAccount = fetchedInfluencer.press.find(account => account.instagramUsername === influencer.instagramUsername);
                            accountsList.push(pressAccount);
                            break;
                        default:
                            break;
                    }
                }
            }

            setAccounts(accountsList);
        } catch
            (error) {
            console.error("Error fetching Instagram accounts: ", error);
        }
    };

    const returnPostName = () => {
        if (socialMedia === "spotify" || socialMedia === "soundcloud") {
            return "Song";
        } else if (socialMedia === "press") {
            return "Press Release";
        } else {
            return "Post Description";
        }
    }

    const optionsForVideoColumn = dataPromo.videos.map((video, index) => ({
        value: video.videoLink,
        label: `${returnPostName()} ${index + 1}`
    }));

    useEffect(() => {
        getSocialMediaAccounts();
    }, [dataPromo.selectInfluencers]);

    useEffect(() => {
        const initialSelectedVideos = dataPromo.selectInfluencers.reduce((acc, influencer) => {
            acc[influencer.instagramUsername] = {value: `${returnPostName()} 1`, label: 'Select'};
            return acc;
        }, {});

        setSelectedOptionDateRequest(dataPromo.selectInfluencers.reduce((acc, influencer) => {
            acc[influencer.instagramUsername] = {value: 'ASAP', label: 'ASAP'};
            return acc;
        }, {}));

        setSelectedVideos(initialSelectedVideos);
    }, [dataPromo.selectInfluencers]);

    const getTotalFollowers = () => {
        let totalFollowers = 0;

        accounts.forEach(account => {
            totalFollowers += Number(account?.followersNumber ?? 0);
        });

        return totalFollowers;
    };

    const getRoundedFollowers = () => {
        const totalFollowers = getTotalFollowers();

        if (totalFollowers < 1_000_000) {
            return '<1M';
        }

        const roundedFollowers = Math.round(totalFollowers / 1_000_000);

        return totalFollowers < roundedFollowers * 1_000_000 ? `<${roundedFollowers}M` : `${roundedFollowers}M`;
    };

    const nextForm = () => {
        const updatedSelectInfluencersData = dataPromo.selectInfluencers.map(influencer => {
            const dateRequest = selectedOptionDateRequest[influencer.instagramUsername]?.value;
            const dateToDo = dateRequest === 'ASAP'
                ? 'ASAP'
                : `${dateRequest} ${selectedDates[influencer.instagramUsername]}`;

            const selectedVideo = selectedVideos[influencer.instagramUsername]?.value;

            const videoLink = selectedVideo === `${returnPostName()} 1` && dataPromo.videos?.length > 0
                ? dataPromo.videos[0].videoLink
                : null;

            return {
                ...influencer,
                dateRequest: dateToDo,
                selectedVideo: videoLink || selectedVideo,
            };
        });

        dispatch(setSocialMedia(socialMedia));
        dispatch(updateSelectInfluencer(updatedSelectInfluencersData));
        dispatch(setCurrentWindow(5));
    };

    const optionsForDateRequestColumn = [
        {value: 'ASAP', label: 'ASAP'},
        {value: "Before", label: 'Before'},
        {value: "After", label: 'After'},
    ];

    const handleDateChange = (influencerUsername, selectedOption) => {
        const newSelectedOptionDateRequest = {...selectedOptionDateRequest, [influencerUsername]: selectedOption};
        setSelectedOptionDateRequest(newSelectedOptionDateRequest);
        const newSelectedDates = {
            ...selectedDates,
            [influencerUsername]: (selectedOption.value === 'Before' || selectedOption.value === 'After') ? '' : selectedOption.value,
        };
        setSelectedDates(newSelectedDates);
    };

    const handleDateInputChange = (influencerUsername, e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        let formattedValue = value;

        if (value.length > 2) {
            formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        if (value.length > 4) {
            formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        }

        setSelectedDates(prevDates => ({
            ...prevDates,
            [influencerUsername]: formattedValue,
        }));
    };

    const handleSeeMoreClick = () => {
        setShowMore(!showMore);
        const tableContainer = document.querySelector('.account-client-campaign-strategy-influencers-table-container');
        if (tableContainer) {
            if (!showMore) {
                tableContainer.classList.add('expanded');
            } else {
                tableContainer.classList.remove('expanded');
            }
        }
    }

    const findInsta = (influencer) => {
        return accounts.find(account => account.instagramUsername === influencer.instagramUsername);
    };

    const getDisplayGenre = (musicSubStyles, musicStyle, musicStyleOther) => {
        const technoSubgenres = ["Hard, Peak", "Melodic, Minimal"];
        const houseSubgenres = ["Tech House", "Melodic, Afro"];

        const isTechnoInStyle = musicStyle === "Techno";
        const isHouseInStyle = musicStyle === "House";

        const isTechnoInOther = musicStyleOther && musicStyleOther.includes("Techno");
        const isHouseInOther = musicStyleOther && musicStyleOther.includes("House");

        const hasTechnoSubgenres = musicSubStyles && musicSubStyles.some(subgenre => technoSubgenres.includes(subgenre));
        const hasHouseSubgenres = musicSubStyles && musicSubStyles.some(subgenre => houseSubgenres.includes(subgenre));

        if (musicSubStyles && (isTechnoInStyle || isTechnoInOther)) {
            if (hasTechnoSubgenres) {
                const allSubgenresPresent = technoSubgenres.every(subgenre => musicSubStyles.includes(subgenre));
                return `Techno${allSubgenresPresent ? " (All)" : ""}`;
            }
            return "Techno";
        }

        if (musicSubStyles && (isHouseInStyle || isHouseInOther)) {
            if (hasHouseSubgenres) {
                const allSubgenresPresent = houseSubgenres.every(subgenre => musicSubStyles.includes(subgenre));
                return `House${allSubgenresPresent ? " (All)" : ""}`;
            }
            return "House";
        }

        return musicStyle;
    };

    const formatCountries = (countries) => {
        if (countries && Array.isArray(countries) && countries.length > 0) {
            const isMobile = window.innerWidth <= 768; // проверяем ширину экрана
            const separator = isMobile ? '<br/>' : ' - '; // используем перенос строки для мобильных
            return countries.map(country =>
                `${country.country} <span style="font-size: 9px;">${country.percentage}%</span>`
            ).join(separator);
        } else {
            return 'No countries available';
        }
    };

    const handleVideoChange = (influencerUsername, selectedOption) => {
        const newSelectedVideos = {...selectedVideos, [influencerUsername]: selectedOption};
        setSelectedVideos(newSelectedVideos);
    };

    const EditCampaignForm = ({instagramUsername}) => {
        const video = selectedVideoToEdit;
        const videoIndex = dataPromo.videos.findIndex(v => v.videoLink === video.videoLink);

        const [videoParams, setVideoParams] = useState({
            videoLink: video.videoLink,
            postDescription: video.postDescription,
            storyTag: video.storyTag,
            swipeUpLink: video.swipeUpLink,
            specialWishes: video.specialWishes
        });

        const handleInputChange = (field, value) => {
            setVideoParams((prevParams) => ({
                ...prevParams,
                [field]: value
            }));
        };

        const handleSave = () => {
            dispatch(updateVideo({
                index: videoIndex,
                videoData: videoParams
            }));
            setEditCampaign(false);
            setSelectedVideos((prevSelectedVideos) => {
                const updatedSelectedVideos = {...prevSelectedVideos};

                Object.keys(updatedSelectedVideos).forEach((user) => {
                    if (updatedSelectedVideos[user].value === video.videoLink) {
                        updatedSelectedVideos[user] = {
                            value: videoParams.videoLink,
                            label: `${returnPostName()} ${videoIndex + 1}`
                        };
                    }
                });

                return updatedSelectedVideos;
            });
        };

        const returnVideoContent = () => {
            if (socialMedia === "spotify" || socialMedia === "soundcloud") {
                return (
                    <div>
                        <TextInput
                            title="Track Title"
                            placeholder="Artist - Song Title"
                            style={{marginTop: "30px"}}
                            value={videoParams.postDescription}
                            setValue={(value) => handleInputChange("postDescription", value)}
                            silverColor={true}
                        />
                        <TextInput
                            title={socialMedia === "spotify" ? "Spotify Track Link" : "Soundcloud Track Link"}
                            placeholder={socialMedia === "spotify" ? "Enter spotify track link" : "Enter soundcloud track link"}
                            style={{marginTop: "60px"}}
                            value={videoParams.videoLink}
                            setValue={(value) => handleInputChange("videoLink", value)}
                            silverColor={true}
                        />
                        <TextArea
                            title="Special Requests"
                            placeholder="Enter special requests"
                            style={{marginTop: "60px"}}
                            value={videoParams.specialWishes}
                            setValue={(value) => handleInputChange("specialWishes", value)}
                            silverColor={true}
                        />
                    </div>
                )
            } else if (socialMedia === 'press') {
                return (
                    <div>
                        <TextInput
                            title="Link to Music, Events, News"
                            placeholder="Enter link to music, events, news"
                            style={{marginTop: "30px"}}
                            value={videoParams.videoLink}
                            setValue={(value) => handleInputChange("videoLink", value)}
                            silverColor={true}
                        />
                        <TextArea
                            title="Link to Artwork & Press Shots"
                            placeholder="Enter link to artwork & press shots"
                            style={{marginTop: "60px"}}
                            value={videoParams.postDescription}
                            setValue={(value) => handleInputChange("postDescription", value)}
                            silverColor={true}
                        />
                        <TextInput
                            title="Link to Press Release"
                            placeholder="Enter link to press release"
                            style={{marginTop: "60px"}}
                            value={videoParams.storyTag}
                            setValue={(value) => handleInputChange("storyTag", value)}
                            silverColor={true}
                        />
                        <TextArea
                            title="Special Requests"
                            placeholder="Enter special requests"
                            style={{marginTop: "60px"}}
                            value={videoParams.specialWishes}
                            setValue={(value) => handleInputChange("specialWishes", value)}
                            silverColor={true}
                        />
                    </div>
                )
            } else {
                return (
                    <div>
                        <TextInput
                            title="Videolink"
                            placeholder="Enter videolink"
                            style={{marginTop: "30px"}}
                            value={videoParams.videoLink}
                            setValue={(value) => handleInputChange("videoLink", value)}
                            silverColor={true}
                        />
                        <TextArea
                            title="Post Description"
                            placeholder="Enter description"
                            style={{marginTop: "60px"}}
                            value={videoParams.postDescription}
                            setValue={(value) => handleInputChange("postDescription", value)}
                            silverColor={true}
                        />
                        <TextInput
                            title="Story Tag"
                            placeholder="Enter story tag"
                            style={{marginTop: "60px"}}
                            value={videoParams.storyTag}
                            setValue={(value) => handleInputChange("storyTag", value)}
                            silverColor={true}
                        />
                        <TextInput
                            title="Swipe Up Link"
                            placeholder="Enter swipe up link"
                            style={{marginTop: "60px"}}
                            value={videoParams.swipeUpLink}
                            setValue={(value) => handleInputChange("swipeUpLink", value)}
                            silverColor={true}
                        />
                        <TextArea
                            title="Special Requests"
                            placeholder="Enter special requests"
                            style={{marginTop: "60px"}}
                            value={videoParams.specialWishes}
                            setValue={(value) => handleInputChange("specialWishes", value)}
                            silverColor={true}
                        />
                    </div>
                )
            }
        }

        return (
            <div style={{marginTop: 25}}>
                <p
                    style={{
                        fontFamily: "Geometria",
                        fontSize: "24px",
                        fontWeight: "700",
                        textAlign: "center",
                    }}
                >
                    {`${returnPostName()} ${dataPromo.videos.findIndex(v => v.videoLink === video.videoLink) + 1}`}
                </p>
                <form style={{padding: 20}}>
                    {returnVideoContent()}
                    <StandardButton text="Save" style={{
                        width: "100%",
                        marginTop: 20,
                    }} onClick={() => {
                        handleSave();
                    }}/>
                </form>
            </div>
        );
    };

    return (
        <section className="account-client">
            <div className="account-client-campaign-strategy">
                <div className="account-client-back-button">
                    <button style={{
                        position: "absolute", top: "195px", left: 50, width: 48, height: 48, cursor: "pointer",
                    }} onClick={() => dispatch(setCurrentWindow(3))}>
                        <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                    </button>
                </div>
                <div className="account-client-campaign-strategy-title">
                    <div className="account-client-campaign-strategy-title-section">
                        <TitleSection title="campaign" span="strategy"/>
                    </div>
                    <p>{dataPromo.campaignName}</p>
                </div>
                <div className="account-client-campaign-strategy-details">
                    <div className="account-client-campaign-strategy-details-first">
                        <p>Date Submitted: <span>{new Date(dataPromo?.createdAt).toLocaleDateString('en-GB')}</span>
                        </p>
                        <p>Price: <span>{dataPromo.amount}{dataPromo.currency}</span></p>
                    </div>
                    <div className="account-client-campaign-strategy-details-second">
                        <p>Combined Followers: <span>{getRoundedFollowers()}</span></p>
                        <p>Posts & Stories: <span>{dataPromo.selectInfluencers.length}</span></p>
                    </div>
                    <div className="account-client-campaign-strategy-details-third">
                        <p>Video Options: <span>{dataPromo.videos.length}</span></p>
                    </div>
                </div>
                <div className="account-client-campaign-strategy-influencers">
                    <button
                        style={{
                            fontFamily: "Geometria",
                            fontSize: "15px",
                            fontWeight: "400",
                            textAlign: "center",
                            textDecoration: "underline",
                            display: "block",
                            margin: "0 auto",
                            cursor: "pointer"
                        }}
                        onClick={handleSeeMoreClick}
                    >
                        {showMore ? 'See Less' : 'See More'}
                    </button>
                    <div className="account-client-campaign-strategy-influencers-table-container">
                        <table className="account-client-campaign-strategy-influencers-table">
                            <thead>
                            <tr className="account-client-campaign-strategy-influencers-table-header">
                                <th>Networks</th>
                                <th>Total Followers</th>
                                {showMore && <th>Genres</th>}
                                {showMore && <th>Top 5 Countries</th>}
                                <th>Date Request</th>
                                <th>{returnPostName()}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dataPromo.selectInfluencers.map((influencer, index) => (
                                <tr key={index}>
                                    <td style={{
                                        fontFamily: "Geometria",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        width: showMore ? '15%' : '30%',
                                    }}>{influencer.instagramUsername}</td>
                                    <td style={{
                                        fontFamily: "Geometria",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        width: showMore ? '10%' : '30%',
                                    }}>{findInsta(influencer)?.followersNumber ?? 0}</td>
                                    {showMore && <td style={{
                                        backgroundColor: '#ebebfd',
                                        fontFamily: "Geometria",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        width: '15%',
                                    }}>{getDisplayGenre(findInsta(influencer)?.musicSubStyles, findInsta(influencer)?.musicStyle, findInsta(influencer)?.musicStyleOther)}</td>}
                                    {showMore && <td style={{
                                        backgroundColor: '#ebebfd',
                                        fontFamily: "Geometria",
                                        fontSize: "15px",
                                        fontWeight: "400",
                                        width: '30%',
                                    }}
                                                     dangerouslySetInnerHTML={{__html: formatCountries(findInsta(influencer)?.countries)}}/>}
                                    <td>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: showMore ? '10%' : '30%'
                                        }}>
                                            <CustomSelect
                                                selectedOption={selectedOptionDateRequest[influencer.instagramUsername]}
                                                setSelectedOption={(selectedOption) => {
                                                    handleDateChange(influencer.instagramUsername, selectedOption);
                                                }}
                                                options={optionsForDateRequestColumn}
                                            />

                                            {(selectedOptionDateRequest[influencer.instagramUsername]?.value === 'Before' ||
                                                selectedOptionDateRequest[influencer.instagramUsername]?.value === 'After') && (
                                                <input
                                                    type="text"
                                                    value={selectedDates[influencer.instagramUsername] || ''}
                                                    onChange={(e) => handleDateInputChange(influencer.instagramUsername, e)}
                                                    placeholder="xx/xx/xx"
                                                    style={{marginLeft: 10, width: 80, textAlign: 'center'}}
                                                />
                                            )}

                                        </div>
                                    </td>
                                    <td>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                            <CustomSelect
                                                selectedOption={selectedVideos[influencer.instagramUsername]}
                                                setSelectedOption={(selectedOption) => handleVideoChange(influencer.instagramUsername, selectedOption)}
                                                options={optionsForVideoColumn}
                                            />
                                            {selectedVideos[influencer.instagramUsername] && selectedVideos[influencer.instagramUsername].value && selectedVideos[influencer.instagramUsername].value !== `${returnPostName()} 1` && (
                                                <button
                                                    onClick={() => {
                                                        const video = dataPromo.videos.find(video => video.videoLink === selectedVideos[influencer.instagramUsername].value);
                                                        const newSelectedVideo = {
                                                            ...video,
                                                            instagramUsername: influencer.instagramUsername
                                                        };

                                                        setSelectedVideoToEdit(newSelectedVideo);
                                                        setEditCampaign(true);
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
                                                        marginLeft: 8,
                                                        border: "1.5px solid #3330E4",
                                                        boxSizing: 'border-box'
                                                    }}>
                                                    <img src={watch} alt="watch"/>
                                                    <img src={edit} alt="edit"/>
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr className="account-client-campaign-strategy-influencers-table-footer">
                                <td>Price: {dataPromo.amount}{dataPromo.currency}</td>
                                <td>{getTotalFollowers()}</td>
                                {showMore && <td></td>}
                                {showMore && <td style={{background: "#ebad82"}}></td>}
                                <td></td>
                                <td></td>
                            </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>

                <div className="account-client-campaign-strategy-mobile-table">
                    <table>
                        <thead></thead>
                        <tbody>
                        {dataPromo.selectInfluencers.map((influencer, index) => (
                            <tr className="account-client-campaign-strategy-mobile-table-row" key={index}>
                                <td className="account-client-campaign-strategy-mobile-table-row-instagram">
                                    <p>{influencer.instagramUsername}</p>
                                </td>
                                <td className="account-client-campaign-strategy-mobile-table-row-content">
                                    <div
                                        className="account-client-campaign-strategy-mobile-table-row-content-followers">
                                        <p>{findInsta(influencer)?.followersNumber ?? 0}</p>
                                        <span>Total Followers</span>
                                    </div>
                                    {showMore && (
                                        <div
                                            className="account-client-campaign-strategy-mobile-table-row-content-genres">
                                            <p>{getDisplayGenre(findInsta(influencer)?.musicSubStyles, findInsta(influencer)?.musicStyle, findInsta(influencer)?.musicStyleOther)}</p>
                                            <span>Genres</span>
                                        </div>
                                    )}
                                    {showMore && (
                                        <div
                                            className="account-client-campaign-strategy-mobile-table-row-content-countries mobile-country-list">
                                            <p dangerouslySetInnerHTML={{__html: formatCountries(findInsta(influencer)?.countries)}}/>
                                            <span>Top 5 Countries</span>
                                        </div>
                                    )}
                                    <div className="account-client-campaign-strategy-mobile-table-row-content-date">
                                        <div
                                            className="account-client-campaign-strategy-mobile-table-row-content-date-container">
                                            <CustomSelect
                                                selectedOption={selectedOptionDateRequest[influencer.instagramUsername]}
                                                setSelectedOption={(selectedOption) => {
                                                    handleDateChange(influencer.instagramUsername, selectedOption);
                                                }}
                                                options={optionsForDateRequestColumn}
                                            />
                                            {(selectedOptionDateRequest[influencer.instagramUsername]?.value === 'Before' ||
                                                selectedOptionDateRequest[influencer.instagramUsername]?.value === 'After') && (
                                                <input
                                                    type="text"
                                                    value={selectedDates[influencer.instagramUsername] || ''}
                                                    onChange={(e) => handleDateInputChange(influencer.instagramUsername, e)}
                                                    placeholder="xx/xx/xx"
                                                    style={{width: 80, textAlign: 'center'}}
                                                />
                                            )}
                                        </div>
                                        <p>Date Request</p>
                                    </div>
                                    <div
                                        className="account-client-campaign-strategy-mobile-table-row-content-video">
                                        <div
                                            className="account-client-campaign-strategy-mobile-table-row-content-video-edit">
                                            <CustomSelect
                                                selectedOption={selectedVideos[influencer.instagramUsername]}
                                                setSelectedOption={(selectedOption) => handleVideoChange(influencer.instagramUsername, selectedOption)}
                                                options={optionsForVideoColumn}
                                            />
                                            {selectedVideos[influencer.instagramUsername] && selectedVideos[influencer.instagramUsername].value && selectedVideos[influencer.instagramUsername].value !== `${returnPostName()} 1` && (
                                                <button
                                                    className="account-client-campaign-strategy-mobile-table-row-content-video-edit-button"
                                                    onClick={() => {
                                                        const video = dataPromo.videos.find(video => video.videoLink === selectedVideos[influencer.instagramUsername].value);
                                                        const newSelectedVideo = {
                                                            ...video,
                                                            instagramUsername: influencer.instagramUsername
                                                        };

                                                        setSelectedVideoToEdit(newSelectedVideo);
                                                        setEditCampaign(true);
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
                                                        border: "1.5px solid #3330E4",
                                                        boxSizing: 'border-box'
                                                    }}>
                                                    <img src={watch} alt="watch"/>
                                                    <img src={edit} alt="edit"/>
                                                </button>
                                            )}
                                        </div>
                                        <p>{returnPostName()}</p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr className="account-client-campaign-strategy-mobile-table-footer">
                            <td className="account-client-campaign-strategy-mobile-table-footer-price">
                                <p>Price: {dataPromo.amount}{dataPromo.currency}</p>
                            </td>
                            <td className="account-client-campaign-strategy-mobile-table-footer-followers">
                                <p>{getTotalFollowers()}</p>
                                <span>Total Followers</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </div>

                <div className="account-client-campaign-strategy-buttons">
                    <StandardButton text="Continue" onClick={() => nextForm()}/>
                </div>
            </div>

            {
                selectedVideoToEdit && (
                    <ModalWindow
                        header="Edit Campaign"
                        isOpen={editCampaign}
                        setClose={() => {
                            setEditCampaign(false);
                        }}
                    >
                        <EditCampaignForm instagramUsername={selectedVideoToEdit.instagramUsername}/>
                    </ModalWindow>
                )
            }
        </section>
    )
        ;
}

export default AccountClientCampaignStrategy;
