import React, { useEffect, useState } from "react";
import TitleSection from "../../../../TitleSection";
import choose1 from "../../../../../images/gentleman.png";
import instagram from "../../../../../images/icons/instagram.svg";
import axios from "axios";
import StandardButton from "../../../../form/StandardButton";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentWindow,
  setSelectAmount,
  setSelectInfluencer,
  setSelectPrice,
} from "../../../../../redux/slice/create-promo";
import ImageWithFallback from "../../../../ImageWithFallback";
import altLogo from "../../../../../images/alt-logo.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";

import { useNavigate } from "react-router-dom";


import arrow from "../../../../../images/icons/arrow.svg";


const AccountClientOffers = () => {
  const navigation = useNavigate();
  const [prices, setPrices] = useState([]);
  const dispatch = useDispatch();
  const [influencers, setInfluencers] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false)

  const currentPrice = useSelector(
    (state) => state.createPromo.data.selectPrice.variant
  );

  const dataForm = useSelector(
    (state) => state.createPromo.data
  );

  const customAmount = useSelector(
    (state) => state.createPromo.data.selectPrice.amount
  );

  const customePrice = useSelector(
    (state) => state.createPromo.data.selectPrice.price
  );

  const selectInfluencers = useSelector(
    (state) => state.createPromo.data.selectInfluencers
  );

  const selectPrice = (id) => {
    let balance = window.sessionStorage.getItem("balance");

    const searchPrice = prices.find((item) => item.id === id);

    const updateList = influencers.map((item, index) => {
      if (
        searchPrice.connectInfluencer.find(
          (fin) =>
            fin.influencerId === item._id &&
            fin.instagramUsername === item.instagramUsername
        )
      ) {
        return {
          ...item,
          active: true,
          connect: true,
          connect_text: `Offer ${searchPrice.id}`,
        };
      } else {
        if (item.active && item.connect) {
          return {
            ...item,
            active: false,
            connect: false,
          };
        }
        return {
          ...item,
        };
      }
    });

    const filterInfluencers = searchPrice.connectInfluencer.map((item) => ({
      influencerId: item.influencerId,
      confirmation: "wait",
      instagramUsername: item.instagramUsername,
    }));

    if (selectInfluencers.length !== 0) {
      const currentSelectInfluencers = selectInfluencers.map((item) => ({
        influencerId: item.influencerId,
        confirmation: "wait",
        instagramUsername: item.instagramUsername,
      }));
      const filterCurrentSelectInfluencer = [];
      const mass = [...filterInfluencers].forEach((item) => {
        const checkUnion = filterCurrentSelectInfluencer.find(
          (fin) => fin.instagramUsername === item.instagramUsername
        );

        if (!checkUnion) {
          filterCurrentSelectInfluencer.push(item);
        }
      });
      dispatch(setSelectInfluencer(filterCurrentSelectInfluencer));
    } else {
      dispatch(setSelectInfluencer(filterInfluencers));
    }
    setInfluencers(updateList);

    if (currentPrice === id) {
      const checkInfluencers = influencers.map((item) => {
        if (item.connect) {
          return {
            ...item,
            connect: false,
            active: false,
          };
        } else {
          return {
            ...item,
          };
        }
      });

      setInfluencers(checkInfluencers);

      const currentSelectInfluencers = influencers.filter(
        (item) => !item.connect && item.active
      );

      const totalSelectInfluencers = currentSelectInfluencers.map((item) => ({
        influencerId: item._id,
        confirmation: "wait",
        instagramUsername: item.instagramUsername,
      }));
      dispatch(setSelectInfluencer(totalSelectInfluencers));
      let newPrice = influencers.reduce((acc, current) => {
        if (!current.price) return acc;
        let price = current.price.replace(/\D/g, "");

        if(current.customPrice){
          price = current.customPrice;
        }

        if (current.active) {
          if (!current.connect) {
            return acc + Number(price) * 2;
          } else {
            return acc;
          }
        } else {
          return acc;
        }
      }, 0);

      dispatch(
        setSelectPrice({
          variant: 0,
          price: 0 + newPrice
        })
      );
      return;
    }

    if (customePrice !== 0) {
      const newPrice = influencers.reduce((acc, current) => {
        if (!current.price) return acc;
        let price = current.price.replace(/\D/g, "");

        if(current.customPrice){
          price = current.customPrice;
        }


        const checkConnect = (() => {
          const searchPrice = prices.find((item) => item.id === id);
          if (!searchPrice) return false;
          return searchPrice.connectInfluencer.find(
            (item) =>
              item.influencerId === current._id &&
              item.instagramUsername === current.instagramUsername
          );
        })();

        if (checkConnect) return acc;

        if (current.active) {
          if (!current.connect) {
            return acc + Number(price) * 2;
          } else {
            return acc;
          }
        } else {
          return acc;
        }
      }, 0);

      const priceOffer = prices.find((item) => item.id === id);

      dispatch(
        setSelectPrice({
          variant: id,
          price: priceOffer.price + newPrice,
        })
      );
      return;
    }

    let newPrice = influencers.reduce((acc, current) => {
      if (!current.price) return acc;
      let price = current.price.replace(/\D/g, "");

      if(current.customPrice){
        price = current.customPrice;
      }

      if (current.active) {
        if (!current.connect) {
          if (currentPrice !== 0) {
            return acc + Number(price) * 2;
          } else {
            return acc + Number(price) * 2;
          }
        } else {
          return acc;
        }
      } else {
        return acc;
      }
    }, 0);

    const priceOffer = prices.find((item) => item.id === currentPrice);
    let totalOffer = prices.find((item) => item.id === id).price;
    let totalCustomOffer = priceOffer?.price + newPrice;

    dispatch(
      setSelectAmount(priceOffer ? totalCustomOffer : 0 + newPrice)
    );

    dispatch(
      setSelectAmount(totalOffer)
    );

    if (totalCustomOffer > balance)
      totalCustomOffer = totalCustomOffer - balance;
    if (newPrice > balance) newPrice = newPrice - balance;
    if (totalOffer > balance) totalOffer = totalOffer - balance;

    dispatch(
      setSelectPrice({
        variant: id,
        price: priceOffer ? totalCustomOffer : 0 + newPrice,
      })
    );

    dispatch(
      setSelectPrice({
        variant: id,
        price: totalOffer,
      })
    );
  };

  const selectInfluencer = (instagramUsername) => {
    console.log("ok2");
    // dispatch(
    //   setSelectPrice({
    //     variant: 0,
    //     price: 0,
    //   })
    // );
    let balance = window.sessionStorage.getItem("balance");

    const updateList = influencers.map((item) => {
      if (item.instagramUsername === instagramUsername) {
        if (item.active) {
          return {
            ...item,
            active: false,
            connect: false,
          };
        }
        return {
          ...item,
          active: true,
          connect: false,
        };
      }

      return item;
    });

    let newPrice = updateList.reduce((acc, current) => {
      if (!current.price) return acc;
      let price = current.price.replace(/\D/g, "");

      if(current.customPrice){
        price = current.customPrice;
      }

      if (current.active) {
        if (!current.connect) {
          if (currentPrice !== 0) {
            return acc + Number(price) * 2;
          } else {
            return acc + Number(price) * 2;
          }
        } else {
          return acc;
        }
      } else {
        return acc;
      }
    }, 0);

    const priceOffer = prices.find((item) => item.id === currentPrice);

    const filterInfluencers = updateList
      .filter((item) => item.active)
      .map((item) => ({
        influencerId: item._id,
        instagramUsername: item.instagramUsername,
        confirmation: "wait",
      }));

    let totalCustomOffer = priceOffer?.price + newPrice;

    dispatch(
      setSelectAmount(priceOffer ? totalCustomOffer : 0 + newPrice)
    );

    if (totalCustomOffer > balance)
      totalCustomOffer = totalCustomOffer - balance;
    if (newPrice > balance) newPrice = newPrice - balance;

    dispatch(
      setSelectPrice({
        variant: currentPrice,
        price: priceOffer ? totalCustomOffer : 0 + newPrice,
      })
    );

    dispatch(setSelectInfluencer([...filterInfluencers]));
    setInfluencers(updateList);
  };

  const getData = async () => {
    const result = await axios(
      `${process.env.REACT_APP_SERVER}/auth/influencers`
    );

    const offers = await axios(`${process.env.REACT_APP_SERVER}/promos/offers`);

    if (offers.data.code === 200) {
      setPrices(offers.data.offers.sort((a,b)=> a.id - a.b));
    }
    if (result.data.code === 200) {
      if (selectInfluencers.length !== 0) {
        const list = result.data.influencers.map((item) => {
          const findInfluencer = selectInfluencers.find(
            (inf) =>
              inf.influencerId === item._id &&
              inf.instagramUsername === item.instagramUsername
          );
          if (findInfluencer) {
            return {
              ...item,
              active: true,
              connect: false,
            };
          }

          return {
            ...item,
            active: false,
            connect: false,
          };
        });
        return setInfluencers(list);
      }
      const listInfluencers = result.data.influencers.map((item) => ({
        ...item,
        active: false,
        connect: false,
      })).sort((a, b) => {
        // Assign a high order value for items without the order field
        const orderA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
      
        return orderA - orderB;
      });
      
      setInfluencers(listInfluencers);
    }
  };

  const nextForm = () => {
    if (customePrice === 0 || selectInfluencers.length === 0) return;
    console.log(dataForm, "1 dataForm");    
    dispatch(setCurrentWindow(1));
  };

  const createInfList = (score) => {
    const list = [];
    let sum = 0;
    while (sum <= score) {
      sum += 1;
      if (sum > score) break;
      list.push(
        <li key={sum} className="account-client-offers-text-item">
          Influencer {sum}
        </li>
      );
    }
    return list;
  };



  const toggleSelectAll = () => {
    let balance = window.sessionStorage.getItem("balance");

    const updateList = influencers.map((item) => {
        return {
          ...item,
          active: !isSelectAll,
          connect: false,
        };
    });

    let newPrice = updateList.reduce((acc, current) => {
      if (!current.price) return acc;
      let price = current.price.replace(/\D/g, "");

      if(current.customPrice){
        price = current.customPrice;
      }

      if (current.active) {
        if (!current.connect) {
          if (currentPrice !== 0) {
            return acc + Number(price) * 2;
          } else {
            return acc + Number(price) * 2;
          }
        } else {
          return acc;
        }
      } else {
        return acc;
      }
    }, 0);

    const priceOffer = prices.find((item) => item.id === currentPrice);

    const filterInfluencers = updateList
      .filter((item) => item.active)
      .map((item) => ({
        influencerId: item._id,
        instagramUsername: item.instagramUsername,
        confirmation: "wait",
      }));

    let totalCustomOffer = priceOffer?.price + newPrice;

    dispatch(
      setSelectAmount(priceOffer ? totalCustomOffer : 0 + newPrice)
    );

    if (totalCustomOffer > balance)
      totalCustomOffer = totalCustomOffer - balance;
    if (newPrice > balance) newPrice = newPrice - balance;

    dispatch(
      setSelectPrice({
        variant: currentPrice,
        price: priceOffer ? totalCustomOffer : 0 + newPrice,
      })
    );

    dispatch(setSelectInfluencer([...filterInfluencers]));
    setInfluencers(updateList);
    setIsSelectAll(!isSelectAll)
  };


  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="account-client">
      {/* <div className="container"> */}
      <div className="account-client-block" style={{ position: "relative" }}>
        <h1 className="account-client-title">service offered</h1>
        <h2 className="account-client-second">influencers post for clients</h2>

        <TitleSection title="Our" span="offers" />

        <button
          style={{
            position: "absolute",
            top: 0,
            left: 50,
            width: 50,
            height: 50,
            cursor: "pointer",
          }}
          onClick={() => {
            navigation("/account/client/list-promo");
          }}
        >
          <img src={arrow} style={{ transform: "rotate(180deg)" }} />
        </button>

        {/* <ul className="account-client-offers"> */}
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
          navigation
          pagination={{
            enabled: true,
            bulletElement: "button",
            clickable: true,
          }}
          breakpoints={{
            340: {
              slidesPerView: 1,
            },
            550: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1400: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          style={{ padding: "30px 20px 180px 20px" }}
        >
          {prices.map((item, index) => (
            <SwiperSlide key={item.id}>
              <li
                key={item.id}
                className={`account-client-offers-item ${
                  currentPrice !== 0
                    ? currentPrice === item.id
                      ? ""
                      : "not-active"
                    : ""
                }`}
                onClick={() => selectPrice(item.id)}
              >
                <h3 className="account-client-offers-title">IG {item.id}M</h3>
                <p className="account-client-offers-text">{item.story}</p>
                <p className="account-client-offers-text">{item.network}</p>
                <p className="account-client-offers-text"> {item.followers}</p>
                <div className="account-client-offers-block">
                  <ul className="account-client-offers-text-list">
                    {item.connectInfluencer.map((item, index) => (
                      <li
                        key={index}
                        className="account-client-offers-text-item"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {item.avatar ? (
                          <img
                            style={{ maxWidth: "40px" }}
                            src={item.avatar}
                            alt={item.instagramUsername}
                          />
                        ) : null}

                        {item.instagramUsername}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="account-client-offers-button">
                  {item.price} €
                </button>
              </li>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* </ul> */}

        <TitleSection title="Pick &" span="choose" />
        <div className="select-all">
          <StandardButton
            text={isSelectAll ? "Unselect All" : "Select All"}
            onClick={toggleSelectAll}
          />
        </div>

        <div className="account-client-choose">
          <ul className="account-client-choose-list">
            {influencers.map((item, index) => (
              <li
                key={index}
                className={`account-client-choose-item ${
                  item.connect ? "connect" : item.active ? "active" : ""
                }`}
                onClick={({ target }) => {
                  if (item.connect) return;
                  selectInfluencer(item.instagramUsername);
                }}
              >
                {item.connect ? (
                  <div className="account-client-choose-item-connect">
                    <p className="account-client-choose-item-connect-text">
                      {item.connect_text}
                    </p>
                  </div>
                ) : (
                  <></>
                )}

                <div className="account-client-choose-item-content" style={{}}>
                  <ImageWithFallback
                    src={item.logo}
                    fallbackSrc={altLogo}
                    className="account-client-choose-item-image"
                    style={{ maxWidth: 50 }}
                  />
                  <p className="account-client-choose-item-content-text">
                    {item.instagramUsername}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  <span>
                    <img
                      className="account-client-choose-item-content-icon"
                      src={instagram}
                      style={{ paddingBottom: 3, pointerEvents: "none" }}
                    />
                  </span>
                  <p
                    className="account-client-choose-item-content-text"
                    style={{ textAlign: "center", paddingBottom: 0 }}
                  >
                    {item.followersNumber}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* <div className="account-client-choose-all-block">
              <button className="account-client-choose-all">See more</button>
            </div> */}

          <p className="account-client-choose-total">
            Total{" "}
            <span className="account-client-choose-total-span">
              {customePrice} €
            </span>
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <StandardButton text="Continue" onClick={nextForm} />
          </div>
        </div>
      </div>
      {/* </div> */}
    </section>
  );
};

export default AccountClientOffers;
