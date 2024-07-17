import React from "react";
import TitleSection from "../../TitleSection";
import FormContainer from "../../form/FormContainer";
import TextInput from "../../form/TextInput";
import CheckBox from "../../form/CheckBox";
import StandardButton from "../../form/StandardButton";
import AltButton from "../../form/AltButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignupClear } from "../../../redux/slice/signup-influencer";

const SignupInfluencerAgreement = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();

  return (
    <section className="signup-client-agreement">
      <div className="container-form">
        <div className="signup-client-agreement-block">
          <TitleSection title="You’ll receive" span="50€ each post" />

          <FormContainer
            style={{
              marginTop: "60px",
              paddingTop: "80px",
              paddingBottom: "60px",
            }}
          >
            <form
              className="signup-client-agreement-form"
              style={{ maxWidth: "440px" }}
            >
              <div
                className="signup-client-agreement-form-flex"
                style={{ margin: "0 auto" }}
              >
                <div className="signup-client-agreement-form-block">
                  <StandardButton
                    text="Yes"
                    style={{ width: "100%" }}
                    onClick={() => navigation("/signup/influencer/last")}
                  />
                  <p className="signup-client-agreement-form-block-text">
                    Create Account
                  </p>
                </div>
                <div className="signup-client-agreement-form-block">
                  <AltButton
                    text="No"
                    style={{ width: "100%" }}
                    onClick={() => dispatch(setSignupClear())}
                  />
                  <p className="signup-client-agreement-form-block-text">
                    Contact Us
                  </p>
                </div>
              </div>

              {/* <CheckBox
                text="Agree to terms and conditions"
                style={{ marginTop: "60px" }}
              /> */}
            </form>
          </FormContainer>
        </div>
      </div>
    </section>
  );
};

export default SignupInfluencerAgreement;
