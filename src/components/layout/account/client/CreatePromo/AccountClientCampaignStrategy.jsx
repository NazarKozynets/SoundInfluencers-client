import React, {useEffect, useState} from 'react';
import TitleSection from "../../../../TitleSection";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import StandardButton from "../../../../form/StandardButton";
import {
    setCurrentWindow,
    updateSelectInfluencer
} from "../../../../../redux/slice/create-promo";
import checkImg from "../../../../../images/icons/check.svg";
import Select, {components} from "react-select";
import arrow from "../../../../../images/icons/arrow.svg";
import watch from "../../../../../images/icons/view 1.svg"
import CustomSelect from "../../../../form/Offers/CampaignStrategySelect/CampaignStrategySelect";


const AccountClientCampaignStrategy = () => {
    const [instagramAccounts, setInstagramAccounts] = useState([]);
    const [selectedDates, setSelectedDates] = useState({});
    const [selectedOptionDateRequest, setSelectedOptionDateRequest] = useState({});
    const [selectedVideos, setSelectedVideos] = useState({});
    const [showMore, setShowMore] = useState(false);

    const navigation = useNavigate();
    const dispatch = useDispatch();
    const dataPromo = useSelector((state) => state.createPromo.data);

    const getInstagramAccounts = async () => {
        const selectInfluencers = dataPromo.selectInfluencers;

        try {
            let accountsList = [];

            for (let influencer of selectInfluencers) {
                const result = await axios.get(`${process.env.REACT_APP_SERVER}/auth/influencer/${influencer.influencerId}`);

                if (result.data.code === 200) {
                    const fetchedInfluencer = result.data.influencer;

                    if (fetchedInfluencer && fetchedInfluencer.instagram) {
                        const instagramAccount = fetchedInfluencer.instagram.find(account =>
                            account.instagramUsername === influencer.instagramUsername
                        );

                        if (instagramAccount) {
                            accountsList.push(instagramAccount);
                        }
                    }
                }
            }

            setInstagramAccounts(accountsList);
        } catch (error) {
            console.error("Error fetching Instagram accounts: ", error);
        }
    };

    useEffect(() => {
        getInstagramAccounts();
    }, [dataPromo.selectInfluencers]);

    useEffect(() => {
        const initialSelectedVideos = dataPromo.selectInfluencers.reduce((acc, influencer) => {
            acc[influencer.instagramUsername] = {value: 'Video 1', label: 'Select'};
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

        instagramAccounts.forEach(account => {
            totalFollowers += Number(account?.followersNumber ?? 0);
        });

        return totalFollowers;
    }

    const nextForm = () => {
        const updatedSelectInfluencersData = dataPromo.selectInfluencers.map(influencer => {
            const dateRequest = selectedOptionDateRequest[influencer.instagramUsername]?.value;
            const dateToDo = dateRequest === 'ASAP'
                ? 'ASAP'
                : `${dateRequest} ${selectedDates[influencer.instagramUsername]}`;

            return {
                ...influencer,
                dateRequest: dateToDo,
                selectedVideo: selectedVideos[influencer.instagramUsername]?.value,
            };
        });

        dispatch(updateSelectInfluencer(updatedSelectInfluencersData));

        dispatch(setCurrentWindow(5));
    };

    const optionsForDateRequestColumn = [
        {value: 'ASAP', label: 'ASAP'},
        {value: "Before", label: 'Before'},
        {value: "After", label: 'After'},
    ];

    const optionsForVideoColumn = dataPromo.videos.map((video, index) => ({
        value: video.videoLink,
        label: `Video ${index + 1}`
    }));

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
        return instagramAccounts.find(account => account.instagramUsername === influencer.instagramUsername);
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
            return countries.map(country =>
                `${country.country} <span style="font-size: 9px;">${country.percentage}%</span>`
            ).join(' - ');
        } else {
            return 'No countries available';
        }
    };

    const handleVideoChange = (influencerUsername, selectedOption) => {
        const newSelectedVideos = {...selectedVideos, [influencerUsername]: selectedOption};
        setSelectedVideos(newSelectedVideos);
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
                    <TitleSection title="campaign" span="strategy"/>
                    <p>{dataPromo.campaignName}</p>
                </div>
                <div className="account-client-campaign-strategy-details">
                    <div className="account-client-campaign-strategy-details-first">
                        <p>Date: <span>{dataPromo.createdAt}</span></p>
                        <p>Price: <span>{dataPromo.amount}{dataPromo.currency}</span></p>
                    </div>
                    <div className="account-client-campaign-strategy-details-second">
                        <p>Combined Followers: <span>{dataPromo.selectPrice.variant}M</span></p>
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
                                <th>Video</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dataPromo.selectInfluencers.map((influencer, index) => (
                                <tr key={index}>
                                    <td style={{
                                        fontFamily: "Geometria",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                    }}>{influencer.instagramUsername}</td>
                                    <td style={{
                                        fontFamily: "Geometria",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                    }}>{findInsta(influencer)?.followersNumber ?? 0}</td>
                                    {showMore && <td style={{
                                        backgroundColor: '#ebebfd',
                                        fontFamily: "Geometria",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        width: '10%',
                                    }}>{getDisplayGenre(findInsta(influencer)?.musicSubStyles, findInsta(influencer)?.musicStyle, findInsta(influencer)?.musicStyleOther)}</td>}
                                    {showMore && <td style={{
                                        backgroundColor: '#ebebfd',
                                        fontFamily: "Geometria",
                                        fontSize: "15px",
                                        fontWeight: "400",
                                    }}
                                                     dangerouslySetInnerHTML={{__html: formatCountries(findInsta(influencer)?.countries)}}/>}
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
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
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <CustomSelect
                                                selectedOption={selectedVideos[influencer.instagramUsername]}
                                                setSelectedOption={(selectedOption) => handleVideoChange(influencer.instagramUsername, selectedOption)}
                                                options={optionsForVideoColumn}
                                            />
                                            {selectedVideos[influencer.instagramUsername] && selectedVideos[influencer.instagramUsername].value && selectedVideos[influencer.instagramUsername].value !== 'Video 1' && (
                                                <a
                                                    href={selectedVideos[influencer.instagramUsername].value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{paddingLeft: 10}}
                                                >
                                                    <img
                                                        src={watch}
                                                        alt="Watch"
                                                        style={{width: 24, height: 24, cursor: 'pointer'}}
                                                    />
                                                </a>
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
                <div className="account-client-campaign-strategy-buttons">
                    <StandardButton text="Continue" onClick={() => nextForm()}/>
                </div>
            </div>
        </section>
    );
}

export default AccountClientCampaignStrategy;
