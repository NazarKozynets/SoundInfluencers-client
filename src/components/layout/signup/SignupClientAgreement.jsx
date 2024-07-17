import React, { useState } from "react";
import TitleSection from "../../TitleSection";
import FormContainer from "../../form/FormContainer";
import TextInput from "../../form/TextInput";
import CheckBox from "../../form/CheckBox";
import StandardButton from "../../form/StandardButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setAcceptAgree,
  setEmail,
  setPassword,
  setRepeatPassword,
  setSignupClear,
  setUsername,
} from "../../../redux/slice/signup-client";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const SignupClientAgreement = () => {
  const signupClientState = useSelector((state) => state.signupClient);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorRepeatPassword, setErrorRepeatPassword] = useState(false);

  const register = async () => {
    if (!signupClientState.username) {
      setErrorUsername(true);
    }
    if (!signupClientState.email) {
      setErrorEmail(true);
    }
    if (!signupClientState.password) {
      setErrorPassword(true);
    }

    if (
      !signupClientState.username ||
      !signupClientState.email ||
      !signupClientState.password
    ) {
      return;
    }

    if (signupClientState.password !== signupClientState.repeatPassword) {
      setErrorRepeatPassword(true);
      return;
    }

    if (!signupClientState.acceptAgree) return;
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER}/auth/create/client`,
        {
          firstName: signupClientState.firstName,
          company: signupClientState.company,
          companyType: signupClientState.companyType,
          instagram: signupClientState.instagram,
          email: signupClientState.email,
          phone: signupClientState.phone,
          referalCode: signupClientState.referalCode,
          username: signupClientState.username,
          password: signupClientState.password,
        }
      );

      if (result.data.code === 201) {
        const requestToken = await axios.post(
          `${process.env.REACT_APP_SERVER}/auth/login/client`,
          {
            email: signupClientState.email,
            password: signupClientState.password,
          }
        );
        localStorage.setItem("token", requestToken.data.token);
        dispatch(setSignupClear());
        navigation("/account/client");
      }

      if (result.data.code === 409) {
        NotificationManager.error(
          "An account with this email already exists",
          "Error"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="signup-client-agreement">
      <div className="container-form">
        <div className="signup-client-agreement-block">
          <TitleSection
            title="You have now received access"
            span="to your account"
          />
          <p className="signup-client-agreement-second">Create Your account:</p>

          <FormContainer>
            <form className="signup-client-agreement-form">
              <TextInput
                title="Username"
                placeholder="Enter username"
                style={{ marginTop: "30px" }}
                value={signupClientState.username}
                setValue={(value) => dispatch(setUsername(value))}
                error={errorUsername}
                onFocus={() => setErrorUsername(false)}
              />
              <TextInput
                title="Email"
                placeholder="Enter email"
                style={{ marginTop: "60px" }}
                value={signupClientState.email}
                setValue={(value) => dispatch(setEmail(value))}
                error={errorEmail}
                onFocus={() => setErrorEmail(false)}
              />
              <TextInput
                type="password"
                title="Password"
                placeholder="Enter password"
                style={{ marginTop: "60px" }}
                value={signupClientState.password}
                setValue={(value) => dispatch(setPassword(value))}
                error={errorPassword}
                onFocus={() => setErrorPassword(false)}
              />
              <TextInput
                type="password"
                title="Repeat Password"
                placeholder="Repeat Password"
                style={{ marginTop: "60px" }}
                value={signupClientState.repeatPassword}
                setValue={(value) => dispatch(setRepeatPassword(value))}
                error={errorRepeatPassword}
                onFocus={() => setErrorRepeatPassword(false)}
              />
              <CheckBox
                text="Agree to terms and conditions"
                style={{ marginTop: "57px" }}
                checked={signupClientState.acceptAgree}
                setChecked={(value) => dispatch(setAcceptAgree(value))}
              />

              <StandardButton
                text="Continue"
                style={{ margin: "0 auto", marginTop: "50px" }}
                // onClick={register}
              />
            </form>
          </FormContainer>
        </div>
      </div>
      <NotificationContainer />
    </section>
  );
};

export default SignupClientAgreement;
