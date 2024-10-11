import React, {useEffect, useRef, useState} from "react";
import TitleSection from "../../../TitleSection";
import Loading from "../../../form/PageLoading/pageLoading";
import backBtn from "../../../../images/icons/arrow.svg";
import {Await, useNavigate} from "react-router-dom";
import axios from "axios";
import SearchBar from "../../../form/SearchBar/SearchBar";
import watch from "../../../../images/icons/view 1.svg";
import editImg from "../../../../images/icons/edit 1.svg";
import shareImg from "../../../../images/icons/Share.svg";
import mailImg from "../../../../images/icons/mail (1) 1.svg";
import refundImg from "../../../../images/icons/refund 1.svg";
import ModalWindow from "../../../ModalWindow";
import StandardButton from "../../../form/StandardButton";

const AdminCampaigns = () => {
    const [data, setData] = useState([]);
    const [searchResult, setSearchResult] = useState();
    const [isShowModalPublicLink, setIsShowModalPublicLink] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    
    const navigate = useNavigate();

    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const saveChangesRef = useRef(null);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const result = await axios(
                `${process.env.REACT_APP_SERVER}/admin/promos/getAll`
            );
            if (result.status === 200) {
                setData(result.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getStatusOfCampaign = (campaign) => {
        if (!campaign.statusPromo) {
            return 'N/A';
        }

        if (campaign.statusPromo === 'finally') {
            return 'Completed';
        }

        if (campaign.verifyPromo === 'cancel') {
            return 'Campaign Canceled';
        }

        if (campaign.verifyPromo === 'wait') {
            return 'Campaign Waiting For Agreement';
        }

        const influencersResponses = campaign.selectInfluencers.map((influencer) => influencer.confirmation);
        const influencersIsPromoClosed = campaign.selectInfluencers.map((influencer) => influencer.closePromo);

        if (campaign.verifyPromo === 'accept') {
            if (influencersResponses.includes('refusing')) {
                const numOfRefuses = influencersResponses.filter((response) => response === 'refusing').length;
                return `${numOfRefuses} refuses`;
            }

            if (influencersResponses.includes('wait')) {
                return 'Awaiting Confirmation';
            }
        }

        if (campaign.statusPromo === 'work') {
            return 'Awaiting Content';
        }
    }

    const createShareLink = (campaignId) => {
        try {
            let promoId;
            
            if (!campaignId) {
                promoId = selectedCampaignId;
            } else {
                promoId = campaignId;
            }
            
            if (!promoId) {
                console.error('promoId is not set');
                return '';
            }
            return `https://go.soundinfluencers.com/promo-share/${promoId}`;
        } catch (err) {
            console.log(err);
            return '';
        }
    };

    const handleSendPublicLinkClick = (campaign) => {
        const userId = campaign.userId;
        const campaignId = campaign._id;

        const publicLink = createShareLink(campaignId);
        
        sendPublicLink(userId, publicLink);  
    };
    
    const sendPublicLink = async (userId, publicLink) => {
        try {
            const encodedPublicLink = encodeURIComponent(publicLink);
            
            const result = await axios.post(
                `${process.env.REACT_APP_SERVER}/admin/promos/send-public-link/${userId}/${encodedPublicLink}`
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => navigate('/admin/home')}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title="Campaigns"/>
                </div>

                {data.length > 0 ? (
                    <div>
                        <div className="admin-clients-searchbar">
                            <SearchBar data={data} setSearchResult={setSearchResult}/>
                        </div>

                        <div ref={containerRef}>
                            {isShowModalPublicLink && (
                                <ModalWindow isOpen={isShowModalPublicLink} setClose={() => {
                                    setSelectedCampaignId('');
                                    setIsShowModalPublicLink(false);
                                }}>
                                    <div style={{padding: '20px', maxWidth: '1000px', fontFamily: 'Geometria',}}>
                                        <h1 style={{textAlign: 'center'}}>PUBLIC LINK</h1>
                                        <p style={{
                                            textAlign: "center",
                                            marginTop: 10,
                                            width: '100%'
                                        }}>{createShareLink()}</p>
                                        <StandardButton style={{
                                            margin: '0 auto',
                                            marginTop: '20px',
                                            width: '100%',
                                        }} text='Copy Link' isBlue={true} onClick={() => {
                                            navigator.clipboard.writeText(createShareLink())
                                                .then(() => {
                                                })
                                                .catch(err => {
                                                    console.error('Failed to copy the link: ', err);
                                                });
                                        }}/>
                                    </div>
                                </ModalWindow>
                            )}

                            <div className="admin-table-container" style={{width: '85%', margin: '30px auto'}}>
                                <table className="admin-table">
                                    <thead className="admin-table-header">
                                    <tr>
                                        <td>Campaigns</td>
                                        <td>Edit</td>
                                        <td>Share Report</td>
                                        <td>Size</td>
                                        <td>Price</td>
                                        <td>Agreed</td>
                                        <td>Profit</td>
                                        <td>Paid</td>
                                        <td>Status</td>
                                        <td style={{width: '7%'}}>
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                Influencers
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    padding: 0,
                                                    margin: 0
                                                }}>
                                                    <p style={{width: 40, textAlign: 'center'}}>Tot</p>
                                                    <p style={{width: 40, textAlign: 'center'}}>App</p>
                                                    <p style={{width: 40, textAlign: 'center'}}>Den</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Replacements</td>
                                        <td>Partial Refund</td>
                                    </tr>
                                    </thead>

                                    <tbody className="admin-table-body">
                                    {searchResult ? (
                                        <tr>
                                            <p>sadsa</p>
                                        </tr>
                                    ) : (
                                        data.map((item, index) => (
                                            <tr key={index}>
                                                <td className="admin-table-body-td" style={{width: '15%'}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 700,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={item.campaignName ? item.campaignName.slice(0, 25) : 'Old Campaign'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{width: '5%'}}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        padding: '3px 0 3px 0',
                                                        gap: '8px',
                                                        marginLeft: -6,
                                                    }}>
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/admin/campaigns/campaign-management/${item._id}`);
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
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                margin: 0
                                                            }}>
                                                            <img src={watch} alt="watch"/>
                                                            <img src={editImg} alt="watch"/>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="admin-table-body-td" style={{width: '5.3%'}}>
                                                    <div style={{display: 'flex'}}>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCampaignId(item._id);
                                                                setIsShowModalPublicLink(true);
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
                                                                width: 28,
                                                                height: 28,
                                                            }}>
                                                            <img style={{width: 17}} src={shareImg} alt="share"/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleSendPublicLinkClick(item)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 5,
                                                                paddingRight: 5,
                                                                borderRadius: "10px",
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                marginLeft: 6
                                                            }}>
                                                            <img style={{width: 17}} src={mailImg} alt="mail"/>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: '6%', margin: 0, padding: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: 0,
                                                            padding: 0
                                                        }}
                                                        value={item.totalFollowers ? item.totalFollowers : 'N/A'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: '6%', margin: 0, padding: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: 0,
                                                            padding: 0
                                                        }}
                                                        value={item.selectPrice.price ? item.selectPrice.price.toLocaleString('en-US') + '€' : 'N/A'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: '5%', margin: 0, padding: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: 0,
                                                            padding: 0
                                                        }}
                                                        value={item.verifyPromo ?
                                                            (item.verifyPromo === 'accept' ? 'Yes' : item.verifyPromo === 'wait' ? 'Waiting' : 'No')
                                                            : 'N/A'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: '6%', margin: 0, padding: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: 0,
                                                            padding: 0
                                                        }}
                                                        value={'Do this after public price logic'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: '5%', margin: 0, padding: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: 0,
                                                            padding: 0
                                                        }}
                                                        value={item.statusPromo && (item.statusPromo === 'wait' || item.statusPromo === 'work' || item.statusPromo === 'finally') ? 'Yes' : 'No'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: '18%', margin: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                            margin: 0,
                                                            padding: 0
                                                        }}
                                                        value={item ? getStatusOfCampaign(item) : 'N/A'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{margin: 0, padding: 0}}>
                                                    <div style={{
                                                        display: 'flex',
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        justifyContent: 'space-between',
                                                        margin: 0,
                                                        padding: 0
                                                    }}>
                                                        <p style={{margin: '0 10px'}}>{item.selectInfluencers ? item.selectInfluencers.length : 'N/A'}</p>
                                                        <p style={{margin: '0 10px'}}>{item.selectInfluencers ? item.selectInfluencers.filter((influencer) => influencer.confirmation === 'accept').length : 'N/A'}</p>
                                                        <p style={{margin: '0 10px'}}>{item.selectInfluencers ? item.selectInfluencers.filter((influencer) => influencer.confirmation === 'refusing').length : 'N/A'}</p>
                                                    </div>

                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 30}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                            margin: 0,
                                                            padding: 0
                                                        }}
                                                        value={item.replacementsNotes ? item.replacementsNotes : ''}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 30}}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0,
                                                        textAlign: 'center'
                                                    }}>
                                                        <input
                                                            style={{
                                                                fontFamily: "Geometria",
                                                                fontSize: 15,
                                                                fontWeight: 400,
                                                                textAlign: "left",
                                                                width: '50%',
                                                                margin: 0,
                                                                padding: 0,
                                                                height: '28px',
                                                                lineHeight: '28px',
                                                                boxSizing: 'border-box',
                                                            }}
                                                            value={item.partialRefund ? item.partialRefund : '0'}
                                                            readOnly={true}
                                                        />
                                                        <button
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 5,
                                                                paddingRight: 5,
                                                                borderRadius: "10px",
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                marginRight: 15,
                                                                marginLeft: 0,
                                                                width: 28,
                                                                height: 28,
                                                            }}>
                                                            <img src={refundImg} alt="refund"/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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
}
export default AdminCampaigns;