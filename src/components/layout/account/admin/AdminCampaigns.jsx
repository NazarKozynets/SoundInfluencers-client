import React, {useEffect, useRef, useState} from "react";
import TitleSection from "../../../TitleSection";
import Loading from "../../../form/PageLoading/pageLoading";
import backBtn from "../../../../images/icons/arrow.svg";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import SearchBar from "../../../form/SearchBar/SearchBar";
import watch from "../../../../images/icons/view 1.svg";
import editImg from "../../../../images/icons/edit 1.svg";
import shareImg from "../../../../images/icons/Share.svg";
import mailImg from "../../../../images/icons/mail (1) 1.svg";

const AdminCampaigns = () => {
    const [data, setData] = useState([]);
    const [searchResult, setSearchResult] = useState();
    const [isShowModalPublicLink, setIsShowModalPublicLink] = useState(false);
    
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

    useEffect(() => {
        console.log(data);
    }, [data]);

    const getStatusOfCampaign = (campaign) => {
        if (!campaign.statusPromo) {
            return 'N/A';
        }
        
        if (campaign.statusPromo === 'finally') {
            return 'Completed';
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
                        <div className="admin-clients-searchbar">
                            <SearchBar data={data} setSearchResult={setSearchResult}/>
                        </div>

                        <div ref={containerRef}>
                            <div className="admin-table-container">
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
                                        <td>Influencers</td>
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
                                                <td className="admin-table-body-td" style={{width: 150}}>
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
                                                <td className="admin-table-body-td" style={{width: 60}}>
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
                                                <td className="admin-table-body-td" style={{width: 73}}>
                                                    <div style={{display: 'flex'}}>
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
                                                                width: 28,
                                                                height: 28,
                                                            }}>
                                                            <img style={{width: 17}} src={shareImg} alt="share"/>
                                                        </button>
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
                                                                marginLeft: 6
                                                            }}>
                                                            <img style={{width: 17}} src={mailImg} alt="mail"/>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                        value={item ? getStatusOfCampaign(item) : 'N/A'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                        value={'ASK'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                        value={'ASK'}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 90, margin: 0, padding: 0}}>
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
                                                        value={'ASK'}
                                                        readOnly={true}
                                                    />
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