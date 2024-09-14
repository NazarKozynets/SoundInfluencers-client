import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import TextInput from "../../../form/TextInput";
import StandartButton from "../../../../components/form/StandardButton/index";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ModalWindow from "../../../ModalWindow";
import InputFile from "../../../form/InputFile";
import UseVerify from "../../../../hooks/useVerify";
import useVerify from "../../../../hooks/useVerify";

const UpdateOngoingPromo = () => {
    const params = useParams();
    const navigation = useNavigate();

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
    const [isWindow, setIsWindow] = useState(false);
    const [isWindowTwo, setIsWindowTwo] = useState(false);

    const getData = async () => {
        if (!params.influencerId || !params.promoId || !params.instagram) {
            return navigation("/");
        }
        
        console.log(params, 'params')
        
        try {
            const result = await axios(
                `${process.env.REACT_APP_SERVER}/promos/get-ongoing-promo-one?influencerId=${params.influencerId}&promoId=${params.promoId}&instagramUsername=${params.instagram}`
            );

            // console.log(result.data.code, 'result code')
            // console.log(result.data, 'data')
            
            if (result.data.code === 200) {
                setFormData(result.data.promo);
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
                            ...formData,
                            screenshot: responseURL.data.data,
                        }
                    );

                    if (result.data.code === 200) {
                        getData();
                        setIsWindowTwo(true);
                    }
                } catch (error) {
                    console.error("Error uploading file", error);
                }
            } else {
                try {
                    const result = await axios.put(
                        `${process.env.REACT_APP_SERVER}/promos/update-ongoing?influencerId=${params.influencerId}&promoId=${params.promoId}&instagramUsername=${params.instagram}`,
                        formData
                    );

                    if (result.data.code === 200) {
                        getData();
                        setIsWindowTwo(true);
                    }
                } catch (error) {
                    console.error("Error updating promo", error);
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

                    <FormContainer style={{ marginTop: "60px" }}>
                        <TextInput
                            style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
                            title="Instagram link"
                            placeholder="Enter Instagram link"
                            value={formData.postLink}
                            setValue={(value) => setFormData({ ...formData, postLink: value })}
                        />

                        <TextInput
                            style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
                            title="Date Post"
                            placeholder="Enter date post dd/mm/yyyy"
                            value={formData.datePost}
                            setValue={(value) => {
                                const numericValue = value.replace(/[^\d]/g, "");

                                let formattedValue = "";
                                if (numericValue.length <= 2) {
                                    formattedValue = numericValue;
                                } else if (numericValue.length <= 4) {
                                    formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
                                } else {
                                    formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
                                }

                                setFormData({ ...formData, datePost: formattedValue });
                            }}
                        />

                        <TextInput
                            style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
                            title="Impressions"
                            placeholder="Enter impressions"
                            value={formData.impressions}
                            setValue={(value) => setFormData({ ...formData, impressions: value })}
                        />

                        <TextInput
                            style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
                            title="Likes"
                            placeholder="Enter the Likes number here"
                            value={formData.like}
                            setValue={(value) => setFormData({ ...formData, like: value })}
                        />

                        <InputFile
                            style={{ maxWidth: "665px", margin: "60px auto 0 auto" }}
                            title="Screenshot insights"
                            placeholder="Attach the screenshot of the insights"
                            setValue={(value) => setScreenshot(value)}
                        />

                        <div style={{ marginTop: "60px", display: "flex", justifyContent: "center" }}>
                            <StandartButton text="Submit" onClick={updateData} />
                        </div>
                    </FormContainer>
                </div>
            </div>

            <ModalWindow header="CONGRATULATIONS!" isOpen={isWindowTwo} setClose={setIsWindowTwo}>
                <div className="account-influencer-details-form">
                    <div style={{ marginTop: "60px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
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
                            The campaign has concluded, and the remaining balance is now accessible in your account.
                        </p>
                        <StandartButton
                            text="Submit"
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
