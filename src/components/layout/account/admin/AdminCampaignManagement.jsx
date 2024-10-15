import React, {useEffect, useRef, useState} from "react";
import backBtn from "../../../../images/icons/arrow.svg";
import TitleSection from "../../../TitleSection";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Loading from "../../../form/PageLoading/pageLoading";
import {extractNumber} from "../../../../utils/validations";
import videoImg from "../../../../images/icons/iconsForCampaignReport/video 1.svg";
import linkImg from "../../../../images/icons/iconsForCampaignReport/link 1.svg";
import editImg from "../../../../images/icons/edit 1.svg";
import deleteImg from "../../../../images/icons/adminPanel/campaignManagement/close 8.svg";
import addImg from "../../../../images/icons/adminPanel/campaignManagement/plus 2 2.svg";
import emailImg from "../../../../images/icons/mail (1) 1.svg";
import instagramIcon from "../../../../images/icons/iconsForCampaignReport/instagram 1.svg";
import imageImg from "../../../../images/icons/iconsForCampaignReport/image- 1.svg";
import ModalWindow from "../../../ModalWindow";
import StandardButton from "../../../form/StandardButton";
import TextInput from "../../../form/TextInput";
import SubmitButton from "./form/Influencers/SubmitFooter/SubmitButton";

const AdminCampaignManagement = () => {
    const [data, setData] = useState();
    const [cpmObj, setCpmObj] = useState({
        cpm: 0,
        avgCpm: '',
        result: '',
    });
    const [isVideoLinkEdit, setIsVideoLinkEdit] = useState(false);
    const [isPostLinkEdit, setIsPostLinkEdit] = useState(false);
    const [isScreenshotEdit, setIsScreenshotEdit] = useState(false);
    const containerRef = useRef(null);
    const saveChangesRef = useRef(null);
    const saveChangesCampaignRef = useRef(null);
    const containerCampaignRef = useRef(null);
    const [fieldsForChangeVideo, setFieldsForChangeVideo] = useState({
        _id: '',
        newVideoLink: '',
        oldVideoLink: '',
        postDescription: '',
        storyTag: '',
        swipeUpLink: '',
        influencerId: '',
        selectedInstagramUsername: '',
        videoId: '',
        specialWishes: '',
    });
    const [fieldsForChangeCampaign, setFieldsForChangeCampaign] = useState({
        _id: '',
        campaignName: '',
        amount: '',
    });
    const [fieldsForChangeInfluencer, setFieldsForChangeInfluencer] = useState({
        _id: '',
        instagramUsername: '',
        datePost: '',
        impressions: '',
        like: '',
        postLink: '',
        screenshot: '',
    });

    const navigate = useNavigate();
    const params = useParams();
    const getData = async () => {
        try {
            if (!params.campaignId) return navigate('/admin/campaigns');

            const result = await axios.get(
                `${process.env.REACT_APP_SERVER}/admin/promos/getOne/${params.campaignId}`,
            );
            if (result.status === 200) {
                const mergedInfluencers = mergeInfluencersWithVideos(result.data.data.selectInfluencers, result.data.data.videos);
                setData({
                    ...result.data.data,
                    selectInfluencers: mergedInfluencers
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const mergeInfluencersWithVideos = (influencers, videos) => {
        return influencers.map(influencer => {
            const selectedVideo = videos.find(video => video.videoLink === influencer.selectedVideo);
            if (selectedVideo) {
                return {
                    ...influencer,
                    videoDetails: selectedVideo
                };
            }
            return influencer;
        });
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        editCPMO();
    }, [data]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                saveChangesRef.current &&
                !saveChangesRef.current.contains(event.target)
            ) {
                setFieldsForChangeVideo({
                    _id: '',
                    newVideoLink: '',
                    oldVideoLink: '',
                    postDescription: '',
                    storyTag: '',
                    swipeUpLink: '',
                    influencerId: '',
                    selectedInstagramUsername: '',
                    specialWishes: '',
                });

                setFieldsForChangeInfluencer({
                    _id: '',
                    instagramUsername: '',
                    datePost: '',
                    impressions: '',
                    like: '',
                    postLink: '',
                    screenshot: '',
                });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerCampaignRef.current &&
                !containerCampaignRef.current.contains(event.target) &&
                saveChangesCampaignRef.current &&
                !saveChangesCampaignRef.current.contains(event.target)
            ) {
                setFieldsForChangeCampaign({
                    _id: '',
                    campaignName: '',
                    amount: '',
                });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const editCPMO = () => {
        if (data?.selectInfluencers?.find(influencer => influencer.impressions > 0)) {
            const cpm = data?.selectPrice.price / totalImpressions() * 1000;
            let avgCpm;

            if (cpm < 3) {
                avgCpm = '0 to 3€';
            } else if (cpm < 5) {
                avgCpm = '3€ to 5€';
            } else if (cpm < 9) {
                avgCpm = '5€ to 9€';
            } else if (cpm < 12) {
                avgCpm = '9€ to 12€';
            } else {
                avgCpm = '>12€';
            }

            let result;
            if (avgCpm === '0 to 3€') {
                result = 'Excellent';
            } else if (avgCpm === '3€ to 5€') {
                result = 'Highly Above Average';
            } else if (avgCpm === '5€ to 9€') {
                result = 'Above Average';
            } else if (avgCpm === '9€ to 12€') {
                result = 'Average';
            } else if (avgCpm === '> 12€') {
                result = 'Below Average';
            } else {
                result = 'Poor';
            }

            setCpmObj({
                cpm,
                avgCpm,
                result,
            });
        }
    }

    const totalImpressions = () => {
        if (!data?.selectInfluencers) return 0; // Проверяем, что selectInfluencers существует
        const total = data.selectInfluencers.reduce((prev, current) => {
            return prev + extractNumber(current.impressions);
        }, 0);

        return total;
    };

    const totalLikes = () => {
        if (!data?.selectInfluencers) return 0; // Проверяем, что selectInfluencers существует
        const total = data.selectInfluencers.reduce((prev, current) => {
            return prev + extractNumber(current.like);
        }, 0);

        return total;
    };

    const getStatusForInfluencer = (influencer) => {
        if (influencer.confirmation === 'refusing') return 'Denied';

        if (influencer.confirmation === 'accept') {
            if (influencer.closePromo === 'close') {
                return 'Closed';
            } else {
                if (influencer.screenshot !== '') {
                    return 'Insights Sent';
                }
                return 'Pending';
            }
        }

        return 'N/A';
    }

    const selectInfluencer = (influencer) => {
        if (fieldsForChangeVideo.selectedInstagramUsername !== influencer.instagramUsername) {
            setFieldsForChangeVideo({
                _id: data._id,
                newVideoLink: '',
                oldVideoLink: influencer.videoDetails.videoLink,
                postDescription: influencer.videoDetails.postDescription,
                storyTag: influencer.videoDetails?.storyTag,
                swipeUpLink: influencer.videoDetails?.swipeUpLink,
                influencerId: influencer.influencerId,
                selectedInstagramUsername: influencer.instagramUsername,
                videoId: influencer.videoDetails._id,
                specialWishes: influencer.videoDetails?.specialWishes,
            });

            setFieldsForChangeInfluencer({
                _id: data._id,
                instagramUsername: influencer.instagramUsername,
                datePost: influencer.datePost,
                impressions: influencer.impressions,
                like: influencer.like,
                postLink: influencer.postLink,
                screenshot: influencer.screenshot,
            });
        }
    };

    const updateCampaignVideoFieldsInput = (e) => {
        setFieldsForChangeVideo({
            ...fieldsForChangeVideo,
            [e.target.name]: e.target.value,
        });
    };

    const updateCampaignFieldsInput = (e) => {
        setFieldsForChangeCampaign({
            ...fieldsForChangeCampaign,
            [e.target.name]: e.target.value,
        });
    };

    const updateInfluencerFieldsInput = (e) => {
        setFieldsForChangeInfluencer({
            ...fieldsForChangeInfluencer,
            [e.target.name]: e.target.value,
        });
    };

    const updateCampaignVideoOnServer = async () => {
        try {
            let result;
            if (fieldsForChangeVideo.newVideoLink !== '') {
                result = await axios.put(
                    `${process.env.REACT_APP_SERVER}/admin/promos/update/video`,
                    {
                        _id: fieldsForChangeVideo._id,
                        videoId: fieldsForChangeVideo.videoId,
                        newVideoLink: fieldsForChangeVideo.newVideoLink,
                        oldVideoLink: fieldsForChangeVideo.oldVideoLink,
                        postDescription: fieldsForChangeVideo.postDescription,
                        storyTag: fieldsForChangeVideo.storyTag,
                        swipeUpLink: fieldsForChangeVideo.swipeUpLink,
                        specialWishes: fieldsForChangeVideo.specialWishes,
                    }
                );
            } else {
                result = await axios.put(
                    `${process.env.REACT_APP_SERVER}/admin/promos/update/video`,
                    {
                        _id: fieldsForChangeVideo._id,
                        videoId: fieldsForChangeVideo.videoId,
                        oldVideoLink: fieldsForChangeVideo.oldVideoLink,
                        postDescription: fieldsForChangeVideo.postDescription,
                        storyTag: fieldsForChangeVideo.storyTag,
                        swipeUpLink: fieldsForChangeVideo.swipeUpLink,
                        specialWishes: fieldsForChangeVideo.specialWishes,
                    }
                );
            }

            const res = await axios.put(
                `${process.env.REACT_APP_SERVER}/admin/promos/update/influencers-list`,
                {
                    promoId: fieldsForChangeInfluencer._id,
                    instagramUsername: fieldsForChangeInfluencer.instagramUsername,
                    datePost: fieldsForChangeInfluencer.datePost,
                    impressions: fieldsForChangeInfluencer.impressions,
                    like: fieldsForChangeInfluencer.like,
                    postLink: fieldsForChangeInfluencer.postLink,
                    screenshot: fieldsForChangeInfluencer.screenshot,
                }
            );

            await updateCampaignData(fieldsForChangeInfluencer._id);

            if (result.status === 200) {
                setFieldsForChangeVideo({
                    _id: '',
                    newVideoLink: '',
                    oldVideoLink: '',
                    postDescription: '',
                    storyTag: '',
                    swipeUpLink: '',
                    influencerId: '',
                    selectedInstagramUsername: '',
                    specialWishes: '',
                });
            }

            if (res.status === 200) {
                setFieldsForChangeInfluencer({
                    _id: '',
                    instagramUsername: '',
                    datePost: '',
                    impressions: '',
                    like: '',
                    postLink: '',
                    screenshot: '',
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateCampaignOnServer = async () => {
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/admin/promos/update`,
                {
                    _id: fieldsForChangeCampaign._id,
                    campaignName: fieldsForChangeCampaign.campaignName,
                    amount: fieldsForChangeCampaign.amount,
                }
            );

            if (result.status === 200) {
                await updateCampaignData(fieldsForChangeCampaign._id);
                setFieldsForChangeCampaign({
                    _id: '',
                    campaignName: '',
                    amount: '',
                })
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateCampaignData = async (campaignId) => {
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_SERVER}/admin/promos/getOne/${campaignId}`,
            );

            if (result.status === 200) {
                const mergedInfluencers = mergeInfluencersWithVideos(result.data.data.selectInfluencers, result.data.data.videos);
                setData({
                    ...result.data.data,
                    selectInfluencers: mergedInfluencers
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getNumOfInfluencersVideo = (influencer) => {
        if (influencer.videoDetails) {
            return data.videos.findIndex(video => video.videoLink === influencer.videoDetails.videoLink) + 1;
        }
    } 
    
    const removeInfluencer = async (instagramUsername) => {
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/admin/promos/update/remove-influencer/${data._id}/${instagramUsername}`,
            );
            
            if (result.status === 200) {
                await updateCampaignData(data._id);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <section className="admin">
            <div>
                <div>
                    <div className="admin-title-section">
                        <button onClick={() => navigate('/admin/campaigns')}>
                            <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                        </button>
                        <TitleSection title="Campaign" span="Management"/>
                    </div>
                    {data && (
                        <div ref={containerCampaignRef} onClick={() => {
                            if (fieldsForChangeCampaign.campaignName === '') {
                                setFieldsForChangeCampaign({
                                    _id: data._id,
                                    campaignName: data.campaignName,
                                    amount: data.amount,
                                });
                            }
                        }}>
                            <input
                                style={{
                                    fontFamily: "Geometria",
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    textAlign: "center",
                                    width: '100%',
                                    marginTop: 35,
                                }}
                                value={fieldsForChangeCampaign.campaignName ? fieldsForChangeCampaign.campaignName : data?.campaignName}
                                name='campaignName'
                                onChange={updateCampaignFieldsInput}
                            />

                            <div className="report-details">
                                <div className="report-details-first">
                                    <p>Date
                                        Submitted: <span>{new Date(data?.createdAt).toLocaleDateString('en-GB')}</span>
                                    </p>
                                    <p style={{display: 'flex', alignItems: 'center'}}>
                                        <span style={{marginRight: '10px', fontWeight: 400}}>Price:</span>
                                        <input
                                            style={{
                                                fontFamily: "Geometria",
                                                fontSize: '24px',
                                                fontWeight: 400,
                                                width: '100%',
                                                marginTop: 0,
                                                flex: 1,
                                                marginLeft: '-2px'
                                            }}
                                            value={fieldsForChangeCampaign.amount ? fieldsForChangeCampaign.amount : data?.amount}
                                            name='amount'
                                            onChange={updateCampaignFieldsInput}
                                        />
                                    </p>

                                    <p>Posts & Stories: <span>{data?.selectInfluencers.length}</span></p>
                                </div>
                                <div className="report-details-second">
                                    <p>Combined Followers: <span>{data?.totalFollowers}</span></p>
                                    <p>Impressions: <span>{totalImpressions()}</span></p>
                                    <p>Likes: <span>{totalLikes()}</span></p>
                                </div>
                                <div className="report-details-third">
                                    <p>CPM: <span>{cpmObj.cpm.toFixed(2)}€</span></p>
                                    <p>Average Instagram CPM: <span>5€ to 12€</span></p>
                                    <p>Result: <span>{cpmObj.result}</span></p>
                                </div>
                            </div>

                            {fieldsForChangeCampaign._id && (
                                <SubmitButton ref={saveChangesCampaignRef} onSubmit={updateCampaignOnServer}/>
                            )}
                        </div>
                    )}
                </div>

                {data ? (
                    <div>
                        <div ref={containerRef}>
                            {(fieldsForChangeVideo.selectedInstagramUsername || fieldsForChangeInfluencer.instagramUsername) && (
                                <SubmitButton ref={saveChangesRef} onSubmit={updateCampaignVideoOnServer}/>
                            )}

                            {isVideoLinkEdit && fieldsForChangeVideo.oldVideoLink && (
                                <ModalWindow isOpen={isVideoLinkEdit} setClose={() => setIsVideoLinkEdit(false)}>
                                    <div style={{padding: '20px', maxWidth: '1000px', fontFamily: 'Geometria',}}>
                                        <h1 style={{textAlign: 'center'}}>VIDEO LINK</h1>
                                        <p onClick={() => {
                                            window.open(fieldsForChangeVideo?.oldVideoLink, '_blank');
                                        }} style={{
                                            textAlign: "center",
                                            marginTop: 10,
                                            width: '100%',
                                            cursor: 'pointer',
                                        }}>{fieldsForChangeVideo?.oldVideoLink}</p>
                                        <h1 style={{textAlign: 'center', marginTop: '30px'}}>NEW VIDEO LINK</h1>
                                        <TextInput style={{marginTop: '10px'}} name='videoLink'
                                                   value={fieldsForChangeVideo.newVideoLink} setValue={(newValue) =>
                                            setFieldsForChangeVideo((prev) => ({
                                                ...prev,
                                                newVideoLink: newValue,
                                            }))
                                        }/>
                                        <StandardButton style={{
                                            margin: '0 auto',
                                            marginTop: '20px',
                                            width: '100%',
                                        }} text='Save' isBlue={true} onClick={() => {
                                            setIsVideoLinkEdit(false);
                                            updateCampaignVideoOnServer();
                                        }}/>
                                    </div>
                                </ModalWindow>
                            )}

                            {isPostLinkEdit && fieldsForChangeInfluencer.postLink && (
                                <ModalWindow isOpen={isPostLinkEdit} setClose={() => setIsPostLinkEdit(false)}>
                                    <div style={{padding: '20px', maxWidth: '1000px', fontFamily: 'Geometria',}}>
                                        <h1 style={{textAlign: 'center', marginTop: '30px'}}>NEW POST LINK</h1>
                                        <TextInput style={{marginTop: '10px'}} name='postLink'
                                                   value={fieldsForChangeInfluencer.postLink} setValue={(newValue) =>
                                            setFieldsForChangeInfluencer((prev) => ({
                                                ...prev,
                                                postLink: newValue,
                                            }))
                                        }/>
                                        <StandardButton style={{
                                            margin: '0 auto',
                                            marginTop: '20px',
                                            width: '100%',
                                        }} text='Save' isBlue={true} onClick={() => {
                                            setIsPostLinkEdit(false);
                                            updateCampaignVideoOnServer();
                                        }}/>
                                    </div>
                                </ModalWindow>
                            )}

                            {isScreenshotEdit && fieldsForChangeInfluencer.screenshot && (
                                <ModalWindow isOpen={isScreenshotEdit} setClose={() => setIsScreenshotEdit(false)}>
                                    <div style={{padding: '20px', maxWidth: '1000px', fontFamily: 'Geometria',}}>
                                        <h1 style={{textAlign: 'center', marginTop: '30px'}}>NEW SCREENSHOT LINK</h1>
                                        <TextInput style={{marginTop: '10px'}} name='screenshot'
                                                   value={fieldsForChangeInfluencer.screenshot} setValue={(newValue) =>
                                            setFieldsForChangeInfluencer((prev) => ({
                                                ...prev,
                                                screenshot: newValue,
                                            }))
                                        }/>
                                        <StandardButton style={{
                                            margin: '0 auto',
                                            marginTop: '20px',
                                            width: '100%',
                                        }} text='Save' isBlue={true} onClick={() => {
                                            setIsScreenshotEdit(false);
                                            updateCampaignVideoOnServer();
                                        }}/>
                                    </div>
                                </ModalWindow>
                            )}

                            <div className="admin-table-container" style={{width: '85%', margin: '0 auto 50px auto'}}>
                                <table className="admin-table">
                                    <thead className="admin-table-header">
                                    <tr>
                                        <th>Networks</th>
                                        <th>Total Followers</th>
                                        <th>Date Post</th>
                                        <th>Video</th>
                                        <th>Post Description</th>
                                        <th>Story Tag</th>
                                        <th>Story Link</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                        <th>Post Link</th>
                                        <th>Insights Screenshots</th>
                                        <th>Impressions</th>
                                        <th>Likes</th>
                                    </tr>
                                    </thead>
                                    <tbody className="admin-table-body">
                                    {data?.selectInfluencers.map((influencer, index) => (
                                        <tr onClick={() => selectInfluencer(influencer)}>
                                            {/*networks*/}
                                            <td className="admin-table-body-td" style={{width: 210}}>
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 700,
                                                    textAlign: 'left',
                                                }}>
                                                    {influencer?.instagramUsername}
                                                </p>
                                            </td>
                                            {/*total followers*/}
                                            <td className="admin-table-body-td"
                                                style={{width: 90, margin: 0, padding: 0}}>
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    textAlign: 'center',
                                                }}>
                                                    {influencer?.followersCount}
                                                </p>
                                            </td>
                                            {/*date post*/}
                                            <td className="admin-table-body-td"
                                                style={{width: 90, margin: 0, padding: 0}}>
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    textAlign: 'center',
                                                }}>
                                                    {influencer?.dateRequest}
                                                </p>
                                            </td>
                                            {/*video*/}
                                            <td className="admin-table-body-td"
                                                style={{width: 120, margin: 0, padding: 0}}>
                                                <div style={{display: 'flex', padding: '3px 0 3px 0'}}>
                                                    <button
                                                        onClick={() => {
                                                            window.open(influencer?.videoDetails?.videoLink, '_blank');
                                                        }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            paddingLeft: 5.1,
                                                            paddingRight: 5,
                                                            borderRadius: "10px",
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            padding: '0 5px 0 5px',
                                                            width: 70,
                                                            height: 28,
                                                            marginLeft: 8,
                                                        }}>
                                                        <img src={videoImg} alt="video"/>
                                                        <span style={{
                                                            fontWeight: 700,
                                                            fontFamily: 'Geometria',
                                                            marginBottom: 2
                                                        }}>#{getNumOfInfluencersVideo(influencer)}</span>
                                                        <img src={linkImg} alt="link"/>
                                                    </button>
                                                    <button
                                                        onClick={() => setIsVideoLinkEdit(true)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "10px",
                                                            paddingLeft: 4,
                                                            paddingRight: 3,
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            marginLeft: 8,
                                                        }}>
                                                        <img src={editImg} alt="watch"/>
                                                    </button>
                                                </div>
                                            </td>
                                            {/*post description*/}
                                            <td className="admin-table-body-td" style={{width: 250}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: '13px',
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                        padding: 0,
                                                        margin: 0,
                                                    }}
                                                    value={fieldsForChangeVideo.selectedInstagramUsername === influencer.instagramUsername ? fieldsForChangeVideo.postDescription : influencer.videoDetails?.postDescription}
                                                    name='postDescription'
                                                    onChange={updateCampaignVideoFieldsInput}
                                                />
                                            </td>
                                            {/*story tag*/}
                                            <td className="admin-table-body-td" style={{width: 150}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: '15px',
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChangeVideo.selectedInstagramUsername === influencer.instagramUsername ? fieldsForChangeVideo.storyTag : influencer.videoDetails?.storyTag}
                                                    name='storyTag'
                                                    onChange={updateCampaignVideoFieldsInput}
                                                />
                                            </td>
                                            {/*story link*/}
                                            <td className="admin-table-body-td" style={{width: 120}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: '15px',
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChangeVideo.selectedInstagramUsername === influencer.instagramUsername ? fieldsForChangeVideo.swipeUpLink : influencer.videoDetails?.swipeUpLink}
                                                    name='swipeUpLink'
                                                    onChange={updateCampaignVideoFieldsInput}
                                                />
                                            </td>
                                            {/*status*/}
                                            <td className="admin-table-body-td" style={{width: 100}}>
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    textAlign: 'left',
                                                }}>
                                                    {getStatusForInfluencer(influencer)}
                                                </p>
                                            </td>
                                            {/*actions*/}
                                            <td className="admin-table-body-td"
                                                style={{width: 120, margin: 0, padding: 0}}>
                                                <div style={{display: 'flex'}}>
                                                    <button
                                                        onClick={() => removeInfluencer(influencer.instagramUsername)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            paddingLeft: 1,
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "10px",
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            marginLeft: 8,
                                                        }}>
                                                        <img src={deleteImg} alt="deleteInfluencer"/>
                                                    </button>
                                                    <button
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "10px",
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            marginLeft: 8,
                                                        }}>
                                                        <img src={addImg} alt="addInfluencer"/>
                                                    </button>
                                                    <button
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "10px",
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            marginLeft: 8,
                                                        }}>
                                                        <img src={emailImg} alt="email"/>
                                                    </button>
                                                </div>
                                            </td>
                                            {/*post link*/}
                                            <td className="admin-table-body-td"
                                                style={{width: 105, margin: 0, padding: 0}}>
                                                {influencer.postLink ? (
                                                    <div style={{display: 'flex', padding: '5px 0 5px 0'}}>
                                                        <button
                                                            onClick={() => {
                                                                window.open(influencer.postLink, '_blank');
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 6,
                                                                paddingRight: 5,
                                                                borderRadius: "10px",
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                padding: '0 5px 0 5px',
                                                                width: 52,
                                                                height: 28,
                                                                marginLeft: 8,
                                                            }}>
                                                            <img src={instagramIcon} alt="insta"/>
                                                            <img src={linkImg} alt="link"/>
                                                        </button>
                                                        <button
                                                            onClick={() => setIsPostLinkEdit(true)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                width: 28,
                                                                height: 28,
                                                                borderRadius: "10px",
                                                                paddingLeft: 4,
                                                                paddingRight: 3,
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                marginLeft: 8,
                                                            }}>
                                                            <img src={editImg} alt="watch"/>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p style={{
                                                        fontFamily: 'Geometria',
                                                        fontSize: '16px',
                                                        fontWeight: 400,
                                                        textAlign: 'left',
                                                        marginLeft: 8,
                                                    }}>N/A</p>
                                                )}
                                            </td>
                                            {/*insights screenshots*/}
                                            <td className="admin-table-body-td"
                                                style={{width: 105, margin: 0, padding: 0}}>
                                                {influencer.postLink ? (
                                                    <div style={{display: 'flex', padding: '5px 0 5px 0'}}>
                                                        <button
                                                            onClick={() => {
                                                                window.open(influencer.screenshot, '_blank');
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 6,
                                                                paddingRight: 5,
                                                                borderRadius: "10px",
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                padding: '0 5px 0 5px',
                                                                width: 52,
                                                                height: 28,
                                                                marginLeft: 8,
                                                            }}>
                                                            <img src={imageImg} alt="image"/>
                                                            <img src={linkImg} alt="link"/>
                                                        </button>
                                                        <button
                                                            onClick={() => setIsScreenshotEdit(true)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                width: 28,
                                                                height: 28,
                                                                borderRadius: "10px",
                                                                paddingLeft: 4,
                                                                paddingRight: 3,
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                marginLeft: 8,
                                                            }}>
                                                            <img src={editImg} alt="edit"/>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p style={{
                                                        fontFamily: 'Geometria',
                                                        fontSize: '16px',
                                                        fontWeight: 400,
                                                        textAlign: 'left',
                                                        marginLeft: 8,
                                                    }}>N/A</p>
                                                )}
                                            </td>
                                            {/*impressions*/}
                                            <td className="admin-table-body-td" style={{width: 85}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: '15px',
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChangeInfluencer.instagramUsername === influencer.instagramUsername ? fieldsForChangeInfluencer.impressions : influencer.impressions}
                                                    name='impressions'
                                                    onChange={updateInfluencerFieldsInput}
                                                />
                                            </td>
                                            {/*likes*/}
                                            <td className="admin-table-body-td" style={{width: 85}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: '15px',
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChangeInfluencer.instagramUsername === influencer.instagramUsername ? fieldsForChangeInfluencer.like : influencer.like}
                                                    name='like'
                                                    onChange={updateInfluencerFieldsInput}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Loading/>
                )}
            </div>
        </section>
    );
};

export default AdminCampaignManagement;