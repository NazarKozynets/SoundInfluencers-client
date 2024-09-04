import React, { useEffect, useState } from 'react';
import TitleSection from "../../../../TitleSection";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import StandardButton from "../../../../form/StandardButton";
import { setCurrentWindow } from "../../../../../redux/slice/create-promo";
import checkImg from "../../../../../images/icons/check.svg";
import Select, { components } from "react-select";
import arrow from "../../../../../images/icons/arrow.svg";

const AccountClientCampaignStrategy = () => {
    const [instagramAccounts, setInstagramAccounts] = useState([]);
    const [selectedOptionDateRequest, setSelectedOptionDateRequest] = useState('ASAP');
    const [inputDate, setInputDate] = useState('');
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

    const getTotalFollowers = () => {
        let totalFollowers = 0;

        instagramAccounts.forEach(account => {
            totalFollowers += Number(account?.followersNumber ?? 0);
        });

        return totalFollowers;
    }

    const nextForm = () => {
        dispatch(setCurrentWindow(5));
    };

    const options = [
        { value: 'ASAP', label: 'ASAP' },
        { value: "Before", label: 'Before' },
        { value: "After", label: 'After' },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 'auto',
            height: 30,
            minHeight: 30,
            borderRadius: 30,
            border: '1px solid #3330E4',
            paddingLeft: 10,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Geometria',
            fontSize: 18,
            fontWeight: 500,
            color: '#000000',
            boxShadow: 'none',
            lineHeight: 'normal',
            '&:hover': {
                borderColor: '#3330E4'
            }
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: 30,
            width: 222,
            maxHeight: 212,
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#000000',
            display: 'flex',
            alignItems: 'center'
        }),
        placeholder: (provided) => ({
            ...provided,
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'Geometria',
            fontSize: 18,
            fontWeight: 500,
            color: '#000000'
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: 30,
            minHeight: 30,
            padding: '0 0 2px 5px'
        }),
        input: (provided) => ({
            ...provided,
            height: 30,
            minHeight: 30,
            margin: 0,
            padding: 0
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: 30
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none'
        }),
        menuList: (provided) => ({
            ...provided,
            width: 222,
            height: 212,
            borderRadius: 30,
            boxShadow: '0px 4px 20px 0px rgba(51, 48, 228, 0.50)',
        }),
        option: (provided, state) => ({
            ...provided,
            fontFamily: 'Geometria',
            fontSize: 18,
            fontWeight: 500,
            color: '#000000',
            backgroundColor: state.isSelected ? '#FFFFFF' : '#FFFFFF',
            paddingLeft: state.isSelected ? '20px' : '20px',
            paddingRight: '20px',
            position: 'relative',
            '&:hover': {
                backgroundColor: '#3330E4',
                color: '#FFFFFF'
            }
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            padding: 0,
            marginRight: 5,
            '& svg': {
                margin: 0
            }
        })
    };

    const Option = (props) => (
        <components.Option {...props} style={{ position: 'relative' }}>
            {props.isSelected && <img src={checkImg} alt="check" style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 20,
                height: 20
            }} />}
            {props.children}
        </components.Option>
    );

    const SingleValue = ({ children, ...props }) => (
        <components.SingleValue {...props}>
            {children}
        </components.SingleValue>
    );

    const handleChangeDateRequest = (selectedOption) => {
        const sortMethod = selectedOption.value;
        setSelectedOptionDateRequest(sortMethod);
        if (sortMethod === 'Before' || sortMethod === 'After') {
            setInputDate(''); 
        }
    }

    const handleDateInputChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        let formattedValue = value;

        if (value.length > 2) {
            formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        if (value.length > 4) {
            formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        }

        setInputDate(formattedValue);
    }

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
    
    // const findGenres = (instagram) => {
    //     let genres = [];
    //     if (instagram?.musicStyle) {
    //         genres.push(instagram.musicStyle);
    //     }
    //     return genres;
    // }

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
                        {/* TODO: Add video options*/}
                        <p>Video Options: <span>{1}</span></p>
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
                                {!showMore && <th>Date Request</th>}
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
                                        width: '30%',
                                        fontFamily: "Geometria",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                    }}>{getDisplayGenre(findInsta(influencer)?.musicSubStyles, findInsta(influencer)?.musicStyle, findInsta(influencer)?.musicStyleOther)}</td>}
                                    {showMore && <td style={{
                                        backgroundColor: '#ebebfd',
                                        width: '30%',
                                        fontFamily: "Geometria",
                                        fontSize: "15px",
                                        fontWeight: "400",
                                    }}
                                                     dangerouslySetInnerHTML={{__html: formatCountries(findInsta(influencer)?.countries)}}></td>}
                                    {!showMore && (
                                        <td>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <Select
                                                    value={{
                                                        value: selectedOptionDateRequest,
                                                        label: selectedOptionDateRequest
                                                    }}
                                                    onChange={handleChangeDateRequest}
                                                    options={options}
                                                    styles={customStyles}
                                                    components={{SingleValue, Option}}
                                                    isSearchable={false}
                                                />
                                                {(selectedOptionDateRequest === 'Before' || selectedOptionDateRequest === 'After') && (
                                                    <input
                                                        type="text"
                                                        value={inputDate}
                                                        onChange={handleDateInputChange}
                                                        placeholder="xx/xx/xx"
                                                        style={{marginLeft: 10, width: 80, textAlign: 'center'}}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    <td>test</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr className="account-client-campaign-strategy-influencers-table-footer">
                                <td>Price: {dataPromo.amount}{dataPromo.currency}</td>
                                <td>{getTotalFollowers()}</td>
                                {showMore && <td></td>}
                                {showMore && <td style={{background: "#ebad82"}}></td>}
                                {!showMore && <td></td>}
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
