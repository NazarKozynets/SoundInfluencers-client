import React, {useEffect, useState} from "react";
import TitleSection from "../../TitleSection";
import {useDispatch, useSelector} from "react-redux";
import backBtn from "../../../images/icons/arrow.svg";
import {
    deleteSocialMediaAccount,
    setCurrentWindow,
    updateCurrentAccountId,
} from "../../../redux/slice/signup-influencer";
import FormContainer from "../../form/FormContainer";
import TextInput from "../../form/TextInput";
import InputFile from "../../form/InputFile";
import StandardButton from "../../form/StandardButton";
import axios from "axios";
import SelectCurrency from "../../form/SelectCurrency/selectCurrency";

const SignupInfluencerModalSocialMediaDetails = () => {
    const data = useSelector((state) => state.signupInfluencer);
    const dispatch = useDispatch();
    const [accountDetails, setAccountDetails] = useState(
        data.attachedSocialMediaAccounts.find(
            (account) => account._id === data.currentAccountId
        )
    );
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);
    const [isErrorAfterSubmit, setIsErrorAfterSubmit] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("€");

    const genres = [
        "Techno (Melodic, Minimal)",
        "Techno (Hard, Peak)",
        "House (Tech House)",
        "House (Melodic, Afro)",
        "EDM",
        "D&B",
        "Bass",
        "Psy, Trance",
        "Dubstep"
    ];

    useEffect(() => {
        const genresSet = new Set();

        if (accountDetails.logo) {
            setImageUrl(accountDetails.logo);
        }

        if (accountDetails.musicStyle || accountDetails.musicSubStyles || accountDetails.musicStyleOther) {
            if (accountDetails.musicSubStyles.length > 0) {
                for (let i = 0; i < accountDetails.musicSubStyles.length; i++) {
                    if (accountDetails.musicSubStyles[i] === "Melodic, Minimal") {
                        genresSet.add("Techno (Melodic, Minimal)");
                    }
                    if (accountDetails.musicSubStyles[i] === "Hard, Peak") {
                        genresSet.add("Techno (Hard, Peak)");
                    }
                    if (accountDetails.musicSubStyles[i] === "Tech House") {
                        genresSet.add("House (Tech House)");
                    }
                    if (accountDetails.musicSubStyles[i] === "Melodic, Afro") {
                        genresSet.add("House (Melodic, Afro)");
                    }
                }
            } else {
                genresSet.add(accountDetails.musicStyle);
            }

            for (let i = 0; i < accountDetails.musicStyleOther.length; i++) {
                if (accountDetails.musicStyleOther[i] !== "House") { 
                    genresSet.add(accountDetails.musicStyleOther[i]);
                }
            }
        }

        setSelectedGenres(Array.from(genresSet));
        
        if (accountDetails.countries && accountDetails.countries.length > 0) {
            setSelectedCountries(accountDetails.countries);
        }
    }, []);

    const handleFieldChangeAccountDetails = (field, value) => {
        setAccountDetails((prevDetails) => {
            if ((field === 'followersNumber' || field === 'price') && !/^[0-9]*$/.test(value)) {
                return prevDetails;
            }
            return {
                ...prevDetails,
                [field]: field === 'followersNumber' || field === 'price' ? (value === '' ? '' : Number(value)) : value,
            };
        });
    };

    const handleAvatarChange = (file) => {
        if (file && file.type && file.type.startsWith("image/")) {
            setAccountDetails({
                ...accountDetails,
                logo: file,
            });

            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setAccountDetails({
                ...accountDetails,
                logo: "",
            });
            setImageUrl(null);
        }
    };

    const handleCountryChange = (index, field, value) => {
        if (field === 'percentage' && !/^[0-9]*\.?[0-9]*$/.test(value)) return;

        const newCountries = [...selectedCountries];
        newCountries[index] = {...newCountries[index], [field]: value};
        setSelectedCountries(newCountries);
    };

    const handleGenreSelect = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((selectedGenre) => selectedGenre !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    }

    useEffect(() => {
        setIsAllFieldsFilled(selectedGenres.length > 0 && imageUrl && Object.values(accountDetails).every((value) => value))
    }, [selectedGenres, imageUrl, accountDetails]);

    const returnPriceInput = () => {
        switch (accountDetails.typeOfSocialMedia) {
            case 'Instagram':
                return 'Price for 1 Post & Story, include your currency*';
            case 'TikTok':
                return 'Price for 1 TikTok Post & Story, include your currency*';
            case 'Facebook':
                return 'Price for 1 Facebook Post & Story, include your currency*';
            case 'Spotify':
                return 'Price for 1 Spotify Feedback+ include your currency*';
            case 'SoundCloud':
                return 'Price for 1 SoundCloud Repost (10 days lenght minimum), include your currency*';
            case 'YouTube':
                return 'Price for 1 YouTube Post, include your currency*';
            case 'Press':
                return 'Price for 1 Article, include your currency*';
            default:
                return '';
        }
    }

    const returnAccountNameInput = () => {
        switch (accountDetails.typeOfSocialMedia) {
            case 'Instagram':
                return 'Instagram account name';
            case 'TikTok':
                return 'TikTok account name';
            case 'Facebook':
                return 'Facebook account name';
            case 'Spotify':
                return 'Spotify playlist name';
            case 'SoundCloud':
                return 'SoundCloud account name';
            case 'YouTube':
                return 'YouTube account name';
            case 'Press':
                return 'Brand account name';
            default:
                return '';
        }
    }

    const returnLinkInput = () => {
        switch (accountDetails.typeOfSocialMedia) {
            case 'Instagram':
                return 'Instagram link';
            case 'TikTok':
                return 'TikTok link';
            case 'Facebook':
                return 'Facebook link';
            case 'Spotify':
                return 'Spotify playlist link';
            case 'SoundCloud':
                return 'SoundCloud link';
            case 'YouTube':
                return 'YouTube link';
            case 'Press':
                return 'Website link';
            default:
                return '';
        }
    }

    const convertToEuro = () => {
        switch (selectedCurrency) {
            case "$":
                return accountDetails.price = accountDetails.price * 0.85;
            case "£":
                return accountDetails.price = accountDetails.price * 1.17;
            default:
                return accountDetails.price;
        }
    }

    const filterMusicGenres = () => {
        let musicStyle;
        let musicSubStyles = [];
        let musicStyleOther = [];

        const extractSubGenres = (genre) => {
            const match = genre.match(/\(([^)]+)\)/);
            return match ? [match[1].trim()] : [];
        };

        if (selectedGenres.includes("Techno (Melodic, Minimal)") || selectedGenres.includes("Techno (Hard, Peak)")) {
            musicStyle = "Techno";
            musicSubStyles = selectedGenres.flatMap(genre => extractSubGenres(genre));
        }

        if (selectedGenres.includes("House (Tech House)") || selectedGenres.includes("House (Melodic, Afro)")) {
            musicStyle = musicStyle === "Techno" ? musicStyle : "House";
            musicSubStyles = selectedGenres.flatMap(genre => extractSubGenres(genre));
        }

        if (musicStyle === "Techno" || musicStyle === "House") {
            selectedGenres.forEach(genre => {
                if (!musicStyleOther.includes(genre) && !genre.includes(musicStyle)) {
                    if (genre.includes("House") && !musicStyleOther.includes("House")) {
                        musicStyleOther.push("House");
                    } else if (!genre.includes("House")) {
                        musicStyleOther.push(genre);
                    }
                }
            });
        }

        if (!selectedGenres.includes("Techno (Melodic, Minimal)") && !selectedGenres.includes("Techno (Hard, Peak)") && !selectedGenres.includes("House (Tech House)") && !selectedGenres.includes("House (Melodic, Afro)")) {
            musicStyle = selectedGenres[0];
            if (selectedGenres.length > 1) {
                musicStyleOther = selectedGenres.slice(1);
            }
        }

        return {musicStyle, musicSubStyles, musicStyleOther};
    };

    const addAccountToAttached = async () => {
        const {musicStyle, musicSubStyles, musicStyleOther} = filterMusicGenres();

        const formData = new FormData();
        formData.append('file', accountDetails.logo);
        const response = await axios.post(
            `${process.env.REACT_APP_SERVER}/promos/uploadScreenshot`,
            formData,
            {headers: {"Content-Type": "multipart/form-data"}}
        );

        convertToEuro();

        if (response.data.code === 200) {
            dispatch(updateCurrentAccountId({
                ...accountDetails,
                logo: response.data.data,
                countries: selectedCountries,
                musicStyle: musicStyle,
                musicSubStyles: musicSubStyles || [],
                musicStyleOther: musicStyleOther || [],
            }));
            dispatch(setCurrentWindow(0));
        } else {
            setIsErrorAfterSubmit(true);
            console.log("Error uploading logo");
        }
    };

    const saveAccount = async () => {
        const {musicStyle, musicSubStyles, musicStyleOther} = filterMusicGenres();
        let logoUrl = null;

        if (imageUrl) {
            try {
                const formData = new FormData();
                formData.append('file', accountDetails.logo);
                const response = await axios.post(
                    `${process.env.REACT_APP_SERVER}/promos/uploadScreenshot`,
                    formData,
                    {headers: {"Content-Type": "multipart/form-data"}}
                );

                if (response.data.code === 200) {
                    logoUrl = response.data.data;
                }
            } catch (error) {
                console.log("Error uploading logo");
            }
        }
        if (accountDetails.price && selectedCurrency) convertToEuro();

        dispatch(updateCurrentAccountId({
            ...accountDetails,
            logo: logoUrl ? logoUrl : accountDetails.logo,
            countries: selectedCountries ? selectedCountries : [],
            musicStyle: musicStyle,
            musicSubStyles: musicSubStyles,
            musicStyleOther: musicStyleOther,
            instagramLink: accountDetails.instagramLink ? accountDetails.instagramLink : "",
            instagramUsername: accountDetails.instagramUsername ? accountDetails.instagramUsername : "",
            followersNumber: accountDetails.followersNumber ? accountDetails.followersNumber : 0,
            price: accountDetails.price ? accountDetails.price : "",
            currency: selectedCurrency ? selectedCurrency : "",
        }));
        dispatch(setCurrentWindow(0));
    };

    const prevPage = () => {
        if (accountDetails.instagramUsername === '' && accountDetails.instagramLink === '' && accountDetails.followersNumber === '' && accountDetails.logo === '' && selectedGenres.length === 0 && selectedCountries.length === 0 && accountDetails.price === '') {
            dispatch(deleteSocialMediaAccount(data.currentAccountId));
            dispatch(setCurrentWindow(0));
        } else {
            saveAccount();
        }
    };

    return (
        <section className="signup-influencer">
            <div className="admin-title-section">
                <button onClick={() => prevPage()}>
                    <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                </button>
                <TitleSection title='Add your' span={data.selectedSocialMedia + ' account details'}/>
            </div>
            <div className="container-form">
                <div className='signup-influencer-block'>
                    <FormContainer style={{margin: '30px auto', width: '90%'}}>
                        <div className="signup-influencer-social-media-form">
                            <div>
                                <TextInput title={returnAccountNameInput()}
                                           placeholder={`Enter ${data.selectedSocialMedia} account name`}
                                           style={{maxWidth: '665px', margin: '30px auto 60px auto'}}
                                           value={accountDetails.instagramUsername}
                                           setValue={(value) => handleFieldChangeAccountDetails('instagramUsername', value)}/>
                                <TextInput title={returnLinkInput()}
                                           placeholder={`Enter ${data.selectedSocialMedia} link`}
                                           style={{maxWidth: '665px', margin: '0 auto 60px auto'}}
                                           value={accountDetails.instagramLink}
                                           setValue={(value) => handleFieldChangeAccountDetails('instagramLink', value)}/>
                                <TextInput
                                    title={accountDetails.typeOfSocialMedia !== "Press" ? "Followers Number" : "Average Monthly Traffic"}
                                    placeholder={accountDetails.typeOfSocialMedia !== "Press" ? "Enter followers number" : "Enter average monthly traffic number"}
                                    style={{maxWidth: '665px', margin: '0 auto 60px auto'}}
                                    value={accountDetails.followersNumber}
                                    setValue={(value) => handleFieldChangeAccountDetails('followersNumber', value)}/>
                                <InputFile
                                    title="Logo"
                                    placeholder="Attach the logo for your brand here"
                                    value={accountDetails.logo}
                                    style={{margin: '-25px auto 60px auto', maxWidth: '665px'}}
                                    setValue={(value) => handleAvatarChange(value)}
                                    className={"instagram-select-item-file"}
                                    setUploadProgress={() => {
                                    }}
                                />
                                {imageUrl && (
                                    <div>
                                        <div className="avatar-container">
                                            <img src={imageUrl} alt="Uploaded Logo"/>
                                        </div>
                                        <div className="cancel-avatar-btn">
                                            <button onClick={() => handleAvatarChange(null)}>CANCEL</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="genres-countries">
                                <div className="block"
                                     style={{width: accountDetails.typeOfSocialMedia === "Spotify" && '100%'}}>
                                    <p id='title'>MUSIC GENRES</p>
                                    <p>Select <b>ALL</b> the applicable</p>
                                    {genres.map((genre, index) => (
                                        <div key={index} className="checkbox">
                                            <input type="checkbox"
                                                   id={genre}
                                                   name={genre}
                                                   checked={selectedGenres.includes(genre)}
                                                   onChange={() => handleGenreSelect(genre)}
                                            />
                                            <label htmlFor={genre}>{genre}</label>
                                        </div>
                                    ))}
                                </div>
                                {accountDetails.typeOfSocialMedia !== "Spotify" && (
                                    <div className="block">
                                        <p id='title'>TOP LOCATIONS</p>
                                        <p>Enter the top 5 Countries, and their percentage</p>
                                        <div className='countries-container'>
                                            <div className='country'>
                                                <span>#1</span>
                                                <TextInput style={{padding: '13px 10px', width: '30%'}}
                                                           silverColor={true}
                                                           placeholder='19.4%'
                                                           value={selectedCountries[0]?.percentage}
                                                           setValue={(value) => handleCountryChange(0, "percentage", value)}/>
                                                <TextInput style={{padding: '13px 10px'}}
                                                           silverColor={true}
                                                           value={selectedCountries[0]?.country}
                                                           setValue={(value) => handleCountryChange(0, "country", value)}
                                                           placeholder='United States'/>
                                            </div>
                                            <div className='country'>
                                                <span>#2</span>
                                                <TextInput style={{padding: '13px 10px', width: '30%'}}
                                                           silverColor={true}
                                                           placeholder='9.4%'
                                                           value={selectedCountries[1]?.percentage}
                                                           setValue={(value) => handleCountryChange(1, "percentage", value)}/>
                                                <TextInput style={{padding: '13px 10px'}}
                                                           silverColor={true}
                                                           value={selectedCountries[1]?.country}
                                                           setValue={(value) => handleCountryChange(1, "country", value)}
                                                           placeholder='United Kingdom'/>
                                            </div>
                                            <div className='country'>
                                                <span>#3</span>
                                                <TextInput style={{padding: '13px 10px', width: '30%'}}
                                                           silverColor={true}
                                                           value={selectedCountries[2]?.percentage}
                                                           setValue={(value) => handleCountryChange(2, "percentage", value)}
                                                           placeholder='4.4%'/>
                                                <TextInput style={{padding: '13px 10px'}}
                                                           silverColor={true}
                                                           value={selectedCountries[2]?.country}
                                                           setValue={(value) => handleCountryChange(2, "country", value)}
                                                           placeholder='Germany'/>
                                            </div>
                                            <div className='country'>
                                                <span>#4</span>
                                                <TextInput style={{padding: '13px 10px', width: '30%'}}
                                                           silverColor={true}
                                                           value={selectedCountries[3]?.percentage}
                                                           setValue={(value) => handleCountryChange(3, "percentage", value)}
                                                           placeholder='3.4%'/>
                                                <TextInput style={{padding: '13px 10px'}}
                                                           silverColor={true}
                                                           value={selectedCountries[3]?.country}
                                                           setValue={(value) => handleCountryChange(3, "country", value)}
                                                           placeholder='Italy'/>
                                            </div>
                                            <div className='country'>
                                                <span>#5</span>
                                                <TextInput style={{padding: '13px 10px', width: '30%'}}
                                                           silverColor={true}
                                                           value={selectedCountries[4]?.percentage}
                                                           setValue={(value) => handleCountryChange(4, "percentage", value)}
                                                           placeholder='1.4%'/>
                                                <TextInput style={{padding: '13px 10px'}}
                                                           silverColor={true}
                                                           value={selectedCountries[4]?.country}
                                                           setValue={(value) => handleCountryChange(4, "country", value)}
                                                           placeholder='Spain'/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="price-input-container">
                                <p id='price-input-title'>{returnPriceInput()}</p>
                                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                                    <div id="price-input-field">
                                        <input type="text" placeholder='50'
                                               value={accountDetails.price}
                                               onChange={(e) => handleFieldChangeAccountDetails('price', e.target.value)}/>
                                    </div>
                                    <div>
                                        <SelectCurrency selectedCurrency={selectedCurrency}
                                                        setSelectedCurrency={setSelectedCurrency}/>
                                    </div>
                                </div>
                            </div>

                            {isAllFieldsFilled ? (
                                <div className="save-account-button">
                                    <StandardButton text="Add Account" onClick={() => addAccountToAttached()}/>
                                </div>
                            ) : (
                                <div className="save-account-button">
                                    <StandardButton text="Save Account" onClick={() => saveAccount()}/>
                                </div>
                            )}

                            <div className="delete-account-button">
                                <StandardButton isBlue={true} text="Delete Account" onClick={() => {
                                    dispatch(deleteSocialMediaAccount(data.currentAccountId));
                                    dispatch(setCurrentWindow(0));
                                }}/>
                            </div>

                            {isErrorAfterSubmit && (
                                <div className="error-message">
                                    <p>There was an error adding the account. Please try again.</p>
                                </div>
                            )}
                        </div>
                    </FormContainer>
                </div>
            </div>
        </section>
    );
};

export default SignupInfluencerModalSocialMediaDetails;