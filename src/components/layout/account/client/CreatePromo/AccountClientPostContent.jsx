import React, { useState } from "react";
import TitleSection from "../../../../TitleSection";
import FormContainer from "../../../../form/FormContainer";
import TextInput from "../../../../form/TextInput";
import TextArea from "../../../../form/TextArea";
import StandardButton from "../../../../form/StandardButton";
import UseVerify from "../../../../../hooks/useVerify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setClearForm,
  setCurrentWindow,
  setDateRequest,
  setPostDescription,
  setSpecialWishes,
  setStoryTag,
  setSwipeUpLink,
  setVideoLink,
} from "../../../../../redux/slice/create-promo";
import {
  formatDateString,
  validateDate,
} from "../../../../../utils/validations";
import arrow from "../../../../../images/icons/arrow.svg";

const AccountClientPostContent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const dataPromo = useSelector((state) => state.createPromo.data);

  const [formError, setFormError] = useState({
    videoLink: false,
    postDescription: false,
    storyTag: false,
    swipeUpLink: false,
    dateRequest: false,
    specialWishes: false,
  });

  const nextForm = () => {
    let listError = {
      videoLink: false,
      postDescription: false,
      storyTag: false,
      swipeUpLink: false,
      dateRequest: false,
      specialWishes: false,
    };

    let haveError = false;
    for (let checkError in dataPromo) {
      if (
        checkError !== "selectPrice" &&
        checkError !== "selectInfluencers" &&
        checkError !== "paymentType" &&
        checkError !== "paymentStatus"
      ) {
        if (dataPromo[checkError] === "") {
          haveError = true;
          listError = {
            ...listError,
            [checkError]: true,
          };
        }
      }
    }

    if (!dataPromo.dateRequest) {
      haveError = true;
      setFormError({ ...listError, dateRequest: true });
      return;
    }

    if (haveError) {
      setFormError(listError);
      return;
    }

    dispatch(setCurrentWindow(2));
  };

  return (
    <section className="account-client">
      <div className="container-form">
        <div className="account-client-block" style={{ position: "relative" }}>
          <div className="account-client-back-button">
            <button style={{
              position: "absolute", top: 0, left: 50, width: 48, height: 48, cursor: "pointer",
            }} onClick={() => navigation("/account/client/list-promo")}>
              <img src={arrow} style={{transform: "rotate(180deg)"}}/>
            </button>
          </div>
          <TitleSection title="post" span="this content"/>

          <FormContainer style={{marginTop: "60px"}}>
            <form className="account-client-post">
              <TextInput
                  title="Campaign Name"
                  placeholder="Enter Campaign Name"
                  style={{marginTop: "60px"}}
                  silverColor={true}
              />
              <TextInput
                title="Videolink"
                placeholder="Enter videolink"
                style={{ marginTop: "60px" }}
                value={dataPromo.videoLink}
                setValue={(value) => dispatch(setVideoLink(value))}
                error={formError.videoLink}
                onFocus={() => setFormError({ ...formError, videoLink: false })}
                silverColor={true}
              />
              <TextArea
                title="Post Description"
                placeholder="Enter description"
                style={{ marginTop: "60px" }}
                value={dataPromo.postDescription}
                setValue={(value) => dispatch(setPostDescription(value))}
                error={formError.postDescription}
                onFocus={() =>
                  setFormError({ ...formError, postDescription: false })
                }
              />
              <TextInput
                title="Story Tag"
                placeholder="Enter story tag"
                style={{ marginTop: "60px" }}
                value={dataPromo.storyTag}
                setValue={(value) => dispatch(setStoryTag(value))}
                error={formError.storyTag}
                onFocus={() => setFormError({ ...formError, storyTag: false })}
                silverColor={true}
              />
              <TextInput
                title="Swipe Up Link"
                placeholder="Enter swipe up link"
                style={{ marginTop: "60px" }}
                value={dataPromo.swipeUpLink}
                setValue={(value) => dispatch(setSwipeUpLink(value))}
                error={formError.swipeUpLink}
                onFocus={() =>
                  setFormError({ ...formError, swipeUpLink: false })
                }
                silverColor={true}
              />
              <TextInput
                title="Date Request"
                placeholder="Enter data"
                style={{ marginTop: "60px" }}
                value={dataPromo.dateRequest}
                setValue={(value) => {
                  // Remove any non-digit characters
                  const numericValue = value.replace(/[^\d]/g, '');
          
                  // Format the string
                  let formattedValue = '';
                  if (numericValue.length <= 2) {
                      // First two digits for the day
                      formattedValue = numericValue;
                  } else if (numericValue.length <= 4) {
                      // Add slash after the day
                      formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
                  } else {
                      // Add slashes for both day and month
                      formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
                  }
          
                  // Update state

                  dispatch(setDateRequest(formattedValue))
                  // setFormData({ ...formData, datePost: formattedValue });
              }}
                error={formError.dateRequest}
                onFocus={() =>
                  setFormError({ ...formError, dateRequest: false })
                }
                silverColor={true}
              />
              <TextArea
                title="Special Requests"
                placeholder="Enter special requests"
                style={{ marginTop: "60px" }}
                value={dataPromo.specialWishes}
                setValue={(value) => dispatch(setSpecialWishes(value))}
                error={formError.specialWishes}
                onFocus={() =>
                  setFormError({ ...formError, specialWishes: false })
                }
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "60px",
                }}
              >
                <StandardButton text="Request this post" onClick={nextForm} />
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </section>
  );
};

export default AccountClientPostContent;
