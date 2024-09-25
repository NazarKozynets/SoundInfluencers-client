import React, { useState } from 'react';
import shareIcon from "../../../images/icons/Share.svg";
import './sharePromoLink.css';

const ShareComponent = ({ shareLink }) => {
    const [linkVisible, setLinkVisible] = useState(false);

    const handleShareClick = () => {
        setLinkVisible(!linkVisible);
    };

    const copyLink = () => {
        if (!shareLink) {
            console.error('No share link to copy');
            return;
        }
        navigator.clipboard.writeText(shareLink)
    };

    return (
        <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
            <button onClick={handleShareClick}>
                <img src={shareIcon} alt="share" style={{ margin: '0 auto' }} />
                <span style={{
                    fontFamily: "Geometria",
                    fontSize: "10px",
                    fontWeight: 400,
                }}>Public Share Link</span>
            </button>

            <div style={{ width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <div className="promo-link" style={{ visibility: linkVisible ? 'visible' : 'hidden', opacity: linkVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                    <button className="promo-link-button" onClick={copyLink}>Copy Link</button>
                    <span className="promo-link-span">{shareLink.slice(0, 30)}...</span>
                </div>
            </div>
        </div>
    );
};

export default ShareComponent;
