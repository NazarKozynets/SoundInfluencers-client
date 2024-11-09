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
    
    const handleFieldChangeAccountDetails = (field, value) => {
        setAccountDetails({
            ...accountDetails,
            [field]: (field === 'followersNumber' || field === 'price') && /^[0-9]+$/.test(value) ? Number(value) : (field === 'followersNumber' || field === 'price' ? '' : value),
        });
    };

    const handleAvatarChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setAccountDetails({
                ...accountDetails,
                logo: file,
            });

            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(file);
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
        setIsAllFieldsFilled(selectedCountries.length === 5 && selectedGenres.length > 0 && imageUrl && Object.values(accountDetails).every((value) => value))
    }, [selectedCountries, selectedGenres, imageUrl, accountDetails]);

    const addAccountToAttached = async () => {
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

        const formData = new FormData();
        formData.append('file', accountDetails.logo);
        const response = await axios.post(
            `${process.env.REACT_APP_SERVER}/promos/uploadScreenshot`,
            formData,
            {headers: {"Content-Type": "multipart/form-data"}}
        );

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

    return (
        <section className="signup-influencer">
            <div className="admin-title-section">
                <button onClick={() => {
                    dispatch(deleteSocialMediaAccount(data.currentAccountId));
                    dispatch(setCurrentWindow(0))
                }}>
                    <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                </button>
                <TitleSection title='Add your' span={data.selectedSocialMedia + ' account details'}/>
            </div>
            <div className="container-form">
                <div className='signup-influencer-block'>
                    <FormContainer style={{margin: '30px auto', width: '90%'}}>
                        <div className="signup-influencer-social-media-form">
                            <div>
                                <TextInput title={data.selectedSocialMedia + ' account name'}
                                           placeholder={`Enter ${data.selectedSocialMedia} account name`}
                                           style={{maxWidth: '665px', margin: '30px auto 60px auto'}}
                                           value={accountDetails.instagramUsername}
                                           setValue={(value) => handleFieldChangeAccountDetails('instagramUsername', value)}/>
                                <TextInput title={data.selectedSocialMedia + ' link'}
                                           placeholder={`Enter ${data.selectedSocialMedia} link`}
                                           style={{maxWidth: '665px', margin: '0 auto 60px auto'}}
                                           value={accountDetails.instagramLink}
                                           setValue={(value) => handleFieldChangeAccountDetails('instagramLink', value)}/>
                                <TextInput title='Followers Number' placeholder='Enter followers number'
                                           style={{maxWidth: '665px', margin: '0 auto 60px auto'}}
                                           value={accountDetails.followersNumber}
                                           setValue={(value) => handleFieldChangeAccountDetails('followersNumber', value)}/>
                                <InputFile
                                    title="Logo"
                                    placeholder="Attach the logo for your brand here"
                                    style={{margin: '0 auto 60px auto', maxWidth: '665px'}}
                                    setValue={(value) => handleAvatarChange(value)}
                                    className={"instagram-select-item-file"}
                                    setUploadProgress={() => {
                                    }}
                                />
                                {imageUrl && (
                                    <div className="avatar-container">
                                        <img src={imageUrl} alt="Uploaded Logo"/>
                                    </div>
                                )}
                            </div>

                            <div className="genres-countries">
                                <div className="block">
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
                            </div>

                            <div>
                                <TextInput title='Price for 1 Post & Story, include your currency*'
                                           placeholder='Enter your price here for 1 Instagram Post & Story, include your currency'
                                           style={{maxWidth: '665px', margin: '70px auto 0px auto'}}
                                           value={accountDetails.price}
                                           setValue={(value) => handleFieldChangeAccountDetails('price', value)}/>
                            </div>

                            {isAllFieldsFilled && (
                                <div className="save-account-button">
                                    <StandardButton text="Add Account" onClick={() => addAccountToAttached()}/>
                                </div>
                            )}

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