import React, { useEffect, useState } from "react";
import NumberCode from "../../form/NumberCode";
import TitleSection from "../../TitleSection";
import FormContainer from "../../form/FormContainer";
import TextInput from "../../form/TextInput";
import StandardButton from "../../form/StandardButton";
import ModalWindow from "../../ModalWindow";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ForgotPasswordCode = () => {
  const navigation = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [numberCodeState, setNumberCodeState] = useState(["", "", "", ""]);

  const params = useParams();

  const forgotPasswordCodeRequest = async () => {
    if (numberCodeState.join("").length < 4 || !params.email) return;

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER}/forgot/code?email=${
          params.email
        }&code=${numberCodeState.join("")}`
      );

      if (result.data.code === 200) {
        navigation("/login/client");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <section className="forgot-password">
        <div className="container-form">
          <div className="forgot-password-block">
            <TitleSection title="Log in to" span="SoundInfluencers" />

            <p className="login-client-second">Embrace Your Influence</p>

            <FormContainer style={{ marginTop: "73px" }}>
              <div className="login-client-form">
                <NumberCode
                  setNumberCode={setNumberCodeState}
                  value={numberCodeState}
                />

                <div
                  style={{
                    marginTop: "44px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <StandardButton
                    text="Continue"
                    onClick={() => setIsOpenModal(true)}
                  />
                </div>
              </div>
            </FormContainer>
          </div>
        </div>
      </section>

      <ModalWindow
        header="Reset password"
        isOpen={isOpenModal}
        setClose={setIsOpenModal}
      >
        <div className="forgot-password-modal">
          <h2 className="forgot-password-modal-title">Success!</h2>
          <p className="forgot-password-modal-second">
            An email containing instructions on how to reset your password has
            been sent to the email address associated with your account.
          </p>
          <p className="forgot-password-modal-desc">
            Please check your email inbox and follow the provided instructions
            to reset your password. If you don't receive the email within a few
            minutes, kindly check your spam or junk folder as it may have been
            filtered incorrectly.
          </p>

          <div
            style={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StandardButton
              text="Ok"
              style={{ padding: "10px 80px" }}
              onClick={() => {
                setIsOpenModal(false);
                forgotPasswordCodeRequest();
              }}
            />
          </div>
        </div>
      </ModalWindow>
    </>
  );
};

export default ForgotPasswordCode;
