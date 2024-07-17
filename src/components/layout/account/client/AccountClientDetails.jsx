import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import edit from "../../../../images/icons/edit.svg";
import ModalWindow from "../../../ModalWindow";
import TextInput from "../../../form/TextInput";
import StandardButton from "../../../form/StandardButton";
import UseVerify from "../../../../hooks/useVerify";
import axios from "axios";
import {
  formatPhoneNumber,
  validatePhoneNumber,
} from "../../../../utils/validations";
import InputFile from "../../../form/InputFile";

import { useNavigate } from "react-router-dom";


import arrow from "../../../../images/icons/arrow.svg";

const AccountClientDetails = () => {
  const [data, setData] = useState({});
  const [isOpenPersonal, setIsOpenPersonal] = useState(false);
  const [isOpenPassword, setIsOpenPassword] = useState(false);
  const [isOpenCompany, setIsOpenCompany] = useState(false);
  const [isOpenEmail, setIsOpenEmail] = useState(false);
  const [isOpenPhone, setIsOpenPhone] = useState(false);

  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorCompany, setErrorCompany] = useState(false);
  const [errorCompanyType, setErrorCompanyType] = useState(false);
  const [errorInstagram, setErrorInstagram] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorReferalCode, setErrorReferalCode] = useState(false);
  const [errorLogo, setErrorLogo] = useState(false);
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorCurrentPassword, setErrorCurrentPassword] = useState(false);
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [errorRepeatPassword, setErrorRepeatPassword] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [fileImage, setFile] = useState(null);


  const [dataPersonal, setDataPersonal] = useState({
    firstName: "",
    instagramUsername: "",
    referalCode: "",
    logo: "",
  });

  const [dataPassword, setDataPassword] = useState({
    currentPassword: "",
    newPassword: "",
    acceptPassword: "",
  });

  const [dataCompany, setDataCompany] = useState({
    company: "",
    companyType: "",
  });

  const [dataEmail, setDataEmail] = useState("");
  const [dataPhone, setDataPhone] = useState("");

  const updateClientPersonal = async () => {
    
    if (!dataPersonal.firstName) {
      setErrorFirstName(true);
    }
    if (!dataPersonal.instagramUsername) {
      setErrorInstagram(true);
    }

    let responseURL = dataPersonal.logo;
    
    if(fileImage){
      const formDataScreenshot = new FormData();
      formDataScreenshot.append("file", fileImage);
       responseURL = await axios.post(
        `${process.env.REACT_APP_SERVER}/promos/uploadScreenshot`,
        formDataScreenshot,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    }

    try {
      if (!dataPersonal.firstName || !dataPersonal.instagramUsername) {
        return;
      }
      const result = await axios.put(
        `${process.env.REACT_APP_SERVER}/profile/client/personal`,
        { ...dataPersonal, logo: responseURL.data ? responseURL.data.data : responseURL, id: data._id }
      );
      if (result.data.code === 200) {
        setIsOpenPersonal(false);
        setData({ ...data, ...dataPersonal });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateClientPassword = async () => {
    if (!dataPassword.currentPassword) {
      setErrorCurrentPassword(true);
    }
    if (!dataPassword.newPassword) {
      setErrorNewPassword(true);
    }
    if (
      !dataPassword.acceptPassword ||
      !dataPassword.currentPassword ||
      !dataPassword.newPassword
    ) {
      return;
    }
    if (dataPassword.newPassword !== dataPassword.acceptPassword) {
      setErrorRepeatPassword(true);
      return;
    }
    try {
      const result = await axios.put(
        `${process.env.REACT_APP_SERVER}/profile/client/password`,
        {
          role: "client",
          currentPassword: dataPassword.currentPassword,
          newPassword: dataPassword.newPassword,
          id: data._id,
        }
      );
      if (result.data.code === 200) {
        setIsOpenPassword(false);
        setDataPassword({
          currentPassword: "",
          newPassword: "",
          acceptPassword: "",
        });
        return;
      }
      setErrorCurrentPassword(true);
    } catch (err) {
      console.log(err);
    }
  };

  const updateClientCompany = async () => {
    if (!dataCompany.company) {
      setErrorCompany(true);
    }
    if (!dataCompany.companyType) {
      setErrorCompanyType(true);
    }
    if (!dataCompany.company || !dataCompany.companyType) return;
    try {
      const result = await axios.put(
        `${process.env.REACT_APP_SERVER}/profile/client/company`,
        { ...dataCompany, id: data._id }
      );
      if (result.data.code === 200) {
        setIsOpenCompany(false);
        setData({ ...data, ...dataCompany });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateClientEmail = async () => {
    if (!dataEmail) {
      return setErrorEmail(true);
    }
    try {
      const result = await axios.put(
        `${process.env.REACT_APP_SERVER}/profile/client/email`,
        { email: dataEmail, id: data._id }
      );
      if (result.data.code === 200) {
        setIsOpenEmail(false);
        setData({ ...data, email: dataEmail });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateClientPhone = async () => {
    if (!dataPhone) {
      return setErrorPhone(true);
    }
    try {
      const result = await axios.put(
        `${process.env.REACT_APP_SERVER}/profile/client/phone`,
        { phone: dataPhone, id: data._id }
      );
      if (result.data.code === 200) {
        setIsOpenPhone(false);
        setData({ ...data, phone: dataPhone });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify();
      setData(dataFetch);
      setDataPersonal({
        firstName: dataFetch.firstName,
        instagramUsername: dataFetch.instagramUsername,
        referalCode: dataFetch.referalCode,
        logo: dataFetch.logo,
      });
      setAvatar(dataFetch.logo);
      setDataCompany({
        company: dataFetch.company,
        companyType: dataFetch.companyType,
      });
      setDataEmail(dataFetch.email);
      setDataPhone(dataFetch.phone);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAvatar = (file) =>{
    if (file && file.type.match('image.*')) {
      setFile(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        setAvatar(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  const navigation = useNavigate();
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <section className="account-influencer-details">
        <div className="container-form">
          <div className="account-influencer-details-block" style={{position: "relative"}}>
            <TitleSection title="MY" span="account" />

            <p className="account-influencer-details-second">
              My Account Details
            </p>

            <button
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 50,
              height: 50,
              cursor: "pointer",
            }}
            onClick={() => {
              navigation("/account/client")
            }}
          >
            <img src={arrow} style={{ transform: "rotate(180deg)" }} />
          </button>

            <div className="account-influencer-details-thoomb">
              <div className="account-influencer-details-wrapper">
                <div className="account-influencer-details-wrapper-header">
                  <p className="account-influencer-details-wrapper-header-title">
                    Personal Details
                  </p>

                  <button
                    className="account-influencer-details-wrapper-header-edit"
                    onClick={() => setIsOpenPersonal(true)}
                  >
                    <img
                      className="account-influencer-details-wrapper-header-edit-icon"
                      src={edit}
                    />
                  </button>
                </div>

                <div className="account-influencer-details-wrapper-content">
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      First name
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.firstName}
                    </p>
                  </div>

                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Instagram Username
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.instagramUsername}
                    </p>
                  </div>
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Referral code
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.referalCode}
                    </p>
                  </div>
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Logo
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.logo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="account-influencer-details-wrapper">
                <div className="account-influencer-details-wrapper-header">
                  <p className="account-influencer-details-wrapper-header-title">
                    Password
                  </p>

                  <button
                    className="account-influencer-details-wrapper-header-edit"
                    onClick={() => setIsOpenPassword(true)}
                  >
                    <img
                      className="account-influencer-details-wrapper-header-edit-icon"
                      src={edit}
                    />
                  </button>
                </div>

                <div className="account-influencer-details-wrapper-content">
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Password
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      **********
                    </p>
                  </div>
                </div>
              </div>

              <div className="account-influencer-details-wrapper">
                <div className="account-influencer-details-wrapper-header">
                  <p className="account-influencer-details-wrapper-header-title">
                    Company
                  </p>

                  <button
                    className="account-influencer-details-wrapper-header-edit"
                    onClick={() => setIsOpenCompany(true)}
                  >
                    <img
                      className="account-influencer-details-wrapper-header-edit-icon"
                      src={edit}
                    />
                  </button>
                </div>

                <div className="account-influencer-details-wrapper-content">
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Company
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.company}
                    </p>
                  </div>
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Company type
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.companyType}
                    </p>
                  </div>
                </div>
              </div>

              <div className="account-influencer-details-wrapper">
                <div className="account-influencer-details-wrapper-header">
                  <p className="account-influencer-details-wrapper-header-title">
                    Email address
                  </p>

                  <button
                    className="account-influencer-details-wrapper-header-edit"
                    onClick={() => setIsOpenEmail(true)}
                  >
                    <img
                      className="account-influencer-details-wrapper-header-edit-icon"
                      src={edit}
                    />
                  </button>
                </div>

                <div className="account-influencer-details-wrapper-content">
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Email
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="account-influencer-details-wrapper">
                <div className="account-influencer-details-wrapper-header">
                  <p className="account-influencer-details-wrapper-header-title">
                    Phone
                  </p>

                  <button
                    className="account-influencer-details-wrapper-header-edit"
                    onClick={() => setIsOpenPhone(true)}
                  >
                    <img
                      className="account-influencer-details-wrapper-header-edit-icon"
                      src={edit}
                    />
                  </button>
                </div>

                <div className="account-influencer-details-wrapper-content">
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Phone
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModalWindow
        header="Personal Details"
        isOpen={isOpenPersonal}
        setClose={setIsOpenPersonal}
      >
        <div className="account-influencer-details-form">
          <TextInput
            title="First name"
            placeholder="John Doe"
            style={{ marginTop: "80px" }}
            value={dataPersonal.firstName}
            setValue={(value) =>
              setDataPersonal({ ...dataPersonal, firstName: value })
            }
            error={errorFirstName}
            onFocus={() => setErrorFirstName(false)}
          />

          <TextInput
            title="Instagram username"
            placeholder="John Doe"
            style={{ marginTop: "50px" }}
            value={dataPersonal.instagramUsername}
            setValue={(value) =>
              setDataPersonal({ ...dataPersonal, instagramUsername: value })
            }
            error={errorInstagram}
            onFocus={() => setErrorInstagram(false)}
          />
          <TextInput
            title="Referral code"
            placeholder="Code"
            style={{ marginTop: "50px" }}
            value={dataPersonal.referalCode}
            setValue={(value) =>
              setDataPersonal({ ...dataPersonal, referalCode: value })
            }
            error={errorReferalCode}
            onFocus={() => setErrorReferalCode()}
          />
          {avatar && <img style={{marginTop: "20px", maxWidth: "70px"}} src={avatar || avatar?.url} /> }
          <InputFile
            title="Logo"
            placeholder="logo"
            style={{ marginTop: "50px" }}
            setValue={handleAvatar}
            error={errorLogo}
            onFocus={() => setErrorLogo()}
          />

          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StandardButton
              text="Save changes"
              onClick={updateClientPersonal}
            />
          </div>
        </div>
      </ModalWindow>

      <ModalWindow
        header="Password"
        isOpen={isOpenPassword}
        setClose={setIsOpenPassword}
      >
        <div className="account-influencer-details-form">
          <TextInput
            type="password"
            title="Confirm Current Password"
            placeholder="Enter Current Password"
            style={{ marginTop: "80px" }}
            value={dataPassword.currentPassword}
            setValue={(value) =>
              setDataPassword({
                ...dataPassword,
                currentPassword: value,
              })
            }
            error={errorCurrentPassword}
            onFocus={() => setErrorCurrentPassword(false)}
          />
          <TextInput
            type="password"
            title="New Password"
            placeholder="Enter New Password"
            style={{ marginTop: "50px" }}
            value={dataPassword.newPassword}
            setValue={(value) =>
              setDataPassword({
                ...dataPassword,
                newPassword: value,
              })
            }
            error={errorNewPassword}
            onFocus={() => setErrorNewPassword(false)}
          />
          <TextInput
            type="password"
            title="Confirm New Password"
            placeholder="Enter Confirm New Password"
            style={{ marginTop: "50px" }}
            value={dataPassword.acceptPassword}
            setValue={(value) =>
              setDataPassword({
                ...dataPassword,
                acceptPassword: value,
              })
            }
            error={errorRepeatPassword}
            onFocus={() => setErrorRepeatPassword(false)}
          />

          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StandardButton
              text="Update Password"
              onClick={updateClientPassword}
            />
          </div>
        </div>
      </ModalWindow>

      <ModalWindow
        header="Company"
        isOpen={isOpenCompany}
        setClose={setIsOpenCompany}
      >
        <div className="account-influencer-details-form">
          <TextInput
            title="Company"
            placeholder="Enter Company Name"
            style={{ marginTop: "80px" }}
            value={dataCompany.company}
            setValue={(value) =>
              setDataCompany({ ...dataCompany, company: value })
            }
            error={errorCompany}
            onFocus={() => setErrorCompany(false)}
          />

          <TextInput
            title="Company type"
            placeholder="Enter Company Type"
            style={{ marginTop: "50px" }}
            value={dataCompany.companyType}
            setValue={(value) =>
              setDataCompany({ ...dataCompany, companyType: value })
            }
            error={errorCompanyType}
            onFocus={() => setErrorCompanyType(false)}
          />

          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StandardButton text="Save changes" onClick={updateClientCompany} />
          </div>
        </div>
      </ModalWindow>

      <ModalWindow
        header="Email address"
        isOpen={isOpenEmail}
        setClose={setIsOpenEmail}
      >
        <div className="account-influencer-details-form">
          <TextInput
            title="Email"
            placeholder="User_email@gmail.com"
            style={{ marginTop: "80px" }}
            value={dataEmail}
            setValue={(value) => setDataEmail(value)}
            error={errorEmail}
            onFocus={() => setErrorEmail(false)}
          />

          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StandardButton text="Save changes" onClick={updateClientEmail} />
          </div>
        </div>
      </ModalWindow>
      <ModalWindow
        header="Phone"
        isOpen={isOpenPhone}
        setClose={setIsOpenPhone}
      >
        <div className="account-influencer-details-form">
          <TextInput
            title="Phone"
            placeholder="+1 234 567 89 00"
            style={{ marginTop: "80px" }}
            value={dataPhone}
            setValue={(value) => setDataPhone(value)}
            error={errorPhone}
            onFocus={() => setErrorPhone(false)}
          />

          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StandardButton text="Save changes" onClick={updateClientPhone} />
          </div>
        </div>
      </ModalWindow>
    </>
  );
};

export default AccountClientDetails;
