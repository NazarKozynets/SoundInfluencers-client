import React, {useEffect, useState} from "react";
import TitleSection from "../../../../TitleSection";
import FormContainer from "../../../../form/FormContainer";
import TextInput from "../../../../form/TextInput";
import TextArea from "../../../../form/TextArea";
import StandardButton from "../../../../form/StandardButton";
import {useDispatch, useSelector} from "react-redux";
import {
    setClearForm,
    setCurrentWindow,
    setCampaignName,
    setCreatedAt,
    addVideo,
    updateVideo, removeVideo,
} from "../../../../../redux/slice/create-promo";
import arrow from "../../../../../images/icons/arrow.svg";
import close from "../../../../../images/icons/close.svg";

const AccountClientPostContent = () => {
    const dispatch = useDispatch();
    const dataPromo = useSelector((state) => state.createPromo.data);

    const [formError, setFormError] = useState({
        campaignName: false,
        videoLink: false,
        postDescription: false,
        storyTag: false,
        swipeUpLink: false,
        specialWishes: false,
        createdAt: false,
    });

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        dispatch(setCreatedAt(today));
    }, [dispatch]);
    
    const handleVideoChange = (index, field, value) => {
        const updatedVideo = {...dataPromo.videos[index], [field]: value};
        dispatch(updateVideo({index, videoData: updatedVideo}));
    };

    const addNewVideo = () => {
        const newVideo = {
            videoLink: "",
            postDescription: "",
            storyTag: "",
            swipeUpLink: "",
            dateRequest: "01/01/01",
            specialWishes: "",
        };
        dispatch(addVideo(newVideo));
    };

    const nextForm = () => {
        let listError = {
            campaignName: false,
        };
        let haveError = false;

        if (dataPromo.campaignName === "") {
            haveError = true;
            listError = {...listError, campaignName: true};
        }

        dataPromo.videos.forEach((video, index) => {
            if (
                video.videoLink === "" ||
                video.postDescription === "" ||
                video.storyTag === "" ||
                video.swipeUpLink === "" ||
                video.specialWishes === ""
            ) {
                haveError = true;
                setFormError((prev) => ({
                    ...prev,
                    [`video${index}`]: true,
                }));
            }
        });

        if (haveError) {
            setFormError(listError);
            return;
        }

        dispatch(setCurrentWindow(4));
    };

    return (
        <section className="account-client">
            <div className="account-client-back-button">
                <button style={{
                    position: "absolute", top: "195px", left: 50, width: 48, height: 48, cursor: "pointer",
                }} onClick={() => dispatch(setCurrentWindow(1))}>
                    <img src={arrow} style={{transform: "rotate(180deg)"}}/>
                </button>
            </div>
            <div className="container-post-campaign-form">
                <div className="account-client-block" style={{position: "relative"}}>
                    <TitleSection title="post" span="this content"/>

                    <div className="account-client-post-campaign-name">
                        <p>CAMPAIGN NAME</p>
                        <TextInput
                            placeholder="Enter Campaign Name"
                            style={{marginTop: "21px"}}
                            value={dataPromo.campaignName}
                            setValue={(value) => dispatch(setCampaignName(value))}
                            error={formError.campaignName}
                            onFocus={() => setFormError({...formError, campaignName: false})}
                            silverColor={true}
                        />
                    </div>

                    {dataPromo.videos.map((video, index) => (
                        <div key={index} style={{marginTop: 75}} className="container-post-campaign-form-block">
                            <p
                                style={{
                                    fontFamily: "Geometria",
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    textAlign: "center",
                                }}
                            >
                                VIDEO {index + 1}
                            </p>
                            <FormContainer style={{marginTop: "40px"}}>
                                <div style={{position: "relative"}}>
                                    {index > 0 && (<button 
                                        id="account-client-post-delete-button"
                                        onClick={() => dispatch(removeVideo(index))}
                                        style={{
                                        position: "absolute",
                                        top: "-45px",
                                        right: "20px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                    }}>
                                        <img style={{width: 25, height: 25}} src={close} alt={'close'}/>
                                    </button>)}
                                    <form className="account-client-post">
                                        <TextInput
                                            title="Videolink"
                                            placeholder="Enter videolink"
                                            style={{marginTop: "30px"}}
                                            value={video.videoLink}
                                            setValue={(value) =>
                                                handleVideoChange(index, "videoLink", value)
                                            }
                                            error={formError[`video${index}`]?.videoLink}
                                            onFocus={() =>
                                                setFormError({
                                                    ...formError,
                                                    [`video${index}`]: false,
                                                })
                                            }
                                            silverColor={true}
                                        />
                                        <TextArea
                                            title="Post Description"
                                            placeholder="Enter description"
                                            style={{marginTop: "60px"}}
                                            value={video.postDescription}
                                            setValue={(value) =>
                                                handleVideoChange(index, "postDescription", value)
                                            }
                                            error={formError[`video${index}`]?.postDescription}
                                            onFocus={() =>
                                                setFormError({
                                                    ...formError,
                                                    [`video${index}`]: false,
                                                })
                                            }
                                        />
                                        <TextInput
                                            title="Story Tag"
                                            placeholder="Enter story tag"
                                            style={{marginTop: "60px"}}
                                            value={video.storyTag}
                                            setValue={(value) =>
                                                handleVideoChange(index, "storyTag", value)
                                            }
                                            error={formError[`video${index}`]?.storyTag}
                                            onFocus={() =>
                                                setFormError({
                                                    ...formError,
                                                    [`video${index}`]: false,
                                                })
                                            }
                                            silverColor={true}
                                        />
                                        <TextInput
                                            title="Story Link"
                                            placeholder="Enter swipe up link"
                                            style={{marginTop: "60px"}}
                                            value={video.swipeUpLink}
                                            setValue={(value) =>
                                                handleVideoChange(index, "swipeUpLink", value)
                                            }
                                            error={formError[`video${index}`]?.swipeUpLink}
                                            onFocus={() =>
                                                setFormError({
                                                    ...formError,
                                                    [`video${index}`]: false,
                                                })
                                            }
                                            silverColor={true}
                                        />
                                        <TextArea
                                            title="Special Requests"
                                            placeholder="Enter special requests"
                                            style={{marginTop: "60px"}}
                                            value={video.specialWishes}
                                            setValue={(value) =>
                                                handleVideoChange(index, "specialWishes", value)
                                            }
                                            error={formError[`video${index}`]?.specialWishes}
                                            onFocus={() =>
                                                setFormError({
                                                    ...formError,
                                                    [`video${index}`]: false,
                                                })
                                            }
                                        />
                                    </form>
                                </div>
                            </FormContainer>
                        </div>
                    ))}

                    <div
                        style={{
                            marginTop: "72px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "90px",
                        }}
                    >
                        <StandardButton
                            text="Add Additional Video"
                            isBlue={true}
                            onClick={() => addNewVideo()}
                        />
                        <StandardButton text="Continue" onClick={() => nextForm()}/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AccountClientPostContent;
