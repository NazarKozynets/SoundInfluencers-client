import React, {useEffect, useState} from "react";
import vectorImg from "../../../../../../images/vector.png";
import {extractNumber} from "../../../../../../utils/validations";
import SearchBar from "../../../../../form/SearchBar/SearchBar";
import checkImg from "../../../../../../images/vector.png"; 

const AdminEditOfferTable = ({influencers, selectedInfluencers, setSelectedInfluencers}) => {
    const [searchResult, setSearchResult] = useState(null);

    const getInfluencerAvatar = (influencers, username) => {
        const insta = influencers?.find(insta => insta?.instagramUsername === username);
        return insta ? insta.logo : null;
    };

    const calculatePricePerFollower = (price, followers) => {
        const numericPrice = parseFloat(price?.replace(/[^0-9.]/g, ''));
        if (followers === 0 || isNaN(numericPrice)) return 0;
        return (numericPrice / followers).toFixed(6);
    };

    const searchByUsername = (data, searchInput) => {
        return data.filter(influencer =>
            influencer.instagramUsername && influencer.instagramUsername.toLowerCase().includes(searchInput.toLowerCase())
        );
    };

    const searchById = (data, searchInput) => {
        return data.filter(influencer =>
            influencer._id && influencer._id.toLowerCase().includes(searchInput.toLowerCase())
        );
    };

    const getTotalFollowers = () => {
        if (selectedInfluencers.length === 0) return 0;

        if (selectedInfluencers[0].followers) {
            return selectedInfluencers.reduce((acc, influencer) => {
                return acc + extractNumber(influencer.followersNumber);
            }, 0); 
        } else {
            let tempArr = influencers.filter(influencer => selectedInfluencers.some(selected => selected.instagramUsername === influencer.instagramUsername));
            
            return tempArr.reduce((acc, influencer) => {
                return acc + extractNumber(influencer.followersNumber);
            }, 0);
        }
    };

    const getTotalPublicPrice = () => {
        if (selectedInfluencers.length === 0) return 0;

        if (selectedInfluencers[0].publicPrice) {
            return selectedInfluencers.reduce((acc, influencer) => {
                return acc + parseFloat(influencer.publicPrice);
            }, 0);
        } else {
            let tempArr = influencers.filter(influencer => selectedInfluencers.some(selected => selected.instagramUsername === influencer.instagramUsername));
            
            return tempArr.reduce((acc, influencer) => {
                return acc + parseFloat(influencer.publicPrice);
            }, 0);
        }
    };

    const getTotalInternalPrice = () => {
        if (selectedInfluencers.length === 0) return 0;
        
        if (selectedInfluencers[0].price) {
            return selectedInfluencers.reduce((acc, influencer) => {
                return acc + parseFloat(influencer?.price?.replace(/\D/g, ''));
            }, 0);
        } else {
            let tempArr = influencers.filter(influencer => selectedInfluencers.some(selected => selected.instagramUsername === influencer.instagramUsername));
            
            return tempArr.reduce((acc, influencer) => {
                return acc + parseFloat(influencer?.price?.replace(/\D/g, ''));
            }, 0);
        }
    };

    const handleCheckboxChange = (influencer) => {
        if (isChecked(influencer)) {
            setSelectedInfluencers(selectedInfluencers.filter(selected => selected.instagramUsername !== influencer.instagramUsername));
        } else {
            setSelectedInfluencers([...selectedInfluencers, influencer]);
        }
    };

    const isChecked = (influencer) => {
        return selectedInfluencers.some(selected => selected.instagramUsername === influencer.instagramUsername);
    };

    return (
        <div className='admin-offer-edit-table-container' style={{marginBottom: 40}}>
            <table className="admin-table">
                <thead className="admin-table-header">
                <tr>
                    <th style={{width: '5%'}}>
                        <img id='imgChooseHeader' src={vectorImg} alt='choose'/>
                    </th>
                    <th style={{width: '33%'}}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                            paddingBottom: 10
                        }}>
                            <span>Networks</span>
                            <SearchBar setSearchResult={setSearchResult} className='small-medium' data={influencers}
                                       searchFunction={searchByUsername} typeOfSearch='influencers'/>
                        </div>
                    </th>
                    <th style={{width: '10%'}}>Total Followers</th>
                    <th style={{width: '10%'}}>
                        Price Public
                    </th>
                    <th style={{width: '10%'}}>
                        Price Internal
                    </th>
                    <th style={{width: '10%'}}>
                        Price per Follower
                    </th>
                    <th style={{width: '25%'}}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                            paddingBottom: 10
                        }}>
                            <span>ID</span>
                            <SearchBar data={influencers} setSearchResult={setSearchResult}
                                       searchFunction={searchById} className="small" typeOfSearch="influencers"/>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody className='admin-table-body'>
                {searchResult ? (
                    <tr>
                        {/* Checkboxes */}
                        <td className="admin-table-body-td" style={{margin: 0, padding: 0}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                            }}>
                                <input
                                    type="checkbox"
                                    checked={isChecked(searchResult)}
                                    onChange={() => handleCheckboxChange(searchResult)}
                                    style={{display: 'none'}}
                                    id={`checkbox-${searchResult._id}`}
                                />
                                <label
                                    htmlFor={`checkbox-${searchResult._id}`}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 20,
                                        height: 20,
                                        border: '1px solid blue',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        backgroundColor: isChecked(searchResult) ? 'blue' : 'transparent',
                                    }}
                                >
                                    {isChecked(searchResult) && (
                                        <img
                                            src={checkImg}
                                            alt="checked"
                                            style={{
                                                width: '13px',
                                                height: '13px',
                                            }}
                                        />
                                    )}
                                </label>
                            </div>
                        </td>
                        {/* Networks */}
                        <td className="admin-table-body-td"
                            style={{
                                margin: 0,
                                padding: 0,
                                background: isChecked(searchResult) ? '#c8c4f4' : '#f0ecfc',
                                borderBottom: '1px solid #9494f4',
                            }}>
                            <div style={{display: 'flex'}}>
                                <div style={{background: isChecked(searchResult) ? '#c8c4f4' : '#f0ecfc', width: 45}}>
                                    <img style={{width: 34, margin: '0 auto'}}
                                         src={getInfluencerAvatar(influencers, searchResult.instagramUsername)}
                                         alt=''/>
                                </div>
                                <p style={{
                                    fontFamily: 'Geometria',
                                    fontSize: 16,
                                    fontWeight: 700,
                                    textAlign: 'left',
                                    alignItems: 'center',
                                    display: 'flex',
                                    paddingLeft: 10
                                }}>{searchResult.instagramUsername}</p>
                            </div>
                        </td>

                        {/* Total Followers */}
                        <td className="admin-table-body-td" style={{margin: 0, padding: 0}}>
                            <p style={{
                                fontFamily: 'Geometria',
                                fontSize: 16,
                                fontWeight: 400,
                                textAlign: 'center',
                            }}>
                                {searchResult.followersNumber}
                            </p>
                        </td>
                        {/* Price Public */}
                        <td className="admin-table-body-td" style={{margin: 0, padding: 0, background: '#f0ecfc'}}>
                            <p style={{
                                fontFamily: 'Geometria',
                                fontSize: 16,
                                fontWeight: 400,
                                textAlign: 'center',
                            }}>
                                {searchResult.publicPrice}
                            </p>
                        </td>
                        {/* Price Internal */}
                        <td className="admin-table-body-td" style={{margin: 0, padding: 0}}>
                            <p style={{
                                fontFamily: 'Geometria',
                                fontSize: 16,
                                fontWeight: 400,
                                textAlign: 'center',
                            }}>
                                {searchResult?.price?.replace(/\D/g, '')}
                            </p>
                        </td>
                        {/* Price per Follower */}
                        <td className="admin-table-body-td"
                            style={{margin: 0, padding: 0, background: '#f0ecfc'}}>
                            <p style={{
                                fontFamily: 'Geometria',
                                fontSize: 16,
                                fontWeight: 400,
                                textAlign: 'center',
                            }}>
                                {calculatePricePerFollower(searchResult.price, extractNumber(searchResult.followersNumber))}
                            </p>
                        </td>
                        {/* ID */}
                        <td className="admin-table-body-td" style={{margin: 0, padding: 0}}>
                            <p style={{
                                fontFamily: 'Geometria',
                                fontSize: 16,
                                fontWeight: 400,
                                textAlign: 'center',
                            }}>
                                {searchResult?._id?.slice(0, 25)}...
                            </p>
                        </td>
                    </tr>

                ) : (influencers?.map((influencer, index) => (
                        <tr>
                            {/* Checkboxes */}
                            <td className="admin-table-body-td" style={{margin: 0, padding: 0}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={isChecked(influencer)}
                                        onChange={() => handleCheckboxChange(influencer)}
                                        style={{display: 'none'}}
                                        id={`checkbox-${index}`}
                                    />
                                    <label
                                        htmlFor={`checkbox-${index}`}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 20,
                                            height: 20,
                                            border: '1px solid blue',
                                            borderRadius: 6,
                                            cursor: 'pointer',
                                            position: 'relative',
                                            backgroundColor: isChecked(influencer) ? 'blue' : 'transparent',
                                        }}
                                    >
                                        {isChecked(influencer) && (
                                            <img
                                                src={checkImg}
                                                alt="checked"
                                                style={{
                                                    width: '13px',
                                                    height: '13px',
                                                }}
                                            />
                                        )}
                                    </label>
                                </div>
                            </td>
                            {/* Networks */}
                            <td className="admin-table-body-td"
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    background: isChecked(influencer) ? '#c8c4f4' : '#f0ecfc', 
                                    borderBottom: '1px solid #9494f4',
                                }}>
                                <div style={{display: 'flex'}}>
                                    <div style={{background: isChecked(influencer) ? '#c8c4f4' : '#f0ecfc', width: 45}}>
                                        <img style={{width: 34, margin: '0 auto'}}
                                             src={getInfluencerAvatar(influencers, influencer.instagramUsername)}
                                             alt=''/>
                                    </div>
                                    <p style={{
                                        fontFamily: 'Geometria',
                                        fontSize: 16,
                                        fontWeight: 700,
                                        textAlign: 'left',
                                        alignItems: 'center',
                                        display: 'flex',
                                        paddingLeft: 10
                                    }}>{influencer.instagramUsername}</p>
                                </div>
                            </td>

                            {/* Total Followers */}
                            <td className="admin-table-body-td" style={{margin: 0, padding: 0}}>
                                <p style={{
                                    fontFamily: 'Geometria',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    textAlign: 'center',
                                }}>
                                    {influencer.followersNumber}
                                </p>
                            </td>
                            {/* Price Public */}
                            <td className="admin-table-body-td" style={{margin: 0, padding: 0, background: '#f0ecfc'}}>
                                <p style={{
                                    fontFamily: 'Geometria',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    textAlign: 'center',
                                }}>
                                    {influencer.publicPrice}
                                </p>
                            </td>
                            {/* Price Internal */}
                            <td className="admin-table-body-td" style={{margin: 0, padding: 0}}>
                                <p style={{
                                    fontFamily: 'Geometria',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    textAlign: 'center',
                                }}>
                                    {influencer?.price?.replace(/\D/g, '')}
                                </p>
                            </td>
                            {/* Price per Follower */}
                            <td className="admin-table-body-td"
                                style={{margin: 0, padding: 0, background: '#f0ecfc'}}>
                                <p style={{
                                    fontFamily: 'Geometria',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    textAlign: 'center',
                                }}>
                                    {calculatePricePerFollower(influencer.price, extractNumber(influencer.followersNumber))}
                                </p>
                            </td>
                            {/* ID */}
                            <td className="admin-table-body-td" style={{margin: 0, padding: 0}}>
                                <p style={{
                                    fontFamily: 'Geometria',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    textAlign: 'center',
                                }}>
                                    {influencer?._id?.slice(0, 25)}...
                                </p>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
                <tfoot className='admi-table-footer'>
                <tr style={{height: 71}}>
                    <td style={{background: '#ff5c04'}}></td>
                    <td style={{background: '#ff5c04'}}>
                        <p style={{
                            fontFamily: 'Geometria',
                            fontSize: 16,
                            fontWeight: 800,
                            textAlign: 'center',
                        }}>
                             {selectedInfluencers.length} NETWORKS 
                        </p>
                    </td>
                    <td style={{background: '#ffbc84'}}>
                        <p style={{
                            fontFamily: 'Geometria',
                            fontSize: 16,
                            fontWeight: 700,
                            textAlign: 'center',
                        }}>
                         {getTotalFollowers()} 
                        </p>
                    </td>
                    <td style={{background: '#f0ac84'}}>
                        <p style={{
                            fontFamily: 'Geometria',
                            fontSize: 16,
                            fontWeight: 700,
                            textAlign: 'center',
                        }}>
                             {getTotalPublicPrice()}€ 
                        </p>
                    </td>
                    <td style={{background: '#ffbc84'}}>
                        <p style={{
                            fontFamily: 'Geometria',
                            fontSize: 16,
                            fontWeight: 700,
                            textAlign: 'center',
                        }}>
                             {getTotalInternalPrice()}€ 
                        </p>
                    </td>
                    <td style={{background: '#f0ac84'}}></td>
                    <td style={{background: '#ffbc84'}}></td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default AdminEditOfferTable;
