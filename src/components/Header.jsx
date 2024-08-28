import React, { useEffect, useState } from "react";
import logo from "../images/icons/logo.svg";
import profile from "../images/icons/profile.svg";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
// import themeNight from "../images/icons/theme-night.svg";
import themeDay from "../images/icons/theme-day.svg";
import { useTheme } from "../ThemeContext";
import UseVerify from "../hooks/useVerify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../redux/slice/authenticated";

const Header = ({ userType = "client", page = "login", path = "" }) => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { toggleTheme, theme } = useTheme();
  const isAuth = useSelector((state) => state.authenticated.isAuthenticated);
  const role = useSelector((state) => state.authenticated.role);

  const logoutRequest = () => {
    localStorage.setItem("token", "");
    dispatch(setAuthenticated(false));
    navigation("/login/client");
  };

  const returnTextLogin = () => {
    if (userType === "influencer" && page === "login") {
      return { text: "influencer", path: "/login/influencer" };
    }
    if (userType === "client" && page === "login") {
      return { text: "client", path: "/login/client" };
    }

    if (userType === "client" && page === "signup") {
      return { text: "influencer", path: "/login/influencer" };
    }
    if (userType === "influencer" && page === "signup") {
      return { text: "client", path: "/login/client" };
    }
    return { text: "client", path: "/login/client" };
  };

  const returnTextSignup = () => {
    if (userType === "influencer" && page === "signup") {
      return { text: "influencer", path: "/signup/influencer" };
    }
    if (userType === "client" && page === "signup") {
      return { text: "client", path: "/signup/client" };
    }

    if (userType === "client" && page === "login") {
      return { text: "influencer", path: "/signup/influencer" };
    }
    if (userType === "influencer" && page === "login") {
      return { text: "client", path: "/signup/client" };
    }
    return { text: "client", path: "/login/client" };
  };
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-block">
            <div className="header-thoomb">
              <button className="header-logo" onClick={() => navigation("/")}>
                <img src={logo} />
              </button>
              <p className="header-path">{path}</p>
            </div>

            <div className="header-navigation">
              {isAuth && (
                <button
                  className="header-logout"
                  type="button"
                  onClick={logoutRequest}
                >
                  Logout
                </button>
              )}
              {/*<button className="header-theme" onClick={toggleTheme}>*/}
              {/*  /!*{theme.text === "#000" ? (*!/*/}
              {/*  /!*  <img className="header-theme-icon" src={themeNight} />*!/*/}
              {/*  /!*) : (*!/*/}
              {/*    <img className="header-theme-icon" src={themeDay} />*/}
              {/*  /!*)*!/*/}
              {/*  */}
              {/*</button>*/}

              {!isAuth && page === "signup" && (
                <div className="header-mobile">
                  <button
                    className="header-login"
                    type="button"
                    onClick={() => {
                      navigation("/login/client");
                    }}
                  >
                    Log in client
                  </button>
                  <button
                    className="header-login"
                    type="button"
                    onClick={() => {
                      navigation("/login/influencer");
                    }}
                  >
                    Log in influencer
                  </button>
                </div>
              )}
              {!isAuth && page === "login" && (
                <div className="header-mobile">
                  <button
                    className="header-login"
                    type="button"
                    onClick={() => {
                      navigation("/signup/client");
                    }}
                  >
                    Signup in client
                  </button>
                  <button
                    className="header-login"
                    type="button"
                    onClick={() => {
                      navigation("/signup/influencer");
                    }}
                  >
                    Signup in influencer
                  </button>
                </div>
              )}
              {isAuth && (
                <button
                  className="header-profile"
                  onClick={() => {
                    if (role === "influencer") {
                      navigation("/account/influencer/details");
                    }
                    if (role === "client") {
                      navigation("/account/client/details");
                    }
                  }}
                >
                  <img className="header-profile-icon" src={profile} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
