import React, {useEffect, useState} from "react";
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

const AdminCampaignManagement = () => {
    const [data, setData] = useState();
    const [cpmObj, setCpmObj] = useState({
        cpm: 0,
        avgCpm: '',
        result: '',
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
        console.log(data, 'data');
    }, [data]);

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
                        <p style={{
                            fontFamily: "Geometria",
                            fontSize: 24,
                            fontWeight: 700,
                            textAlign: 'center',
                            marginTop: 35,
                        }}>
                            {data.campaignName ? data.campaignName : 'No Campaign Name'}
                        </p>
                    )}
                </div>

                {data ? (
                    <div>
                        <div className="report-details">
                            <div className="report-details-first">
                                <p>Date
                                    Submitted: <span>{new Date(data?.createdAt).toLocaleDateString('en-GB')}</span>
                                </p>
                                <p>Price: <span>{data?.amount}{data?.currency}</span></p>
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
                        
                        <div>
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
                                        <tr>
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
                                            <td className="admin-table-body-td" style={{width: 90, margin: 0, padding: 0}}>
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
                                            <td className="admin-table-body-td" style={{width: 90, margin: 0, padding: 0}}>
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
                                            <td className="admin-table-body-td" style={{width: 120, margin: 0, padding: 0}}>
                                                <div style={{display: 'flex', padding: '3px 0 3px 0'}}>
                                                    <button
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
                                                        <span style={{fontWeight: 700, fontFamily: 'Geometria', marginBottom: 2}}>#1</span>
                                                        <img src={linkImg} alt="link"/>
                                                    </button>
                                                    <button
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
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '13px',
                                                    fontWeight: 400,
                                                    textAlign: 'left',
                                                }}>
                                                    {influencer?.videoDetails?.postDescription.slice(0, 70)}...
                                                </p>
                                            </td>
                                            {/*story tag*/}
                                            <td className="admin-table-body-td" style={{width: 150}}>
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    textAlign: 'left',
                                                }}>
                                                    {influencer?.videoDetails?.storyTag}
                                                </p>
                                            </td>
                                            {/*story link*/}
                                            <td className="admin-table-body-td" style={{width: 120}}>
                                                <a style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    textAlign: 'left',
                                                }} href={influencer?.videoDetails?.swipeUpLink} target="_blank" rel="noopener noreferrer">
                                                    {influencer?.videoDetails?.swipeUpLink.slice(0, 13)}...
                                                </a>
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
                                            <td className="admin-table-body-td" style={{width: 120, margin: 0, padding: 0}}>
                                                <div style={{display: 'flex'}}>
                                                    <button
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
                                            <td className="admin-table-body-td" style={{width: 105, margin: 0, padding: 0}}>
                                                {influencer.postLink ? (
                                                    <div style={{display: 'flex', padding: '5px 0 5px 0'}}>
                                                        <button
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
                                            <td className="admin-table-body-td" style={{width: 105, margin: 0, padding: 0}}>
                                                {influencer.postLink ? (
                                                    <div style={{display: 'flex', padding: '5px 0 5px 0'}}>
                                                        <button
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
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    textAlign: 'left',
                                                }}>
                                                    {influencer.impressions ? influencer.impressions : 'N/A'}
                                                </p>
                                            </td>
                                            {/*likes*/}
                                            <td className="admin-table-body-td" style={{width: 85}}>
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    textAlign: 'left',
                                                }}>
                                                    {influencer.like ? influencer.like : 'N/A'}
                                                </p>
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