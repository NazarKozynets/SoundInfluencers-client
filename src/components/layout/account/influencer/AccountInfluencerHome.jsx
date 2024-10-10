import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import past from "../../../../images/icons/past.svg";
import ongoing from "../../../../images/icons/ongoing.svg";
import newIcon from "../../../../images/icons/new.svg";
import invoice from "../../../../images/icons/invoice.svg";
import accountDetails from "../../../../images/icons/details-account.svg";
import support from "../../../../images/icons/support.svg";
import AltButton from "../../../form/AltButton";
import UseVerify from "../../../../hooks/useVerify";
import {Link, useNavigate, useParams} from "react-router-dom";
import ModalWindow from "../../../ModalWindow";
import StandardButton from "../../../form/StandardButton";

const AccountInfluencerHome = () => {
  const navigation = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState({
    balance: "0",
  });

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify("influencer");
      setData(dataFetch);
      window.sessionStorage.setItem("balance", dataFetch?.balance);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  
  const handleInvoice = () => {
    if(+data.balance < 1) return setIsModal(true);
    navigation("/account/influencer/create-invoice")
  }

  return (
    <section className="account-client">
      <div className="container">
        <div className="account-client-block">
          <TitleSection title="MY" span="account" />

          <div className="account-influencer-balance">
            <p className="account-influencer-balance-score">
              Balance Due:{" "}
              <span className="account-influencer-balance-score-span">
                {data.balance} €
              </span>
            </p>

            <AltButton
              text="Create an Invoice"
              style={{ padding: "9px 45px" }}
              onClick={handleInvoice}
            />
          </div>

          <ul className="account-client-menu">
            <li className="account-client-menu-item">
              <button
                className="account-client-menu-button"
                onClick={() => navigation("/account/influencer/past-promos")}
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
                onClick={() => navigation("/account/influencer/ongoing-promos")}
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
                onClick={() => navigation("/account/influencer/new-promos")}
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
                onClick={() => navigation("/account/influencer/invoices")}
              >
                <img
                  className="account-client-menu-button-icon"
                  src={invoice}
                  alt="account-menu-icon"
                />
                <p className="account-client-menu-button-text">My Invoices</p>
              </button>
            </li>
            <li className="account-client-menu-item">
              <button
                className="account-client-menu-button"
                onClick={() => navigation("/account/influencer/details")}
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

      <ModalWindow
        header="NOTICE!"
        isOpen={isModal}
        setClose={setIsModal}
      >
        <div className="account-influencer-details-form">
          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
      
            <p
              style={{
                color: "#000",
                textAlign: "center",
                fontFamily: "Geometria",
                fontSize: 18,
                fontWeight: 400,
                marginBottom: 20,
              }}
            >
              An active balance is required to generate an invoice.
            </p>
            <StandardButton
            style={{maxWidth: "150px", margin: '0 auto'}}
              text={"Ok"}
              onClick={() => {
                setIsModal(false);
              }}
            />
          </div>
        </div>
      </ModalWindow>
    </section>
  );
};

export default AccountInfluencerHome;
