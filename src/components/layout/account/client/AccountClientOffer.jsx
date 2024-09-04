import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";


import past from "../../../../images/icons/past.svg";
import ongoing from "../../../../images/icons/ongoing.svg";
import newIcon from "../../../../images/icons/new.svg";
import invoice from "../../../../images/icons/invoice.svg";
import accountDetails from "../../../../images/icons/details-account.svg";
import support from "../../../../images/icons/support.svg";

import instagram from "../../../../images/icons/socialMedias/instagram.png";
import tiktok from "../../../../images/icons/socialMedias/tiktok.png";
import youtube from "../../../../images/icons/socialMedias/youtube.png";
import spotify from "../../../../images/icons/socialMedias/spotify.png";
import soundcloud from "../../../../images/icons/socialMedias/soundcloud.png";
import facebook from "../../../../images/icons/socialMedias/facebook.png"; 
import radio from "../../../../images/icons/socialMedias/radio.png";
import press from "../../../../images/icons/socialMedias/tablet 1.png";
import clubDJ from "../../../../images/icons/socialMedias/send (1) 1.png";

import { useNavigate } from "react-router-dom";
import ModalWindow from "../../../ModalWindow";
import StandardButton from "../../../form/StandardButton";
import acceptIcon from "../../../../images/icons/accept.svg";
import UseVerify from "../../../../hooks/useVerify";


const AccountClientOffer = () => {
  const navigation = useNavigate();
  const [isPopup, setIsPopup] = useState(false);
  const [data, setData] = useState({
    balance: "0",
  });

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify("client");
      setData(dataFetch);
      window.sessionStorage.setItem("balance", dataFetch?.balance);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
    setIsPopup(+window.sessionStorage.getItem("isPopup") === 1);
  }, []);

  return (
    <section className="account-client">
      <div className="container">
        <div className="account-client-block">
          <TitleSection title="MY" span="account" />

          <p className="account-influencer-balance-score">
              Balance:{" "}
              <span className="account-influencer-balance-score-span">
                {data?.balance} €
              </span>
            </p>


          <ul className="account-client-menu">
            <li className="account-client-menu-item">
              <button
                  className="account-client-menu-button"
                  onClick={() => navigation("/account/client/instagram-promo")}
              >
                <img width={60} height={60}
                     className="account-client-menu-button-icon"
                     src={instagram}
                     alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Instagram</p>
              </button>
            </li>
            <li className="account-client-menu-item coming-soon">
              <button
                  className="account-client-menu-button"
              >
                <img
                    width={60} height={60}
                    className="account-client-menu-button-icon"
                    src={tiktok}
                    alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Tik Tok</p>
              </button>
            </li>
            <li className="account-client-menu-item coming-soon">
              <button
                  className="account-client-menu-button"
              >
                <img
                    width={60} height={60}
                    className="account-client-menu-button-icon"
                    src={spotify}
                    alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Spotify</p>
              </button>
            </li>
            <li className="account-client-menu-item coming-soon">
              <button
                  className="account-client-menu-button"
              >
                <img
                    width={60} height={60}
                    className="account-client-menu-button-icon"
                    src={facebook}
                    alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Facebook</p>
              </button>
            </li>
            <li className="account-client-menu-item coming-soon">
              <button
                  className="account-client-menu-button"
              >
                <img
                    width={60} height={60}
                    className="account-client-menu-button-icon"
                    src={soundcloud}
                    alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Soundcloud</p>
              </button>
            </li>
            <li className="account-client-menu-item coming-soon">
              <button
                  className="account-client-menu-button"
              >
                <img
                    width={60} height={60}
                    className="account-client-menu-button-icon"
                    src={youtube}
                    alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">YouTube</p>
              </button>
            </li>
            <li className="account-client-menu-item coming-soon">
              <button
                  className="account-client-menu-button"
              >
                <img
                    width={60} height={60}
                    className="account-client-menu-button-icon"
                    src={radio}
                    alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Radio</p>
              </button>
            </li>
            <li className="account-client-menu-item coming-soon">
              <button
                  className="account-client-menu-button"
              >
                <img
                    width={60} height={60}
                    className="account-client-menu-button-icon"
                    src={press}
                    alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Press</p>
              </button>
            </li>
            <li className="account-client-menu-item coming-soon">
              <button
                  className="account-client-menu-button"
              >
                <img
                    width={60} height={60}
                    className="account-client-menu-button-icon"
                    src={clubDJ}
                    alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Club DJs</p>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <ModalWindow isOpen={isPopup} setClose={setIsPopup}>
        <div className="signup-client-modal">
          <img className="signup-client-modal-icon" src={acceptIcon}/>

          <h2 className="signup-client-modal-title">Congratulations!</h2>

          <p className="signup-client-modal-second">
            You can now check the status of your Promotion request in the{" "}
            <button
                className="signup-client-modal-second"
                style={{
                color: "#3330E4",
                textDecorationLine: "underline",
                cursor: "pointer",
              }}
              onClick={() => navigation("/account/client/ongoing-promos")}
            >
              "Ongoing Promo"
            </button>
          </p>

          <StandardButton
            text="Ok"
            style={{
              padding: "8px 80px",
              marginTop: "30px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={() => {
              window.sessionStorage.setItem("isPopup", 0);
              setIsPopup(false);
            }}
          />
        </div>
      </ModalWindow>
    </section>
  );
};

export default AccountClientOffer;
