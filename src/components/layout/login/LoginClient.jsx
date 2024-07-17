import React, { useState } from "react";
import TitleSection from "../../TitleSection";
import FormContainer from "../../form/FormContainer";
import TextInput from "../../form/TextInput";
import StandardButton from "../../form/StandardButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../../redux/slice/authenticated";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const LoginClient = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);

  const loginRequest = async () => {
    if (!login || !password) return;

    const result = await axios.post(
      `${process.env.REACT_APP_SERVER}/auth/login/client`,
      {
        email: login,
        password,
      }
    );
    if (result.data.code === 200) {
      dispatch(setAuthenticated(true));
      localStorage.setItem("token", result.data.token);
      navigation("/account/client");
      return;
    }

    if (result.data.code === 403) {
      NotificationManager.info("Your account is under verification", "Info");
      return;
    }

    NotificationManager.error("Incorrect password", "Error");

    setErrorLogin(true);
  };
  return (
    <section className="login-client">
      <div className="container-form">
        <div className="login-client-block">
          <TitleSection title="Log in to" span="SPONSORING CLIENT" />

          <p className="login-client-second">Embrace Your Influence</p>

          <FormContainer style={{ marginTop: "73px" }}>
            <div className="login-client-form">
              <TextInput
                title="Email"
                placeholder="Enter email"
                style={{ marginTop: "60px" }}
                value={login}
                setValue={(value) => setLogin(value)}
                error={errorLogin}
                onFocus={() => setErrorLogin(false)}
              />
              <TextInput
                type="password"
                title="Password"
                placeholder="Enter password"
                style={{ marginTop: "60px" }}
                value={password}
                setValue={(value) => setPassword(value)}
                error={errorLogin}
                onFocus={() => setErrorLogin(false)}
              />

              <div className="login-client-form-password">
                <button
                  className="login-client-form-password-link"
                  type="button"
                  onClick={() => navigation("/forgot")}
                >
                  Forgot password?
                </button>
              </div>

              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <StandardButton text="Login Now" onClick={loginRequest} />
              </div>
            </div>
          </FormContainer>
          <p className="login-client-form-signup">
            Have not an account?{" "}
            <button
              className="login-client-form-signup-link"
              type="button"
              onClick={() => navigation("/signup/client")}
            >
              Sign Up Here
            </button>
          </p>
        </div>
      </div>
      <NotificationContainer />
    </section>
  );
};

export default LoginClient;
