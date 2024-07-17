import React, { useState } from "react";
import TitleSection from "../../TitleSection";
import FormContainer from "../../form/FormContainer";
import TextInput from "../../form/TextInput";
import StandardButton from "../../form/StandardButton";
import SelectedInput from "../../form/SelectedInput";
import ModalWindow from "../../ModalWindow";
import acceptIcon from "../../../images/icons/accept.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setAcceptAgree,
  setEmail,
  setFirstName,
  setInfluencerBrands,
  setInfluencerName,
  setInstagram,
  setInstagramAdd,
  setInstagramDelete,
  setPassword,
  setPhone,
  setRepeatPassword,
  setSignupClear,
} from "../../../redux/slice/signup-influencer";
import {
  formatPhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "../../../utils/validations";
import { useNavigate } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import axios from "axios";
import CheckBox from "../../form/CheckBox";
import deleteIcon from "../../../images/icons/close.svg";
import InputFile from "../../form/InputFile";
import { typeOfAccounts } from "../../../utils/typeOfSocialAccounts";

const SignupInfluencer = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const dataForm = useSelector((state) => state.signupInfluencer);
  const [avatar, setAvatar] = useState({
    instagram: [],
    spotify: [],
    tiktok: [],
    facebook: [],
  });

  const [openModal, setOpenModal] = useState(false);

  const [errorsForm, setErrorsForm] = useState({
    instagram: [
      {
        musicStyle: false,
        musicStyleOther: false,
        instagramUsername: false,
        instagramLink: false,
        followersNumber: false,
        logo: false,
        price: false,
      },
    ],
    tiktok: [
      {
        musicStyle: false,
        musicStyleOther: false,
        instagramUsername: false,
        instagramLink: false,
        followersNumber: false,
        logo: false,
        price: false,
      },
    ],
    facebook: [
      {
        musicStyle: false,
        musicStyleOther: false,
        instagramUsername: false,
        instagramLink: false,
        followersNumber: false,
        logo: false,
        price: false,
      },
    ],
    spotify: [
      {
        musicStyle: false,
        musicStyleOther: false,
        instagramUsername: false,
        instagramLink: false,
        followersNumber: false,
        logo: false,
        price: false,
      },
    ],
    soundcloud: [
      {
        musicStyle: false,
        musicStyleOther: false,
        instagramUsername: false,
        instagramLink: false,
        followersNumber: false,
        logo: false,
        price: false,
      },
    ],
    press: [
      {
        musicStyle: false,
        musicStyleOther: false,
        instagramUsername: false,
        instagramLink: false,
        followersNumber: false,
        logo: false,
        price: false,
      },
    ],
    firstName: false,
    email: false,
    phone: false,
    password: false,
    repeatPassword: false,
  });

  const [errorLogo, setErrorLogo] = useState(false);
  const [fileImage, setFile] = useState({
    instagram: [],
    spotify: [],
    tiktok: [],
    facebook: [],
  });

  const handleAvatar = (file, index, socialName) => {
    if (file && file.type.match("image.*")) {
      setFile({...fileImage, [socialName]: [...fileImage[socialName], file]});
      const reader = new FileReader();

      reader.onload = (e) => {
        if (avatar[socialName][index]) {
          let avatarNew = avatar[socialName];
          avatarNew[index] = { url: e.target.result };
          const newAvatarData = { ...avatar, [socialName]: [...avatarNew] }
          return setAvatar(newAvatarData);
          // return setAvatar([...avatarNew]);
        }
        let avatarNew = avatar[socialName];
        avatarNew.push({ url: e.target.result })
        const avatarArrayNew = { ...avatar, [socialName]: [...avatarNew] }
        setAvatar(avatarArrayNew);
        // setAvatar([...avatar, { url: e.target.result }]);
      };

      reader.readAsDataURL(file);
    }
  };

  const nextForm = async () => {
    let errorsList = {
      firstName: false,
      musicStyle: false,
      musicStyleOther: false,
      instagram: errorsForm.instagram,
      followersNumber: false,
      email: false,
      phone: false,
      price: false,
      password: false,
      repeatPassword: false,
    };
    if (!dataForm.firstName) {
      errorsList = { ...errorsList, firstName: true };
    }

    if (!dataForm.musicStyle) {
      errorsList = { ...errorsList, musicStyle: true };
    }
    if (dataForm.musicStyle === "Other" && !dataForm.musicStyleOther) {
      errorsList = { ...errorsList, musicStyleOther: true };
    }

    if (!validateEmail(dataForm.email)) {
      errorsList = { ...errorsList, email: true };
    }
    if (!dataForm.phone) {
      errorsList = { ...errorsList, phone: true };
    }

    if (!dataForm.password) {
      errorsList = { ...errorsList, password: true };
    }

    let dataFormNew = dataForm;

    if (!fileImage || fileImage.length === 0) {
      return; // Nothing to upload
    }

    try {

      const getLinkToAvatar = async (socialName) => {
        return await Promise.all(
          dataFormNew[socialName].map(async (item, index) => {
            if (index < fileImage[socialName].length) {
              const file = fileImage[socialName][index];

              const formData = new FormData();
              formData.append("file", file);

              const responseURL = await axios.post(
                `${process.env.REACT_APP_SERVER}/promos/uploadScreenshot`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
              console.log(responseURL.data);
              if (responseURL.data) {
                return { ...item, logo: responseURL.data.data }; // Updated item
              }
            }

            return item; // No changes needed
          })
        );
      };
      // Create a deep copy of dataFormNew to ensure immutability
      let updatedDataFormNew = {
        ...dataFormNew
      };
      // TODO: refactor it 
      if(dataFormNew.instagram.length>0){
        updatedDataFormNew.instagram = await getLinkToAvatar('instagram')
      }

      if(dataFormNew.spotify.length>0){
        updatedDataFormNew.spotify = await getLinkToAvatar('spotify')
      }

      // Replace dataFormNew with the updated version (assuming you want to update)
      dataFormNew = updatedDataFormNew;
    } catch (error) {
      console.error("ERROR UPLOAD SCREENSHOT", error);
    }
    console.log(dataForm, " dataForm");
    let checkInstagram = false;
    const checkFormErrorInstagram = errorsForm.instagram.map((item, index) => {
      let instagramUsername = !Boolean(
        dataForm.instagram[index].instagramUsername
      );
      let instagramLink = !Boolean(dataForm.instagram[index].instagramLink);
      let followersNumber = !Boolean(dataForm.instagram[index].followersNumber);
      let price = !Boolean(dataForm.instagram[index].price);
      let musicStyle = !Boolean(dataForm.instagram[index].musicStyle);
      // let musicStyleOther = !Boolean(dataForm.instagram[index].musicStyleOther);

      if (
        instagramUsername ||
        instagramLink ||
        followersNumber ||
        price ||
        musicStyle
      )
        checkInstagram = true;

      return {
        musicStyle,
        instagramUsername,
        instagramLink,
        followersNumber,
        price,
      };
    });

    errorsList = { ...errorsList, instagram: checkFormErrorInstagram };

    if (
      !dataForm.firstName ||
      !dataForm.email ||
      checkInstagram ||
      !dataForm.phone ||
      !dataForm.password
    ) {
      return setErrorsForm(errorsList);
    }

    if (dataForm.password !== dataForm.repeatPassword) {
      return setErrorsForm({ ...errorsList, repeatPassword: true });
    }
    if (!dataForm.acceptAgree) return;
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER}/auth/create/influencer`,
        {
          firstName: dataForm.firstName,
          instagram: dataFormNew.instagram,
          spotify: dataFormNew.spotify,
          email: dataForm.email,
          phone: dataForm.phone,
          password: dataForm.password,
        }
      );

      if (result.data.code === 201) {
        const requestToken = await axios.post(
          `${process.env.REACT_APP_SERVER}/auth/login/influencer`,
          {
            email: dataForm.email,
            password: dataForm.password,
          }
        );
        localStorage.setItem("token", requestToken.data.token);
        dispatch(setSignupClear());
        setOpenModal(true);
      }

      if (
        result.data.code === 409 &&
        result.data.message === "This instagram already exists"
      ) {
        return setErrorsForm({
          ...errorsForm,
          instagram: errorsForm.instagram.map((item) => ({
            ...item,
            instagramUsername: true,
          })),
        });
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

  

  const handleDispatchSetSocial = (key, value, socialName, index, item) => {
    dispatch(
      setInstagram({
        index,
        data: { ...item, [key]: value },
        socialName
      })
    );
  }

  const handleSocialError = (key,index, socialName) => {
    const socialErrors = errorsForm[socialName.db];
    socialErrors[index][key] = false;
    setErrorsForm({
      ...errorsForm,
      [socialName.db]: socialErrors,
    });
  }

  const [typeAcc, setTypeAcc] = useState(typeOfAccounts[0].publicLink);

  const generateTypeOfAccount = () => {
    const socialName = typeOfAccounts.find((item)=>item.publicLink===typeAcc)

    return (
      <div className="instagram-select">
        {dataForm[socialName.db].map((item, index) => (
          <div className="instagram-select-item" key={index}>
            <SelectedInput
              data={["Techno", "EDM", "House", "Other"]}
              changeValue={(value) => {
                handleDispatchSetSocial(
                  "musicStyle",
                  value,
                  socialName.db,
                  index,
                  item
                );
                handleSocialError("musicStyle",index, socialName);
              }}
              title={`(${index + 1}) Music style*`}
              placeholder={
                dataForm[socialName.db][index].musicStyle === ""
                  ? "Сhoose music style"
                  : dataForm[socialName.db][index].musicStyle
              }
              style={{
                maxWidth: "665px",
                margin: "0 auto 60px auto",
              }}
              error={errorsForm[socialName.db][index].musicStyle}
            />
            {dataForm[socialName.db][index].musicStyle === "Other" ? (
              <TextInput
                title={`(${index + 1}) Music Style Other*`}
                placeholder="Enter music style other"
                style={{
                  maxWidth: "665px",
                  margin: "0 auto 60px auto",
                }}
                value={dataForm[socialName.db][index].musicStyleOther}
                setValue={(value) =>
                  handleDispatchSetSocial(
                    "musicStyleOther",
                    value,
                    socialName.db,
                    index, item
                  )
                }
                error={errorsForm[socialName.db][index].musicStyleOther}
                onFocus={() => {
                  handleSocialError("musicStyleOther",index, socialName);
                }}
              />
            ) : (
              <></>
            )}
            <TextInput
              title={
                dataForm.instagram.length === 1
                  ? `${socialName.publicLink} username*`
                  : `(${index + 1}) ${socialName.publicLink} username*`
              }
              placeholder={`Enter ${socialName.publicLink} username`}
              style={{ margin: "0 auto 60px auto" }}
              value={item.instagramUsername}
              setValue={(value) =>
                handleDispatchSetSocial(
                  "instagramUsername",
                  value,
                  socialName.db,
                  index,
                  item
                )
              }
              error={errorsForm[socialName.db][index].instagramUsername}
              onFocus={() => {
                handleSocialError("instagramUsername",index, socialName);
              }}
            />

            <TextInput
              title={
                dataForm.instagram.length === 1
                  ? `${socialName.publicLink} link*`
                  : `(${index + 1}) ${socialName.publicLink} link*`
              }
              placeholder={`Enter ${socialName.publicLink} link`}
              style={{ margin: "0 auto 60px auto" }}
              value={item.instagramLink}
              setValue={(value) =>
                handleDispatchSetSocial(
                  "instagramLink",
                  value,
                  socialName.db,
                  index,
                  item
                )
              }
              error={errorsForm[socialName.db][index].instagramLink}
              onFocus={() => {
                handleSocialError("instagramLink",index, socialName);
              }}
            />
            {index === 0 ? (
              <></>
            ) : (
              <button
                type="button"
                className="instagram-select-item-delete"
                onClick={() => {
                  const editErrorFormInstagram = errorsForm[
                    socialName.db
                  ].filter((_, itemIndex) => itemIndex !== index);
                  setErrorsForm({
                    ...errorsForm,
                    [socialName.db]: editErrorFormInstagram,
                  });
                  dispatch(
                    setInstagramDelete({ index, socialName: socialName.db })
                  );
                }}
              >
                <img
                  className="instagram-select-item-delete-icon"
                  src={deleteIcon}
                />
              </button>
            )}
            {/* Followers Number */}
            <TextInput
              title={
                dataForm.instagram.length === 1
                  ? "Followers number*"
                  : `(${index + 1}) Followers number*`
              }
              placeholder="Enter followers number"
              style={{
                margin: "0 auto 60px auto",
              }}
              value={item.followersNumber}
              setValue={(value) =>
                handleDispatchSetSocial(
                  "followersNumber",
                  value,
                  socialName.db,
                  index,
                  item
                )
              }
              error={errorsForm[socialName.db][index].followersNumber}
              onFocus={() => {
                handleSocialError("followersNumber",index, socialName);
              }}
            />

            {avatar[socialName.db][index] && (
              <img
                style={{ marginTop: "20px", maxWidth: "70px" }}
                src={avatar[socialName.db][index]?.url}
              />
            )}
            <InputFile
              title={
                dataForm[socialName.db].length === 1
                  ? "Logo Link*"
                  : `(${index + 1}) Logo Link*`
              }
              placeholder="logo"
              style={{ marginBottom: "50px", marginTop: "50px" }}
              setValue={(value) => handleAvatar(value, index, socialName.db)}
              error={errorLogo}
              className={"instagram-select-item-file"}
            />

            {/* Price */}
            <TextInput
              title={
                dataForm.instagram.length === 1
                  ? `Price for 1 ${socialName.publicLink} Post & Story, include your currency*`
                  : `(${index + 1}) Price for 1 ${
                      socialName.publicLink
                    } Post & Story, include your currency*`
              }
              placeholder={`Enter Price for 1 ${socialName.publicLink} Post & Story, include your currency*`}
              style={{
                margin:
                  dataForm[socialName.db].length === index + 1
                    ? "0 auto 0px auto"
                    : "0 auto 60px auto",
              }}
              value={item.price}
              setValue={(value) =>
                handleDispatchSetSocial(
                  "price",
                  value,
                  socialName.db,
                  index,
                  item
                )
              }
              error={errorsForm[socialName.db][index].price}
              onFocus={() => {
                handleSocialError("price",index, socialName);
              }}
            />
          </div>
        ))}
        <StandardButton
          text={`Add a New ${socialName.publicLink} Account`}
          style={{ fontSize: 15, margin: "10px auto 0 auto" }}
          onClick={() => {
            const socialName = typeOfAccounts.find((item)=>item.publicLink===typeAcc)

            setErrorsForm({
              ...errorsForm,
              [socialName.db]: [
                ...errorsForm[socialName.db],
                { instagramUsername: false, followersNumber: false },
              ],
            });
            dispatch(setInstagramAdd({ socialName: socialName.db }));
          }}
        />
      </div>
    );
  };

  return (
    <>
      <section className="signup-client">
        <div className="container-form">
          <div className="signup-client-block">
            <TitleSection
              title="Add Your details here
              to get approved as"
              span="an influencer"
            />

            <FormContainer style={{ marginTop: "60px" }}>
              <form className="signup-client-form">
                <TextInput
                  title="First name*"
                  placeholder="Enter name"
                  style={{ maxWidth: "665px", margin: "30px auto 60px auto" }}
                  value={dataForm.firstName}
                  setValue={(value) => dispatch(setFirstName(value))}
                  error={errorsForm.firstName}
                  onFocus={() =>
                    setErrorsForm({ ...errorsForm, firstName: false })
                  }
                />
                <SelectedInput
                  data={typeOfAccounts.map(({ publicLink }) => publicLink)}
                  changeValue={setTypeAcc}
                  title={`Type of Account*`}
                  placeholder={typeAcc}
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto 60px auto",
                  }}
                />

                {generateTypeOfAccount()}

                <TextInput
                  title="Email*"
                  placeholder="Enter email"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  value={dataForm.email}
                  setValue={(value) => dispatch(setEmail(value))}
                  error={errorsForm.email}
                  onFocus={() => setErrorsForm({ ...errorsForm, email: false })}
                />

                <TextInput
                  title="Phone*"
                  placeholder="+_ _ ___ ___ __ __"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  value={dataForm.phone}
                  setValue={(value) => dispatch(setPhone(value))}
                  error={errorsForm.phone}
                  onFocus={() => setErrorsForm({ ...errorsForm, phone: false })}
                />

                <TextInput
                  type="password"
                  title="Password"
                  placeholder="Enter password"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  value={dataForm.password}
                  setValue={(value) => dispatch(setPassword(value))}
                  error={errorsForm.password}
                  onFocus={() =>
                    setErrorsForm({ ...errorsForm, password: false })
                  }
                />
                <TextInput
                  type="password"
                  title="Repeat Password"
                  placeholder="Repeat Password"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  value={dataForm.repeatPassword}
                  setValue={(value) => dispatch(setRepeatPassword(value))}
                  error={errorsForm.repeatPassword}
                  onFocus={() =>
                    setErrorsForm({ ...errorsForm, repeatPassword: false })
                  }
                />
                <CheckBox
                  page="influencer"
                  text="Agree to"
                  linkText="terms and conditions"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  checked={dataForm.acceptAgree}
                  setChecked={(value) => dispatch(setAcceptAgree(value))}
                />

                <StandardButton
                  text="Apply now"
                  style={{ margin: "70px auto 0 auto" }}
                  onClick={nextForm}
                />
              </form>
            </FormContainer>

            <ModalWindow isOpen={openModal} setClose={setOpenModal}>
              <div className="signup-client-modal">
                <img className="signup-client-modal-icon" src={acceptIcon} />

                <h2 className="signup-client-modal-title">Internal approval</h2>

                <p className="signup-client-modal-second">
                  Thank you for sharing your information.
                </p>

                <p className="signup-client-modal-desc">
                  We've got it and our team will review it carefully. If it fits
                  our criteria, we'll let you know. Thanks for your patience,
                  and we'll keep you posted.
                </p>

                <StandardButton
                  text="Ok"
                  style={{
                    padding: "8px 80px",
                    marginTop: "30px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  onClick={() => navigation("/account/influencer")}
                />
              </div>
            </ModalWindow>
          </div>
        </div>
        <NotificationContainer />
      </section>
    </>
  );
};

export default SignupInfluencer;
