import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import past from "../../../../images/icons/past.svg";
import ongoing from "../../../../images/icons/ongoing.svg";
import newIcon from "../../../../images/icons/new.svg";
import invoice from "../../../../images/icons/invoice.svg";
import accountDetails from "../../../../images/icons/details-account.svg";
import support from "../../../../images/icons/support.svg";
import { useNavigate } from "react-router-dom";
import ModalWindow from "../../../ModalWindow";
import StandardButton from "../../../form/StandardButton";
import acceptIcon from "../../../../images/icons/accept.svg";
import UseVerify from "../../../../hooks/useVerify";


const AccountClientHome = () => {
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
      <div className="container" style={{display: 'flex', justifyContent: "center"}}>
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
                onClick={() => navigation("/account/client/past-promos")}
              >
                <img
                  className="account-client-menu-button-icon"
                  src={past}
                  alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">Past Promos</p>
              </button>
            </li>
            <li className="account-client-menu-item">
              <button
                className="account-client-menu-button"
                onClick={() => navigation("/account/client/ongoing-promos")}
              >
                <img
                  className="account-client-menu-button-icon"
                  src={ongoing}
                  alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">
                  Ongoing Promos
                </p>
              </button>
            </li>
            <li className="account-client-menu-item">
              <button
                className="account-client-menu-button"
                onClick={() => navigation("/account/client/list-promo")}
              >
                <img
                  className="account-client-menu-button-icon"
                  src={newIcon}
                  alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">New Promos</p>
              </button>
            </li>
            <li className="account-client-menu-item">
              <button
                className="account-client-menu-button"
                onClick={() => navigation("/account/client/invoice-details")}
              >
                <img
                  className="account-client-menu-button-icon"
                  src={invoice}
                  alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">
                  My Invoice Details
                </p>
              </button>
            </li>
            <li className="account-client-menu-item">
              <button
                className="account-client-menu-button"
                onClick={() => navigation("/account/client/details")}
              >
                <img
                  className="account-client-menu-button-icon"
                  src={accountDetails}
                  alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">
                  My Account Details
                </p>
              </button>
            </li>
            <li className="account-client-menu-item">
              <a
                href="mailto:admin@soundinfluencers.com?subject=Support%20Request"
                className="account-client-menu-button"
              >
                <img
                  className="account-client-menu-button-icon"
                  src={support}
                  alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">
                  Contact Support
                </p>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <ModalWindow isOpen={isPopup} setClose={setIsPopup}>
        <div className="signup-client-modal">
          <img className="signup-client-modal-icon" src={acceptIcon} />

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

export default AccountClientHome;
