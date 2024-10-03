import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import AltButton from "../../../form/AltButton";
import pdfIcon from "../../../../images/icons/pdf.svg";
import axios from "axios";
import UseVerify from "../../../../hooks/useVerify";
import { useNavigate, useParams } from "react-router-dom";


import arrow from "../../../../images/icons/arrow.svg";


function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate;
}

const AccountInfluencerInvoices = () => {
  const navigation = useNavigate();
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const result = await axios(
        `${process.env.REACT_APP_SERVER}/invoice?influencerId=${dataFetch._id}`
      );
      if (result.data.code === 200) {
        setData(result.data.invoices);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <section className="invoices">
        <div className="container" style={{position: "relative"}}>
          <TitleSection title="MY" span="account" />
          <p className="invoices-second">My Invoices</p>

          <button
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 50,
              height: 50,
              cursor: "pointer",
            }}
            onClick={() => {
              navigation("/account/influencer")
            }}
          >
            <img src={arrow} style={{ transform: "rotate(180deg)" }} />
          </button>


          <div className="invoices-block">
            {data.length !== 0 ? (
              <>
                <div className="invoices-block-header">
                  <p
                    className="invoices-block-header-title"
                    style={{ flex: 1 }}
                  >
                    Id
                  </p>
                  <p
                    className="invoices-block-header-title"
                    style={{ flex: 1.8 }}
                  >
                    Raised On
                  </p>
                  <p className="invoices-block-header-title">Payment Via</p>
                  <p
                    className="invoices-block-header-title"
                    style={{ flex: 1 }}
                  >
                    Value
                  </p>
                  <p
                    className="invoices-block-header-title"
                    style={{ flex: 2 }}
                  >
                    Status
                  </p>
                  <div style={{ flex: 2 }}></div>
                </div>
                <div className="invoices-block-content">
                  <ul className="invoices-block-content-list">
                    {data.map((item) => (
                      <li className="invoices-block-content-item">
                        <div className="invoices-block-content-item-thoomb">
                          <div className="invoices-block-content-item-mobile-flex">
                            <p className="invoices-block-content-item-id">
                              {item._id.slice(
                                item._id.length - 4,
                                item._id.length
                              )}
                            </p>
                            <p className="invoices-block-content-item-date">
                              {formatDate(item.createdAt)}
                            </p>
                            <p className="invoices-block-content-item-bank">
                               {item.bankName !== "" ? "Bank Transfer" : "Paypal"}
                            </p>
                          </div>
                          <div className="invoices-block-content-item-mobile-block">
                            <p className="invoices-block-content-item-value">
                              {item?.amount} EUR
                            </p>
                            <div className="invoices-block-content-item-status">
                              <p className="invoices-block-content-item-status-value">
                                {item?.status}
                              </p>
                            </div>
                            {/* <a
                              style={{
                                userSelect: "none",
                                pointerEvents: item.fileUrl ? "all" : "none",
                              }}
                              href={item.fileUrl ? item.fileUrl : ""}
                              className="invoices-block-content-item-document"
                            >
                              <img
                                className="invoices-block-content-item-document-icon"
                                src={pdfIcon}
                              />
                            </a> */}

                            <div className="invoices-block-content-item-message">
                              <p className="invoices-block-content-item-message-text">
                              {item?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="invoices-block-content-item-message-mobile">
                          <p className="invoices-block-content-item-message-text">
                          {item?.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div
                    style={{
                      marginTop: "29px",
                      display: data.length > 10 ? "flex" : "none",
                      justifyContent: "center",
                    }}
                  >
                    {/* <AltButton text="See more" /> */}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountInfluencerInvoices;
