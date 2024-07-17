import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import TextInput from "../../../form/TextInput";
import StandardButton from "../../../form/StandardButton";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { is24HoursPassed } from "../../../../utils/validations";
import ModalWindow from "../../../ModalWindow";
import InputFile from "../../../form/InputFile";

const UpdateOngoingPromo = () => {
  const params = useParams();
  const navigation = useNavigate();
  const [data, setData] = useState({
    isPassed: false,
    daysLeft: 24,
  });

  const [isWindow, setIsWindow] = useState(false);
  const [isWindowTwo, setIsWindowTwo] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    caption: "",
    datePost: "",
    impressions: "",
    reach: "",
    like: "",
    postLink: "",
    screenshot: "",
  });
  const [screenshot, setScreenshot] = useState(null);

  const getData = async () => {
    if (!params.influencerId || !params.promoId || !params.instagram) {
      return navigation("/");
    }
    try {
      const result = await axios(
        `${process.env.REACT_APP_SERVER}/promos/get-ongoing-promo-one?influencerId=${params.influencerId}&promoId=${params.promoId}&instagramUsername=${params.instagram}`
      );

      console.log(result.data.date);
      if (result.data.code === 200) {
        setFormData(result.data.promo);
        setData(is24HoursPassed(result.data.promo.updatedAt, result.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateData = async () => {
    if (!params.influencerId || !params.promoId) {
      return navigation("/");
    }

    try {
      const formDataScreenshot = new FormData();
      formDataScreenshot.append("file", screenshot); // 'file' is the key expected on the server side

      if (screenshot) {
        try {
          const responseURL = await axios.post(
            `${process.env.REACT_APP_SERVER}/promos/uploadScreenshot`,
            formDataScreenshot,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const result = await axios.put(
            `${process.env.REACT_APP_SERVER}/promos/update-ongoing?influencerId=${params.influencerId}&promoId=${params.promoId}&instagramUsername=${params.instagram}`,
            {
              brand: formData.brand,
              caption: formData.caption,
              datePost: formData.datePost,
              impressions: formData.impressions,
              reach: formData.reach,
              like: formData.like,
              postLink: formData.postLink,
              screenshot: responseURL.data.data,
            }
          );

          if (result.data.code === 200) {
            getData();
            if (!data.isPassed) {
              setIsWindow(true);
            } else {
              setIsWindowTwo(true);
            }
          }
          // console.log('File uploaded successfully', response.data);
        } catch (error) {
          console.error("Error uploading file", error);
        }
      } else {
        try {
          const result = await axios.put(
            `${process.env.REACT_APP_SERVER}/promos/update-ongoing?influencerId=${params.influencerId}&promoId=${params.promoId}&instagramUsername=${params.instagram}`,
            {
              brand: formData.brand,
              caption: formData.caption,
              datePost: formData.datePost,
              impressions: formData.impressions,
              reach: formData.reach,
              like: formData.like,
              postLink: formData.postLink,
              screenshot: "",
            }
          );

          if (result.data.code === 200) {
            getData();
            if (!data.isPassed) {
              setIsWindow(true);
            } else {
              setIsWindowTwo(true);
            }
          }
          // console.log('File uploaded successfully', response.data);
        } catch (error) {
          console.error("Error uploading file", error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="invoice-result">
      <div className="container-form">
        <div className="invoice-result-block">
          <TitleSection title="campaign result" />

          <FormContainer
            style={{
              marginTop: "60px",
            }}
          >
            <TextInput
              style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
              title="Instagram  link"
              placeholder="Enter Instagram  link"
              value={formData.postLink}
              setValue={(value) =>
                setFormData({ ...formData, postLink: value })
              }
            />
            <TextInput
              style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
              title="Date Post"
              placeholder="Enter date post dd/mm/yyyy"
              value={formData.datePost}
              setValue={(value) => {
                // Remove any non-digit characters
                const numericValue = value.replace(/[^\d]/g, "");

                // Format the string
                let formattedValue = "";
                if (numericValue.length <= 2) {
                  // First two digits for the day
                  formattedValue = numericValue;
                } else if (numericValue.length <= 4) {
                  // Add slash after the day
                  formattedValue = `${numericValue.slice(
                    0,
                    2
                  )}/${numericValue.slice(2)}`;
                } else {
                  // Add slashes for both day and month
                  formattedValue = `${numericValue.slice(
                    0,
                    2
                  )}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
                }

                // Update state
                setFormData({ ...formData, datePost: formattedValue });
              }}
            />

            <TextInput
              style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
              title="Impressions"
              placeholder="Enter impressions"
              value={formData.impressions}
              setValue={(value) =>
                setFormData({ ...formData, impressions: value })
              }
              disabled={!data.isPassed}
              disabledTime={data.hoursLeft}
            />

            {/* <TextInput
              style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
              title="Reach "
              placeholder="Enter the Reach number here"
              value={formData.impressions}
              setValue={(value) => setFormData({ ...formData, reach: value })}
              disabled={true}
              disabledTime="3"
            /> */}
            <TextInput
              style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
              title="Likes"
              placeholder="Enter the Likes number here"
              value={formData.like}
              setValue={(value) => setFormData({ ...formData, like: value })}
              disabled={!data.isPassed}
              disabledTime={data.hoursLeft}
            />
            <InputFile
              style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
              title="Screenshot insights"
              placeholder="Attach here the link of the screenshot of the insights"
              setValue={(value) => setScreenshot(value)}
              disabled={!data.isPassed}
              disabledTime={data.hoursLeft}
            />

            <div
              style={{
                marginTop: "60px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <StandardButton text="Submit" onClick={updateData} />
            </div>
          </FormContainer>
        </div>
      </div>
      <ModalWindow
        header="Information"
        isOpen={isWindow}
        setClose={setIsWindow}
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
            <h2
              style={{
                color: "#000",
                textAlign: "center",
                fontFamily: "Geometria",
                fontSize: 22,
                fontWeight: 900,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              The details you enered have been saved
            </h2>
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
              Please come back in 24hrs (from the time that the camapign has
              been accepted) to upload the data required, including Screenshot
              of the Insights, Impression, and Likes count.
            </p>
            <StandardButton
              text={!data.isPassed ? "Ok" : "Submit"}
              onClick={() => setIsWindow(false)}
            />
          </div>
        </div>
      </ModalWindow>

      <ModalWindow
        header="CONGRATULATIONS!"
        isOpen={isWindowTwo}
        setClose={setIsWindowTwo}
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
            <h2
              style={{
                color: "#000",
                textAlign: "center",
                fontFamily: "Geometria",
                fontSize: 22,
                fontWeight: 900,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              CONGRATULATIONS
            </h2>
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
              The campaign has concluded, and the remaining balance is now
              accessible in your account. You can generate an invoice to receive
              the agreed-upon funds for your participation in this campaign.
            </p>
            <StandardButton
              text={!data.isPassed ? "Ok" : "Submit"}
              onClick={() => {
                setIsWindowTwo(false);
                navigation("/");
              }}
            />
          </div>
        </div>
      </ModalWindow>
    </section>
  );
};

export default UpdateOngoingPromo;
