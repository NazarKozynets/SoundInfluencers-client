import React, {useEffect, useRef, useState} from "react";
import TitleSection from "../../../TitleSection";
import backBtn from "../../../../images/icons/arrow.svg";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import PageLoading from "../../../form/PageLoading/pageLoading";
import OffersSearch from "../../../form/Offers/OffersSearchBar/OffersSearch";
import logoIcon from "../../../../images/icons/rkqZiVo 69.svg";
import StandardButton from "../../../form/StandardButton";
import {formatDateStringReport} from "../../../../utils/validations";

const AdminClients = () => {
    const [data, setData] = useState([]);
    const [searchResult, setSearchResult] = useState(null);
    const [fieldsForChange, setFieldsForChange] = useState({
        _id: '',
        firstName: '',
        email: '',
        phone: '',
        company: '',
        companyType: '',
        balance: '',
        internalNote: '',
    });
    const navigate = useNavigate();
    
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const saveChangesRef = useRef(null);
    
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const result = await axios(
            `${process.env.REACT_APP_SERVER}/admin/client/getAll`
        );
        if (result.status === 200) {
            setData(result.data.data);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setFieldsForChange({
                    _id: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    company: '',
                    companyType: '',
                    balance: '',
                    internalNote: '',
                });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const updateClientOnServer = async () => {
        const result = await axios.put(
            `${process.env.REACT_APP_SERVER}/admin/client/update`,
            {
                id: fieldsForChange._id,
                firstName: fieldsForChange.firstName,
                email: fieldsForChange.email,
                phone: fieldsForChange.phone,
                company: fieldsForChange.company,
                companyType: fieldsForChange.companyType,
                balance: fieldsForChange.balance,
                internalNote: fieldsForChange.internalNote,
            }
        );

        if (result.status === 200) {
            await updateClientData(fieldsForChange._id);
            setFieldsForChange({
                _id: '',
                firstName: '',
                email: '',
                phone: '',
                company: '',
                companyType: '',
                balance: '',
                internalNote: '',
            });
        }
    }

    const selectClient = (client) => {
        if (fieldsForChange._id !== client._id) {
            setFieldsForChange({
                _id: client._id,
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email,
                phone: client.phone,
                company: client.company,
                companyType: client.companyType,
                balance: client.balance,
                internalNote: client.internalNote,
            });
        }
    }

    const updateClientFieldsInput = (e) => {
        setFieldsForChange({
            ...fieldsForChange,
            [e.target.name]: e.target.value,
        });
    }

    const updateClientData = async (id) => {
        const result = await axios.get(
            `${process.env.REACT_APP_SERVER}/auth/client/${id}`
        );
        if (result.status === 200) {
            const updatedClient = result.data.client;
            const updatedClients = data.map((client) => {
                if (client._id === updatedClient._id) {
                    return updatedClient;
                } else {
                    return client;
                }
            });
            setData(updatedClients);
        }
    }

    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => navigate('/admin/home')}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title='Clients'/>
                </div>

                {data.length > 0 ? (
                    <div>
                        <div className="admin-clients-searchbar">
                            <OffersSearch
                                filteredInfluencers={data}
                                setSearchResult={setSearchResult}
                            />
                        </div>

                        <div ref={containerRef}>
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead className="admin-table-header">
                                    <tr>
                                        <td></td>
                                        <td>Company</td>
                                        <td>First Name</td>
                                        <td>Email</td>
                                        <td>Phone</td>
                                        <td>Company Type</td>
                                        <td>Balance</td>
                                        <td>Campaigns Completed</td>
                                        <td>Campaigns Denied</td>
                                        <td>Campaigns Ongoing</td>
                                        <td>Latest Campaign</td>
                                        <td>Internal Note</td>
                                    </tr>
                                    </thead>
                                    <tbody className="admin-table-body">
                                    {searchResult ? (
                                        <tr onClick={() => selectClient(searchResult)}>
                                            <td className="admin-table-body-td" style={{
                                                paddingLeft: 0,
                                                background: '#f0ecfc'
                                            }}>
                                                <img style={{margin: '0 auto'}} src={logoIcon} alt="logo"/>
                                            </td>
                                            <td className="admin-table-body-td" style={{background: '#f0ecfc'}}>
                                                <input
                                                    ref={inputRef}
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        textAlign: 'left',
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResult._id ? fieldsForChange.company : (searchResult.company ? searchResult.company : 'N/A')}
                                                    name="company"
                                                    onChange={(e) => updateClientFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResult._id ? fieldsForChange.firstName : (searchResult.firstName ? searchResult.firstName : 'N/A')}
                                                    name="firstName"
                                                    onChange={(e) => updateClientFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                paddingRight: 6,
                                                background: '#f0ecfc'
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResult._id ? fieldsForChange.email : (searchResult.email ? searchResult.email : 'N/A')}
                                                    name="email"
                                                    onChange={(e) => updateClientFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResult._id ? fieldsForChange.phone : (searchResult.phone ? searchResult.phone : 'N/A')}
                                                    name="phone"
                                                    onChange={(e) => updateClientFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                background: '#f0ecfc'
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResult._id ? fieldsForChange.companyType : (searchResult.companyType ? searchResult.companyType : 'N/A')}
                                                    name="companyType"
                                                    onChange={(e) => updateClientFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "center",
                                                paddingLeft: 0,
                                                width: '5%'
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0 auto'
                                                    }}
                                                    value={fieldsForChange._id === searchResult._id ? fieldsForChange.balance : (searchResult.balance ? searchResult.balance : 'N/A')}
                                                    name="balance"
                                                    onChange={(e) => updateClientFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "center",
                                                paddingLeft: 0,
                                                background: '#f0ecfc'
                                            }}>{searchResult.campaignsCompleted && searchResult.campaignsCompleted}
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "center",
                                                paddingLeft: 0
                                            }}>{searchResult.campaignsDenied && searchResult.campaignsDenied}
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "center",
                                                paddingLeft: 0,
                                                background: '#f0ecfc'
                                            }}>{searchResult.campaignsOngoing && searchResult.campaignsOngoing}
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "center",
                                                paddingLeft: 0
                                            }}>{searchResult.latestCampaign ? formatDateStringReport(searchResult.latestCampaign.createdAt) : 'N/A'}
                                            </td>
                                            <td className="admin-table-body-td" style={{
                                                fontFamily: "Geometria",
                                                fontSize: 12,
                                                fontWeight: 400,
                                                textAlign: "left",
                                                background: '#f0ecfc'
                                            }}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResult._id ? fieldsForChange.internalNote : (searchResult.internalNote ? searchResult.internalNote : '...')}
                                                    name="internalNote"
                                                    onChange={(e) => updateClientFieldsInput(e)}
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((client, index) => (
                                            <tr key={index} onClick={() => selectClient(client)}>
                                                <td className="admin-table-body-td" style={{
                                                    paddingLeft: 0,
                                                    background: '#f0ecfc'
                                                }}>
                                                    <img style={{margin: '0 auto'}} src={logoIcon} alt="logo"/>
                                                </td>
                                                <td className="admin-table-body-td" style={{background: '#f0ecfc'}}>
                                                    <input
                                                        ref={inputRef}
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: 700,
                                                            textAlign: 'left',
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === client._id ? fieldsForChange.company : (client.company ? client.company : 'N/A')}
                                                        name="company"
                                                        onChange={(e) => updateClientFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "left",
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === client._id ? fieldsForChange.firstName : (client.firstName ? client.firstName : 'N/A')}
                                                        name="firstName"
                                                        onChange={(e) => updateClientFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "left",
                                                    paddingRight: 6,
                                                    background: '#f0ecfc'
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === client._id ? fieldsForChange.email : (client.email ? client.email : 'N/A')}
                                                        name="email"
                                                        onChange={(e) => updateClientFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "left",
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === client._id ? fieldsForChange.phone : (client.phone ? client.phone : 'N/A')}
                                                        name="phone"
                                                        onChange={(e) => updateClientFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "left",
                                                    background: '#f0ecfc'
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === client._id ? fieldsForChange.companyType : (client.companyType ? client.companyType : 'N/A')}
                                                        name="companyType"
                                                        onChange={(e) => updateClientFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    paddingLeft: 0,
                                                    width: '5%'
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: '0 auto'
                                                        }}
                                                        value={fieldsForChange._id === client._id ? fieldsForChange.balance : (client.balance ? client.balance : 'N/A')}
                                                        name="balance"
                                                        onChange={(e) => updateClientFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    paddingLeft: 0,
                                                    background: '#f0ecfc'
                                                }}>{client.campaignsCompleted && client.campaignsCompleted}
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    paddingLeft: 0
                                                }}>{client.campaignsDenied && client.campaignsDenied}
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    paddingLeft: 0,
                                                    background: '#f0ecfc'
                                                }}>{client.campaignsOngoing && client.campaignsOngoing}
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    paddingLeft: 0
                                                }}>{client.latestCampaign ? formatDateStringReport(client.latestCampaign.createdAt) : 'N/A'}
                                                </td>
                                                <td className="admin-table-body-td" style={{
                                                    fontFamily: "Geometria",
                                                    fontSize: 12,
                                                    fontWeight: 400,
                                                    textAlign: "left",
                                                    background: '#f0ecfc'
                                                }}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === client._id ? fieldsForChange.internalNote : (client.internalNote ? client.internalNote : '...')}
                                                        name="internalNote"
                                                        onChange={(e) => updateClientFieldsInput(e)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                    {fieldsForChange._id && (
                                        <tfoot>
                                        <tr>
                                            <td colSpan="12">
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    padding: '10px 0 10px 0'
                                                }}>
                                                    <StandardButton ref={saveChangesRef} onClick={() => updateClientOnServer()}
                                                                    text={'Save Changes'}/>
                                                </div>
                                            </td>
                                        </tr>
                                        </tfoot>

                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{margin: '0 auto'}}>
                        <PageLoading/>
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminClients;
