import React, { useEffect, useState } from "react";
import TitleSection from "../../../../TitleSection";
import CreateInvoicePayment from "./Payment";
import CreateInvoiceDetails from "./Details";
import CreateInvoiceBalances from "./Balances";
import acceptProgress from "../../../../../images/icons/accept-progress.svg";
import { useDispatch, useSelector } from "react-redux";
import { setAllFormInvoice } from "../../../../../redux/slice/create-invoice";
import axios from "axios";
import UseVerify from "../../../../../hooks/useVerify";
import StandardButton from "../../../../form/StandardButton";
import AltButton from "../../../../form/AltButton";
import { setCurrentWindow } from "../../../../../redux/slice/create-invoice";

const AccountInfluencerCreateInvoice = () => {
  const dispatch = useDispatch();
  let currentWindow = useSelector(
    (state) => state.createInvoice.currentWindow
  );

  const getSaved = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const res = await axios(
        `${process.env.REACT_APP_SERVER}/invoice/saved?influencerId=${dataFetch._id}`
      );
      if (res.data.code === 200) {
        dispatch(
          setAllFormInvoice({ ...res.data.invoice, amount: dataFetch.balance })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSaved();
  }, []);

  return (
    <section className="create-invoice">
      <div className="create-invoice-block">
        <TitleSection title="Create" span="invoice" />
        <div className="container-form">
          <div className="create-invoice-progress">
            <div className="create-invoice-progress-line">
              <div
                className={`create-invoice-progress-step ${
                  currentWindow === 0 ? "active" : ""
                }${currentWindow >= 1 ? "accept" : ""}`}
              >
                <img
                  src={acceptProgress}
                  className="create-invoice-progress-step-icon"
                />
              </div>
              <div className="create-invoice-progress-decor"></div>
              <div
                className={`create-invoice-progress-step ${
                  currentWindow === 1 ? "active" : ""
                }${currentWindow >= 2 ? "accept" : ""}`}
              >
                <img
                  src={acceptProgress}
                  className="create-invoice-progress-step-icon"
                />
              </div>
              <div className="create-invoice-progress-decor"></div>
              <div
                className={`create-invoice-progress-step ${
                  currentWindow === 2 ? "active" : ""
                }${currentWindow >= 3 ? "accept" : ""}`}
              >
                <img
                  src={acceptProgress}
                  className="create-invoice-progress-step-icon"
                />
              </div>
            </div>
            <ul className="create-invoice-progress-content">
              <li className="create-invoice-progress-content-item">
                <p className="create-invoice-progress-content-item-title">
                  Payment
                </p>
                <p className="create-invoice-progress-content-item-desc">
                  Enter payout information
                </p>
              </li>
              <li className="create-invoice-progress-content-item">
                <p className="create-invoice-progress-content-item-title">
                  Invoice details
                </p>
                <p className="create-invoice-progress-content-item-desc">
                  Enter invoice details
                </p>
              </li>
              <li className="create-invoice-progress-content-item">
                <p className="create-invoice-progress-content-item-title">
                  Balances
                </p>
                <p className="create-invoice-progress-content-item-desc">
                  Select balance to invoice for
                </p>
              </li>
            </ul>
          </div>
        </div>

        <>
          {
            [
              <CreateInvoicePayment />,
              <CreateInvoiceDetails />,
              <CreateInvoiceBalances />,
            ][currentWindow]
          }
        </>

        <div
          style={{
            display: currentWindow === 0 ? "none" : "flex",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <AltButton text="Back Step" onClick={() => dispatch(setCurrentWindow(--currentWindow))} />
        </div>
      </div>
    </section>
  );
};

export default AccountInfluencerCreateInvoice;
