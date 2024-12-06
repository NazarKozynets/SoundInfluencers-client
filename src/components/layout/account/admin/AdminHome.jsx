import React from "react";
import TitleSection from "../../../TitleSection";
import past from "../../../../images/icons/past.svg";
import {useNavigate} from "react-router-dom";
import client from "../../../../images/icons/adminPanel/homePage/client 1.svg"
import campaigns from "../../../../images/icons/adminPanel/homePage/ads 1.svg"
import invoicesClients from "../../../../images/icons/adminPanel/homePage/takeover 1.svg"
import influencer from "../../../../images/icons/adminPanel/homePage/influencer 1.svg"
import offers from "../../../../images/icons/adminPanel/homePage/best-price 1.svg"
import invoicesInfluencers from "../../../../images/icons/adminPanel/homePage/money 1.svg"
import '../../../../styles/components/_admin.scss';
import axios from "axios";

const AdminHome = () => {
    const navigate = useNavigate();
    
    return (
        <section className="admin">
            <div>
                <div className="container" style={{display: 'flex', justifyContent: "center"}}>
                    <div className="admin-block">
                        <div className="admin-title-section">
                            <TitleSection title='the mighty' span='admin panel'/>
                        </div>
                        <ul className="admin-home-menu">
                            <li className="admin-home-menu-item">
                                <button
                                    className="admin-home-menu-button"
                                    onClick={() => navigate('/admin/clients')}
                                >
                                    <img
                                        src={client}
                                        alt="account-menu-icon"
                                    />
                                    <p className="admin-home-menu-button-text">Clients</p>
                                </button>
                            </li>
                            <li className="admin-home-menu-item">
                                <button
                                    className="admin-home-menu-button"
                                    onClick={() => navigate('/admin/campaigns')}
                                >
                                    <img
                                        src={campaigns}
                                        alt="account-menu-icon"
                                    />
                                    <p className="admin-home-menu-button-text">Campaigns</p>
                                </button>
                            </li>
                            <li className="admin-home-menu-item">
                                <button
                                    className="admin-home-menu-button"
                                    onClick={() => navigate('/admin/invoices-clients')}
                                >
                                    <img
                                        src={invoicesClients}
                                        alt="account-menu-icon"
                                    />
                                    <p className="admin-home-menu-button-text">Invoices Clients</p>
                                </button>
                            </li>
                            <li className="admin-home-menu-item">
                                <button
                                    className="admin-home-menu-button"
                                    onClick={() => navigate('/admin/influencers')}
                                >
                                    <img
                                        src={influencer}
                                        alt="account-menu-icon"
                                    />
                                    <p className="admin-home-menu-button-text">Influencers</p>
                                </button>
                            </li>
                            <li className="admin-home-menu-item">
                                <button
                                    className="admin-home-menu-button"
                                    onClick={() => navigate('/admin/offers')}
                                >
                                    <img
                                        src={offers}
                                        alt="account-menu-icon"
                                    />
                                    <p className="admin-home-menu-button-text">Offers</p>
                                </button>
                            </li>
                            <li className="admin-home-menu-item">
                                <button
                                    className="admin-home-menu-button"
                                    onClick={() => navigate('/admin/invoices-influencers')}
                                >
                                    <img
                                        src={invoicesInfluencers}
                                        alt="account-menu-icon"
                                    />
                                    <p className="admin-home-menu-button-text">Invoices Influencers</p>
                                </button>
                            </li>
                        </ul>

                        <p style={{
                            fontFamily: "Geometria",
                            fontSize: 16,
                            fontWeight: 400,
                            textAlign: "center",
                            marginTop: 50
                        }}>
                            Patience!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminHome;