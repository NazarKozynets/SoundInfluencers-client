import React from "react";
import AltButton from "../../form/AltButton";
import sponsor from "../../../images/icons/sponsor.svg";
import influencer from "../../../images/icons/influencer.svg";
import TitleSection from "../../TitleSection";
import { useNavigate } from "react-router-dom";

const SignupSelect = () => {
  const navigation = useNavigate();
  return (
    <>
      <section className="signup-select">
        <div className="container">
          <div className="signup-select-block">
            <TitleSection title="Create Your" span="free account" />

            <p className="signup-select-second">
              Choose the optimal option from our selection
            </p>

            <div className="signup-select-flex">
              <div className="signup-select-card">
                <img className="signup-select-card-icon" src={sponsor} />
                <h2 className="signup-select-card-title">
                  I am a sponsoring client
                </h2>
                <p className="signup-select-card-desc">Find your creators</p>

                <AltButton
                  text="Sign up"
                  onClick={() => navigation("/signup/client")}
                  style={{ padding: "6px 50px" }}
                />
              </div>
              <div className="signup-select-card">
                <img className="signup-select-card-icon" src={influencer} />
                <h2 className="signup-select-card-title">I am an influencer</h2>
                <p className="signup-select-card-desc">
                  Receive client's campaign requests
                </p>

                <AltButton
                  text="Sign up"
                  onClick={() => navigation("/signup/influencer")}
                  style={{ padding: "6px 50px" }}
                />
              </div>
            </div>

            <p className="signup-select-text">Embrace Your Influence</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignupSelect;
