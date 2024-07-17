import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import AltButton from "../../../form/AltButton";
import UseVerify from "../../../../hooks/useVerify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import arrow from "../../../../images/icons/arrow.svg";



const AccountInfluencerPastPromos = () => {
  const navigation = useNavigate();
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const result = await axios(
        `${process.env.REACT_APP_SERVER}/promos/history-influencer?id=${dataFetch._id}`
      );
      if (result.data.code === 200) {
        setData(result.data.promos);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="account-client-past-promos">
      <div className="container-form">
        <div className="account-client-past-promos-block" style={{position: "relative"}}>
          <TitleSection title="MY" span="account" />

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


          <p className="account-client-past-promos-second">Past promos</p>

          <FormContainer
            style={{
              marginTop: "70px",
              display: data.length !== 0 ? "block" : "none",
            }}
          >
            <div className="account-client-past-promos-form">
              <ul className="account-client-past-promos-form-list">
                {data.map((item, index) => (
                  <li
                    className="account-client-past-promos-form-item"
                    key={item._id}
                  >
                    <button
                      className="account-client-past-promos-form-item-button"
                      onClick={() =>
                        navigation(
                          `/account/influencer/past-promos/${item._id}`
                        )
                      }
                    >
                      <div className="account-client-past-promos-form-image">
                        {item.client.substring(0, 8)}
                      </div>
                      <p className="account-client-past-promos-form-text">
                        Promo {index + 1}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>

              {/* {data.length > 20 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "45px",
                  }}
                >
                  <AltButton text="See more" />
                </div>
              )} */}
            </div>
          </FormContainer>
        </div>
      </div>
    </section>
  );
};

export default AccountInfluencerPastPromos;
