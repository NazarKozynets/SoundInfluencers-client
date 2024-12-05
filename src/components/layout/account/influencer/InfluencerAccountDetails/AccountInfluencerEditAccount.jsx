import React, {useEffect, useState} from "react";
import backBtn from "../../../../../images/icons/arrow.svg";
import TitleSection from "../../../../TitleSection";
import FormContainer from "../../../../form/FormContainer";
import TextInput from "../../../../form/TextInput";
import InputFile from "../../../../form/InputFile";
import SearchCountry from "../../../../form/SearchCountry/SearchCountry";
import SelectCurrency from "../../../../form/SelectCurrency/selectCurrency";
import StandardButton from "../../../../form/StandardButton";
import UseVerify from "../../../../../hooks/useVerify";
import {useNavigate, useParams} from "react-router-dom";
import {getSocialMedia} from "../../../../../utils/typeOfSocialAccounts";
import {genres} from "../../../../../utils/genresList";
import axios from "axios";
import AccountDetailsDeleteAccount from "./AccountDetailsDeleteAccount";
import ModalWindow from "../../../../ModalWindow";

const AccountInfluencerEditAccount = () => {
    const {accountId} = useParams();
    const navigate = useNavigate();

    const [accountDetails, setAccountDetails] = useState({});
    const [isAccountFound, setIsAccountFound] = useState(true);
    const [isErrorAfterSubmit, setIsErrorAfterSubmit] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [isModalAfterChangingPriceOpen, setIsModalAfterChangingPriceOpen] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (accountDetails.instagramUsername && accountDetails.instagramLink && accountDetails.followersNumber && accountDetails.logo && selectedGenres.length > 0) {
            setIsAllFieldsFilled(true);
        } else {
            setIsAllFieldsFilled(false);
        }
    }, [accountDetails]);

    const getData = async () => {
        try {
            const {dataFetch} = await UseVerify();

            try {
                const allAccounts = [
                    ...dataFetch.instagram.map(account => ({
                        ...account,
                        typeOfSocialMedia: 'instagram',
                        influencerId: dataFetch._id
                    })),
                    ...dataFetch.tiktok.map(account => ({
                        ...account,
                        typeOfSocialMedia: 'tiktok',
                        influencerId: dataFetch._id
                    })),
                    ...dataFetch.spotify.map(account => ({
                        ...account,
                        typeOfSocialMedia: 'spotify',
                        influencerId: dataFetch._id
                    })),
                    ...dataFetch.soundcloud.map(account => ({
                        ...account,
                        typeOfSocialMedia: 'soundcloud',
                        _id: dataFetch._id
                    })),
                    ...dataFetch.facebook.map(account => ({
                        ...account,
                        typeOfSocialMedia: 'facebook',
                        influencerId: dataFetch._id
                    })),
                    ...dataFetch.youtube.map(account => ({
                        ...account,
                        typeOfSocialMedia: 'youtube',
                        influencerId: dataFetch._id
                    })),
                    ...dataFetch.press.map(account => ({
                        ...account,
                        typeOfSocialMedia: 'press',
                        influencerId: dataFetch._id
                    })),
                ];

                const foundAccount = allAccounts.find(account => account._id === accountId);

                if (foundAccount) {
                    setAccountDetails(foundAccount);
                    setImageUrl(foundAccount.logo);

                    const genresSet = new Set();

                    if (foundAccount.musicStyle || foundAccount.musicSubStyles || foundAccount.musicStyleOther) {
                        if (foundAccount.musicSubStyles.length > 0) {
                            for (let i = 0; i < foundAccount.musicSubStyles.length; i++) {
                                if (foundAccount.musicSubStyles[i] === "Melodic, Minimal") {
                                    genresSet.add("Techno (Melodic, Minimal)");
                                }
                                if (foundAccount.musicSubStyles[i] === "Hard, Peak") {
                                    genresSet.add("Techno (Hard, Peak)");
                                }
                                if (foundAccount.musicSubStyles[i] === "Tech House") {
                                    genresSet.add("House (Tech House)");
                                }
                                if (foundAccount.musicSubStyles[i] === "Melodic, Afro") {
                                    genresSet.add("House (Melodic, Afro)");
                                }
                            }
                        } else {
                            genresSet.add(foundAccount.musicStyle);
                        }

                        for (let i = 0; i < foundAccount.musicStyleOther.length; i++) {
                            if (foundAccount.musicStyleOther[i] !== "House") {
                                genresSet.add(foundAccount.musicStyleOther[i]);
                            }
                        }
                    }

                    setSelectedGenres(Array.from(genresSet));

                    if (foundAccount.countries && foundAccount.countries.length > 0) {
                        setSelectedCountries(foundAccount.countries);
                    }
                } else {
                    setIsAccountFound(false);
                }
            } catch (err) {
                console.log('Ошибка при поиске аккаунта:', err);
            }
        } catch (err) {
            console.log('Ошибка при загрузке данных:', err);
        }
    };

    const handleFieldChangeAccountDetails = (field, value) => {
        setAccountDetails({
            ...accountDetails,
            [field]: value
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
    };

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

    const returnPriceInput = () => {
        switch (getSocialMedia(accountDetails.typeOfSocialMedia)) {
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
        switch (getSocialMedia(accountDetails.typeOfSocialMedia)) {
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
        switch (getSocialMedia(accountDetails.typeOfSocialMedia)) {
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

    const saveChanges = async () => {
        try {
            const {musicStyle, musicSubStyles, musicStyleOther} = filterMusicGenres();

            let logoUrl = accountDetails.logo ? accountDetails.logo : null;

            if (imageUrl && imageUrl !== accountDetails.logo) {
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
            }

            const result = await axios.put(`${process.env.REACT_APP_SERVER}/profile/influencer/update-social-media-account`, {
                _id: accountDetails.influencerId,
                typeOfSocialMedia: accountDetails.typeOfSocialMedia,
                accountId: accountDetails._id,
                instagramUsername: accountDetails.instagramUsername,
                instagramLink: accountDetails.instagramLink,
                followersNumber: accountDetails.followersNumber,
                logo: logoUrl,
                musicStyle,
                musicSubStyles,
                musicStyleOther,
                countries: selectedCountries,
                categories: accountDetails.categories,
                price: accountDetails.price,
                publicPrice: accountDetails.publicPrice,
            })

            if (result.data.code === 200) {
                navigate(`/account/influencer/details`);
            }
        } catch (err) {
            console.log('Ошибка при сохранении изменений:', err);
        }
    };

    const sendMailAboutChangingPrice = async () => {
        try {
            const result = await axios.post(`${process.env.REACT_APP_SERVER}/profile/influencer/send-mail-price-change`, {
                influencerId: accountDetails.influencerId,
                accountId: accountDetails._id,
                typeOfSocialMedia: accountDetails.typeOfSocialMedia,
            });

            if (result.data.code === 200) {
                setIsModalAfterChangingPriceOpen(true);
            }
        } catch (err) {
            console.log('Ошибка при отправке письма:', err);
        }
    };

    return (
        <section className="signup-influencer">
            <div className="admin-title-section">
                <button onClick={() => navigate(`/account/influencer/details`)}>
                    <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                </button>
                {!isAccountFound ? (
                    <TitleSection title="Account not found"/>
                ) : (
                    <TitleSection title="Edit your"
                                  span={`${getSocialMedia(accountDetails.typeOfSocialMedia)} account details`}/>
                )}
            </div>
            {isAccountFound && (
                <div className="container-form">
                    <div className='signup-influencer-block'>
                        <FormContainer style={{margin: '30px auto', width: '90%'}}>
                            <div className="signup-influencer-social-media-form">
                                <div>
                                    <TextInput title={returnAccountNameInput()}
                                               placeholder={`Enter ${accountDetails.typeOfSocialMedia} account name`}
                                               style={{maxWidth: '665px', margin: '30px auto 60px auto'}}
                                               value={accountDetails.instagramUsername}
                                               setValue={(value) => handleFieldChangeAccountDetails('instagramUsername', value)}/>
                                    <TextInput title={returnLinkInput()}
                                               placeholder={`Enter ${accountDetails.typeOfSocialMedia} link`}
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
                                         style={{width: getSocialMedia(accountDetails.typeOfSocialMedia) === "Spotify" && '100%'}}>
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
                                    {getSocialMedia(accountDetails.typeOfSocialMedia) !== "Spotify" && (
                                        <div className="block">
                                            <p id='title'>TOP LOCATIONS</p>
                                            <p>Enter the top 5 Countries, and their percentage</p>
                                            <div className='countries-container'>
                                                <div className='country'>
                                                    <span>#1</span>
                                                    <TextInput style={{
                                                        padding: '13px 10px',
                                                        width: window.innerWidth < 768 ? '15%' : '30%'
                                                    }}
                                                               silverColor={true}
                                                               placeholder='19.4%'
                                                               value={selectedCountries[0]?.percentage}
                                                               setValue={(value) => handleCountryChange(0, "percentage", value)}/>
                                                    <div style={{marginTop: 10}}>
                                                        <SearchCountry indexOfSelectingCountry={0}
                                                                       handleCountryChange={handleCountryChange}
                                                                       selectedCountries={selectedCountries}/>
                                                    </div>
                                                </div>
                                                <div className='country'>
                                                    <span>#2</span>
                                                    <TextInput style={{
                                                        padding: '13px 10px',
                                                        width: window.innerWidth < 768 ? '15%' : '30%'
                                                    }}
                                                               silverColor={true}
                                                               placeholder='9.4%'
                                                               value={selectedCountries[1]?.percentage}
                                                               setValue={(value) => handleCountryChange(1, "percentage", value)}/>
                                                    <div style={{marginTop: 10}}>
                                                        <SearchCountry indexOfSelectingCountry={1}
                                                                       handleCountryChange={handleCountryChange}
                                                                       selectedCountries={selectedCountries}/>
                                                    </div>
                                                </div>
                                                <div className='country'>
                                                    <span>#3</span>
                                                    <TextInput style={{
                                                        padding: '13px 10px',
                                                        width: window.innerWidth < 768 ? '15%' : '30%'
                                                    }}
                                                               silverColor={true}
                                                               value={selectedCountries[2]?.percentage}
                                                               setValue={(value) => handleCountryChange(2, "percentage", value)}
                                                               placeholder='4.4%'/>
                                                    <div style={{marginTop: 10}}>
                                                        <SearchCountry indexOfSelectingCountry={2}
                                                                       handleCountryChange={handleCountryChange}
                                                                       selectedCountries={selectedCountries}/>
                                                    </div>
                                                </div>
                                                <div className='country'>
                                                    <span>#4</span>
                                                    <TextInput style={{
                                                        padding: '13px 10px',
                                                        width: window.innerWidth < 768 ? '15%' : '30%'
                                                    }}
                                                               silverColor={true}
                                                               value={selectedCountries[3]?.percentage}
                                                               setValue={(value) => handleCountryChange(3, "percentage", value)}
                                                               placeholder='3.4%'/>
                                                    <div style={{marginTop: 10}}>
                                                        <SearchCountry indexOfSelectingCountry={3}
                                                                       handleCountryChange={handleCountryChange}
                                                                       selectedCountries={selectedCountries}/>
                                                    </div>
                                                </div>
                                                <div className='country'>
                                                    <span>#5</span>
                                                    <TextInput style={{
                                                        padding: '13px 10px',
                                                        width: window.innerWidth < 768 ? '15%' : '30%'
                                                    }}
                                                               silverColor={true}
                                                               value={selectedCountries[4]?.percentage}
                                                               setValue={(value) => handleCountryChange(4, "percentage", value)}
                                                               placeholder='1.4%'/>
                                                    <div style={{marginTop: 10}}>
                                                        <SearchCountry indexOfSelectingCountry={4}
                                                                       handleCountryChange={handleCountryChange}
                                                                       selectedCountries={selectedCountries}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="price-input-container">
                                    <p id='price-input-title'>{returnPriceInput()}</p>
                                    <div className="price-input-container-block" style={{marginTop: 20}}>
                                        <StandardButton text="Contact us to change price" isBlue={true}
                                                        onClick={() => sendMailAboutChangingPrice()}/>
                                    </div>
                                </div>

                                {isAllFieldsFilled && (
                                    <div className="save-account-button">
                                        <StandardButton text="Save Account" onClick={() => saveChanges()}/>
                                    </div>
                                )}

                                <div className="delete-account-button">
                                    <StandardButton isRed={true} text="Delete Account" onClick={() => {
                                        setIsDeleteAccountModalOpen(true);
                                    }}/>
                                </div>

                                {isErrorAfterSubmit && (
                                    <div className="error-message">
                                        <p>There was an error adding the account. Please try again.</p>
                                    </div>
                                )}

                                <AccountDetailsDeleteAccount
                                    _id={accountDetails.influencerId}
                                    typeOfSocialMedia={accountDetails.typeOfSocialMedia}
                                    accountId={accountId}
                                    isOpen={isDeleteAccountModalOpen}
                                    setClose={() => setIsDeleteAccountModalOpen(false)}
                                />

                                {isModalAfterChangingPriceOpen && (
                                    <ModalWindow isOpen={isModalAfterChangingPriceOpen}
                                                 setClose={() => setIsModalAfterChangingPriceOpen(false)}>
                                        <div className="change-price-modal">
                                            <p>The email has been delivered. Please await a response.</p>
                                            <StandardButton style={{margin: "40px auto 40px", width: 300}} text="Close"
                                                            onClick={() => setIsModalAfterChangingPriceOpen(false)}
                                                            isBlue={true}/>
                                        </div>
                                    </ModalWindow>
                                )}
                            </div>
                        </FormContainer>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AccountInfluencerEditAccount;