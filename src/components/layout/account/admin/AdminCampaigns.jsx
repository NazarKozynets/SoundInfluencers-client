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
import SubmitButton from "./form/Influencers/SubmitFooter/SubmitButton";
import closeImg from "../../../../images/icons/close.svg";

const AdminCampaigns = () => {
    const [data, setData] = useState([]);
    const [searchResult, setSearchResult] = useState();
    const [isShowModalPublicLink, setIsShowModalPublicLink] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idForDelete, setIdForDelete] = useState('');
    const [fieldsForChange, setFieldsForChange] = useState({
        _id: '',
        userId: '',
        replacementsNotes: '',
        partialRefund: 0,
    });

    const navigate = useNavigate();

    const containerRef = useRef(null);
    const saveChangesRef = useRef(null);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                saveChangesRef.current &&
                !saveChangesRef.current.contains(event.target)
            ) {
                setFieldsForChange({
                    _id: '',
                    userId: '',
                    replacementsNotes: '',
                    partialRefund: 0,
                });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectCampaign = (campaign) => {
        if (fieldsForChange._id !== campaign._id) {
            setFieldsForChange({
                _id: campaign._id,
                userId: campaign.userId,
                replacementsNotes: campaign.replacementsNotes,
                partialRefund: campaign.partialRefund,
            });
        }
    };

    const updateCampaignFieldsInput = (e) => {
        setFieldsForChange({
            ...fieldsForChange,
            [e.target.name]: e.target.value,
        });
    };

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

    const updateCampaignOnServer = async () => {
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/admin/promos/update`,
                {
                    _id: fieldsForChange._id,
                    userId: fieldsForChange.userId,
                    replacementsNotes: fieldsForChange.replacementsNotes,
                    partialRefund: fieldsForChange.partialRefund,
                }
            );

            if (result.status === 200) {
                await updateCampaignData(fieldsForChange._id);
                setFieldsForChange({
                    _id: '',
                    userId: '',
                    replacementsNotes: '',
                    partialRefund: 0,
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
                const updatedCampaign = result.data.data;
                const updatedCampaigns = data.map((campaign) => {
                    if (campaign._id === updatedCampaign._id) {
                        return updatedCampaign;
                    }
                    return campaign;
                });
                setData(updatedCampaigns);
            }
        } catch (error) {
            console.log(error);
        }
    };

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

    const givePartialRefund = async (userId, amount, campaignId) => {
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/admin/promos/give-partial-refund/${userId}/${amount}/${campaignId}`
            );

            if (result.status === 200) {
                await updateCampaignData(campaignId);

                setFieldsForChange({
                    _id: '',
                    userId: '',
                    replacementsNotes: '',
                    partialRefund: 0,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const searchFunction = (data, searchInput) => {
        return data.filter((item) => {
            return item?.campaignName?.toLowerCase().includes(searchInput.toLowerCase());
        });
    };

    const calculateProfit = (campaign) => {
        let priceForInfluencers = 0;
        let publicPrice = 0;

        campaign.amount ? publicPrice = campaign.amount : publicPrice = campaign.selectPrice.price;

        if (campaign.selectInfluencers) {
            campaign.selectInfluencers.forEach((influencer) => {
                priceForInfluencers += influencer.price;
            });
        }

        return (publicPrice - priceForInfluencers).toLocaleString('en-US') + '€';
    }

    const deleteCampaign = async () => {
        try {
            const result = await axios.delete(
                `${process.env.REACT_APP_SERVER}/admin/promos/delete/${idForDelete}`
            );

            if (result.status === 200) {
                const updatedCampaigns = data.filter((campaign) => campaign._id !== idForDelete);
                setData(updatedCampaigns);
                setIdForDelete('');
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                        {fieldsForChange._id && (
                            <SubmitButton ref={saveChangesRef} onSubmit={updateCampaignOnServer}/>
                        )}

                        <div className="admin-clients-searchbar">
                            <SearchBar data={data} setSearchResult={setSearchResult} className="large"
                                       searchFunction={searchFunction} typeOfSearch='campaigns'/>
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

                            <div className="admin-table-container" style={{width: '90%', margin: '30px auto'}}>
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
                                        <td>Client</td>
                                        <td>Partial Refund</td>
                                    </tr>
                                    </thead>

                                    <tbody className="admin-table-body">
                                    {searchResult ? (
                                        <tr onClick={() => selectCampaign(searchResult)}>
                                            <td className="admin-table-body-td"
                                                style={{width: '15%', background: '#f0ecfc'}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 700,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={searchResult.campaignName ? searchResult.campaignName.slice(0, 25) : 'Old Campaign'}
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
                                                            navigate(`/admin/campaigns/campaign-management/${searchResult._id}`);
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
                                            <td className="admin-table-body-td"
                                                style={{width: '5.3%', background: '#f0ecfc'}}>
                                                <div style={{display: 'flex'}}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCampaignId(searchResult._id);
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
                                                        onClick={() => handleSendPublicLinkClick(searchResult)}
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
                                                    value={searchResult.totalFollowers ? searchResult.totalFollowers : 'N/A'}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-table-body-td"
                                                style={{width: '6%', margin: 0, padding: 0, background: '#f0ecfc'}}>
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
                                                    value={searchResult.amount ? searchResult.amount.toLocaleString('en-US') + '€' : searchResult.selectPrice.price.toLocaleString('en-US') + '€'}
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
                                                    value={searchResult.verifyPromo ?
                                                        (searchResult.verifyPromo === 'accept' ? 'Yes' : searchResult.verifyPromo === 'wait' ? 'Waiting' : 'No')
                                                        : 'N/A'}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-table-body-td"
                                                style={{width: '6%', margin: 0, padding: 0, background: '#f0ecfc'}}>
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
                                                    value={calculateProfit(searchResult)}
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
                                                    value={searchResult.statusPromo && (searchResult.statusPromo === 'wait' || searchResult.statusPromo === 'work' || searchResult.statusPromo === 'finally') ? 'Yes' : 'No'}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-table-body-td"
                                                style={{width: '18%', margin: 0, background: '#f0ecfc'}}>
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
                                                    value={searchResult ? getStatusOfCampaign(searchResult) : 'N/A'}
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
                                                    <p style={{margin: '0 10px'}}>{searchResult.selectInfluencers ? searchResult.selectInfluencers.length : 'N/A'}</p>
                                                    <p style={{margin: '0 10px'}}>{searchResult.selectInfluencers ? searchResult.selectInfluencers.filter((influencer) => influencer.confirmation === 'accept').length : 'N/A'}</p>
                                                    <p style={{margin: '0 10px'}}>{searchResult.selectInfluencers ? searchResult.selectInfluencers.filter((influencer) => influencer.confirmation === 'refusing').length : 'N/A'}</p>
                                                </div>

                                            </td>
                                            <td className="admin-table-body-td"
                                                style={{width: 30, background: '#f0ecfc'}}>
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
                                                    value={fieldsForChange._id === searchResult._id ? fieldsForChange.replacementsNotes : searchResult.replacementsNotes}
                                                    name='replacementsNotes'
                                                    onChange={updateCampaignFieldsInput}
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
                                                        value={fieldsForChange._id === searchResult._id ? fieldsForChange.partialRefund : searchResult.partialRefund}
                                                        name='partialRefund'
                                                        onChange={updateCampaignFieldsInput}
                                                    />
                                                    <button
                                                        onClick={() => givePartialRefund(searchResult.userId, fieldsForChange.partialRefund, searchResult._id)}
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
                                    ) : (
                                        data.map((item, index) => (
                                            <tr key={index} onClick={() => selectCampaign(item)}>
                                                <td className="admin-table-body-td"
                                                    style={{width: '15%', background: '#f0ecfc'}}>
                                                    <div style={{display: 'flex', gap: 10}}>
                                                        <img src={closeImg} alt="close"
                                                             onClick={() => {
                                                                 setIdForDelete(item._id);
                                                                 setIsDeleteModalOpen(true)
                                                             }}
                                                             style={{width: 15, cursor: 'pointer'}}/>
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
                                                    </div>
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
                                                <td className="admin-table-body-td"
                                                    style={{width: '5.3%', background: '#f0ecfc'}}>
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
                                                    style={{width: '6%', margin: 0, padding: 0, background: '#f0ecfc'}}>
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
                                                        value={item.amount ? item.amount.toLocaleString('en-US') + '€' : item.selectPrice.price.toLocaleString('en-US') + '€'}
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
                                                    style={{width: '6%', margin: 0, padding: 0, background: '#f0ecfc'}}>
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
                                                        value={calculateProfit(item)}
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
                                                    style={{width: '18%', margin: 0, background: '#f0ecfc'}}>
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
                                                    style={{width: 20, background: '#f0ecfc'}}>
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
                                                        value={fieldsForChange._id === item._id ? fieldsForChange.replacementsNotes : item.replacementsNotes}
                                                        name='replacementsNotes'
                                                        onChange={updateCampaignFieldsInput}
                                                    />
                                                </td>
                                                <td className='admin-table-body-td' style={{width: 80}}>
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
                                                        value={fieldsForChange._id === item._id ? fieldsForChange.userId : item.userId}
                                                        name='userId'
                                                        onChange={updateCampaignFieldsInput}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: '6%', background: '#f0ecfc'}}>
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
                                                            value={fieldsForChange._id === item._id ? fieldsForChange.partialRefund : item.partialRefund}
                                                            name='partialRefund'
                                                            onChange={updateCampaignFieldsInput}
                                                        />
                                                        <button
                                                            onClick={() => givePartialRefund(item.userId, fieldsForChange.partialRefund, item._id)}
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
                        {isDeleteModalOpen && (
                            <ModalWindow isOpen={isDeleteModalOpen} setClose={() => setIsDeleteModalOpen(false)}>
                                <div style={{padding: "80px 80px 0 80px"}}>
                                    <p style={{
                                        fontFamily: "Geometria",
                                        fontSize: 24,
                                        fontWeight: 800,
                                        textAlign: "center",
                                    }}>
                                        Are you sure you want to delete this campaign?
                                        <br/>
                                        <span style={{color: 'red'}}>
                                            You won't be able to restore this!
                                        </span>
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: 30,
                                        justifyContent: 'center',
                                        marginTop: 40,
                                        marginBottom: 64
                                    }}>
                                        <StandardButton text="Delete" style={{background: "red", width: 300}}
                                                        onClick={() => deleteCampaign()}/>
                                        <StandardButton text="Cancel" style={{width: 300}} isBlue={true}
                                                        onClick={() => {
                                                            setIdForDelete('');
                                                            setIsDeleteModalOpen(false)
                                                        }}/>
                                    </div>
                                </div>
                            </ModalWindow>
                        )}
                    </div>
                ) : (
                    <Loading/>
                )}

            </div>
        </section>
    );
}
export default AdminCampaigns;