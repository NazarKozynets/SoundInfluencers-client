import React, {useEffect, useState} from "react";
import backBtn from "../../../../images/icons/arrow.svg";
import TitleSection from "../../../TitleSection";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Loading from "../../../form/PageLoading/pageLoading";
import {extractNumber} from "../../../../utils/validations";

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
                setData(result.data.data);
            }
        } catch (err) {
            console.log(err);
        }
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
                    {data ? (
                        <p style={{
                            fontFamily: "Geometria",
                            fontSize: 24,
                            fontWeight: 700,
                            textAlign: 'center',
                            marginTop: 35,
                        }}>
                            {data.campaignName ? data.campaignName : 'No Campaign Name'}
                        </p>
                    ) : (<Loading/>)}
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
                            <div className="admin-table-container">
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
                                            <td className="admin-table-body-td">
                                                <p style={{
                                                    fontFamily: 'Geometria',
                                                    fontSize: '16px',
                                                    fontWeight: 700,
                                                    textAlign: 'left',

                                                }}>
                                                    {influencer.instagramUsername}
                                                </p>
                                            </td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
                                            <td className="admin-table-body-td">s</td>
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