import React, {useEffect, useState} from "react";
import editImg from "../../../../../../images/icons/edit 1.svg";
import deleteImg from "../../../../../../images/icons/adminPanel/campaignManagement/close 8.svg";
import copyImg from "../../../../../../images/icons/adminPanel/offers/duplicate 1.svg";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteOfferCompletely,
    setCurrentWindow,
    setIsNew, setNewOffer,
    setNewOffers
} from "../../../../../../redux/slice/admin-offers";
import {generateMongoObjectId} from "../../../../../../utils/generateId";

const AdminOffer = ({key, offer, influencers, selectedOffersGenres}) => {
    const dispatch = useDispatch();

    const getInfluencerAvatar = (influencers, username) => {
        const insta = influencers?.find(insta => insta?.instagramUsername === username);
        return insta ? insta.logo : null;
    };

    const addOfferToDeletedCompletely = () => {
        dispatch(deleteOfferCompletely(offer));
    }

    const duplicateOffer = () => {
        dispatch(setNewOffers({
            ...offer,
            _id: generateMongoObjectId(),
            isNew: true,
        }));
    }

    return (
        offer.influencersForOffer && (
            <div className="admin-container-offer">
                <div className="admin-container-offer-buttons">
                    <button onClick={() => {
                        dispatch(setIsNew(false));
                        dispatch(setCurrentWindow(1));
                        dispatch(setNewOffer(offer));
                    }}>
                        <img src={editImg} alt={'edit'}/>
                    </button>
                    <button onClick={() => addOfferToDeletedCompletely()}>
                        <img src={deleteImg} alt={'delete'}/>
                    </button>
                    <button onClick={() => duplicateOffer()}>
                        <img style={{width: 18}} src={copyImg} alt={'copy'}/>
                    </button>
                </div>
                <div className="admin-offer">
                    <div className="admin-offer-body">
                        <h3>IG {offer?.id}M</h3>
                        <p>{offer?.story}</p>
                        <p>{offer?.network}</p>
                        <p>{offer?.followers}</p>

                        <div className="admin-offer-body-influencers">
                            {offer?.influencersForOffer.map((influencer, index) => {
                                const avatarUrl = getInfluencerAvatar(influencers, influencer?.instagramUsername);

                                return (
                                    <div key={index} className="admin-offer-body-influencer">
                                        <img src={avatarUrl} alt=''/>
                                        <p>{influencer?.instagramUsername}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="admin-offer-footer">
                        <h3>{offer.priceForOffer} €</h3>
                    </div>
                </div>
            </div>
        )

    )
}

export default AdminOffer;