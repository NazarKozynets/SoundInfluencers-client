import React from "react";
import TitleSection from "../../../TitleSection";
import Loading from "../../../form/PageLoading/pageLoading";
import backBtn from "../../../../images/icons/arrow.svg";
import {useNavigate} from "react-router-dom";

const AdminOffers = () => {
    const navigate = useNavigate();

    return (
        <section className="admin-title-section">
            <div>
                <button onClick={() => navigate('/admin/home')}>
                    <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                </button>
                <TitleSection span="Soon"/>
                <Loading/>
            </div>
        </section>
    );
}

export default AdminOffers;