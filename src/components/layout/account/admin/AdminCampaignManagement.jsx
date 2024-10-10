import React from "react";
import backBtn from "../../../../images/icons/arrow.svg";
import TitleSection from "../../../TitleSection";
import {useNavigate} from "react-router-dom";

const AdminCampaignManagement = () => {
    const navigate = useNavigate();
    
    const getData = async () => {

    }
    
    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => navigate('/admin/campaigns')}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title="Campaign" span="Management"/>
                </div>
            </div>
        </section>
    );
};

export default AdminCampaignManagement;