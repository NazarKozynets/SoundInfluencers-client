import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import AltButton from "../../../form/AltButton";
import UseVerify from "../../../../hooks/useVerify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import arrow from "../../../../images/icons/arrow.svg";



function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  const formattedDate = `${formattedDay}.${formattedMonth}.${year}`;

  return formattedDate;
}

const AcountClientPastPromos = () => {
  const navigation = useNavigate();
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const result = await axios(
        `${process.env.REACT_APP_SERVER}/promos/history?id=${dataFetch._id}`
      );
      console.log(result.data);
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

          <p className="account-client-past-promos-second">Past promos</p>

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
              navigation("/account/client")
            }}
          >
            <img src={arrow} style={{ transform: "rotate(180deg)" }} />
          </button>

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
                        navigation(`/account/client/past-promos/${item._id}`)
                      }
                    >
                      <div className="account-client-past-promos-form-image">
                        {formatDate(item.createdAt)}
                      </div>
                      <p className="account-client-past-promos-form-text">
                        Promo {index + 1}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>

              {data.length > 20 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "45px",
                  }}
                >
                  <AltButton text="See more" />
                </div>
              )}
            </div>
          </FormContainer>
        </div>
      </div>
    </section>
  );
};

export default AcountClientPastPromos;
