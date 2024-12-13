import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import FormContainer from "../../../../form/FormContainer";
import {getSocialMediaIcon} from "../../../../../utils/typeOfSocialAccounts";
import StandardButton from "../../../../form/StandardButton";
import CheckBox from "../../../../form/CheckBox";
import {useNavigate} from "react-router-dom";
import {setInfluencerApprovedAccountsClear} from "../../../../../redux/slice/influencer-approved-accounts";

const ApprovedAccounts = () => {
    const [isChecked, setIsChecked] = useState(false);
    
    const approvedAccounts = useSelector(state => state.influencerApprovedAccounts.influencerApprovedAccounts);

    const navigate =  useNavigate();
    const dispatch = useDispatch();
    
    const returnPrice = (socialMedia, price) => {
        switch (socialMedia.toLowerCase()) {
            case 'spotify':
                return `${price}€ EACH FEEDBACK+`
            case 'soundcloud':
                return `${price}€ EACH REPOST`
            case 'youtube':
                return `${price}€ EACH POST`
            case 'press':
                return `${price}€ EACH ARTICLE`
            default:
                return `${price}€ EACH POST + STORY`
        }
    };

    const calculateTotalPrice = () => {
        let total = 0;
        approvedAccounts.forEach(account => {
            const price = parseInt(account.account.price.replace(/[^\d]/g, ''), 10);
            total += price;
        });
        return total;
    };

    const handleYesButton = () => {
        if (!isChecked) {
            return;
        }

        dispatch(setInfluencerApprovedAccountsClear());
        navigate('/account/influencer');
    }
    
    return (
        <>
            <section className="account-influencer-new-approved-accounts">
                <div className="title-block">
                    <p>CONGRATULATIONS</p>
                    <span>YOUR BRANDS HAVE BEEN APPROVED</span>
                </div>


                <FormContainer style={{margin: '47px auto 80px', width: window.innerWidth > 900 ? '40%' : '80%', padding: '46px 101px'}}>
                    <div className="form-title">
                        <p>YOU'LL RECEIVE</p>
                    </div>

                    <div className="accounts-list-block">
                        {approvedAccounts.map((account, index) => (
                            <div key={index} className="account-item">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div className="account-item-img">
                                        <img src={getSocialMediaIcon(account.network)} alt="img"/>
                                    </div>
                                    <div className="account-item-username">
                                        <p>{account.account.instagramUsername}</p>
                                    </div>
                                </div>
                                <div className="account-item-price">
                                    <p>{returnPrice(account.network, account.account.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="form-total-price">
                        <p>THIS COULD MAKE YOU A TOTAL OF <span>{calculateTotalPrice()}€</span></p>
                    </div>
                    
                    <div className="form-buttons">
                        <div className="form-button">
                            <StandardButton text="Yes" onClick={() => handleYesButton()}/>
                            <p>Add Brands to Account</p>
                        </div>
                        
                        <div className="form-button">
                            <StandardButton text="No"/>
                            <p>Contact Us</p>
                        </div>
                    </div>
                    
                    <div className="form-checkbox">
                        <CheckBox text="Agree to" linkText="terms and conditions" setChecked={setIsChecked} checked={isChecked} page="influencer"/>
                    </div>
                </FormContainer>
            </section>
        </>
    );
};

export default ApprovedAccounts;