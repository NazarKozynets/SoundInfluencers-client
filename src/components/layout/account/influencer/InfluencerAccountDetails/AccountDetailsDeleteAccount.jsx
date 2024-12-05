import React, {useState} from 'react';
import ModalWindow from "../../../../ModalWindow";
import TextInput from "../../../../form/TextInput";
import TextArea from "../../../../form/TextArea";
import StandardButton from "../../../../form/StandardButton";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const AccountDetailsDeleteAccount = ({isOpen, setClose, _id, accountId, typeOfSocialMedia}) => {
    const [errors, setErrors] = useState({
        incorrectDeleteText: false
    });
    const [deleteText, setDeleteText] = useState('');
    const [deleteReason, setDeleteReason] = useState('');
    
    const navigate = useNavigate();
    
    const deleteAccount = async () => {
        if (deleteText.trim() !== 'delete brand account') {
            setErrors({
                ...errors,
                incorrectDeleteText: true
            });
            return;
        } else {
            setErrors({
                ...errors,
                incorrectDeleteText: false
            });
        }
        
        try {
            const result = await axios.patch(`${process.env.REACT_APP_SERVER}/profile/influencer/delete-social-media-account`, {
                _id: _id,
                accountId: accountId,
                deleteReason: deleteReason,
                typeOfSocialMedia: typeOfSocialMedia
            })
            
            if (result.data.code === 200) {
                navigate(`/account/influencer/details`);
            }
        } catch (err) {
            console.log(err);
        }
    };
    
    return (
        <ModalWindow isOpen={isOpen} setClose={setClose}>
            <div className="delete-account-modal-window">
                <div className="title-section">
                    <p>
                        ARE YOU SURE YOU WANT TO
                        <span>
                            DELETE THIS BRAND?
                        </span>
                    </p>
                </div>
                <div className="warning-section">
                    <p>
                        WARNING
                    </p>
                    <span>
                        This is permanent and will cause any campaigns using this account to be paused
                    </span>
                </div>
                <div className="inputs-section">
                    <TextInput
                        style={{
                            marginTop: 60
                        }}
                        title="Type “delete brand account”"
                        placeholder="Type “delete brand account”"
                        silverColor={true}
                        value={deleteText}
                        onChange={(e) => setDeleteText(e.target.value)}
                        error={errors.incorrectDeleteText}
                    />
                    <TextArea
                        style={{
                            marginTop: 60
                        }}
                        title="Tell us why are you leaving"
                        placeholder="Tell us why are you leaving"
                        silverColor={true}
                        value={deleteReason}
                        setValue={setDeleteReason}
                    />
                </div>
                <div className="buttons-section">
                    <StandardButton text="Delete" style={{width: 210, height: 40}} isRed={true} onClick={() => deleteAccount()}/>
                    <StandardButton text="Cancel" style={{width: 210, height: 40}} isBlue={true} onClick={setClose}/>
                </div>
            </div>
        </ModalWindow>
    );
};

export default AccountDetailsDeleteAccount;