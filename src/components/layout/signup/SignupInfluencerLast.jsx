// import React, { useState } from "react";
// import TitleSection from "../../TitleSection";
// import FormContainer from "../../form/FormContainer";
// import TextInput from "../../form/TextInput";
// import CheckBox from "../../form/CheckBox";
// import StandardButton from "../../form/StandardButton";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setEmail,
//   setPassword,
//   setSignupClear,
// } from "../../../redux/slice/signup-influencer";
// import axios from "axios";
// import {
//   NotificationContainer,
//   NotificationManager,
// } from "react-notifications";
//
// const SignupInfluencerLast = () => {
//   const dataForm = useSelector((state) => state.signupInfluencer);
//   const navigation = useNavigate();
//   const dispatch = useDispatch();
//   const [errorsForm, setErrorsForm] = useState({
//     username: false,
//     email: false,
//     password: false,
//     repeatPassword: false,
//   });
//
//   const register = async () => {
//     let listErrorsForm = {
//       username: false,
//       email: false,
//       password: false,
//       repeatPassword: false,
//     };
//     if (!dataForm.username) {
//       listErrorsForm = { ...listErrorsForm, username: true };
//     }
//     if (!dataForm.email) {
//       listErrorsForm = { ...listErrorsForm, email: true };
//     }
//     if (!dataForm.password) {
//       listErrorsForm = { ...listErrorsForm, password: true };
//     }
//
//     if (!dataForm.username || !dataForm.email || !dataForm.password) {
//       return setErrorsForm(listErrorsForm);
//     }
//
//     if (dataForm.password !== dataForm.repeatPassword) {
//       return setErrorsForm({ ...listErrorsForm, repeatPassword: true });
//     }
//
//     if (!dataForm.acceptAgree) return;
//     try {
//       const result = await axios.post(
//         `${process.env.REACT_APP_SERVER}/auth/create/influencer`,
//         {
//           firstName: dataForm.firstName,
//           influencerName: dataForm.influencerName,
//           musicStyle: dataForm.musicStyle,
//           instagram: dataForm.instagram,
//           followersNumber: dataForm.followersNumber,
//           email: dataForm.email,
//           phone: dataForm.phone,
//           price: dataForm.price,
//           username: dataForm.username,
//           password: dataForm.password,
//         }
//       );
//
//       if (result.data.code === 201) {
//         const requestToken = await axios.post(
//           `${process.env.REACT_APP_SERVER}/auth/login/influencer`,
//           {
//             email: dataForm.email,
//             password: dataForm.password,
//           }
//         );
//         localStorage.setItem("token", requestToken.data.token);
//         dispatch(setSignupClear());
//         navigation("/account/influencer");
//       }
//       if (result.data.code === 409) {
//         NotificationManager.error(
//           "An account with this email already exists",
//           "Error"
//         );
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
//
//   return (
//     <section className="signup-client-agreement">
//       <div className="container-form">
//         <div className="signup-client-agreement-block">
//           <TitleSection
//             title="You have now received access"
//             span="to your account"
//           />
//           <p className="signup-client-agreement-second">Create Your account:</p>
//
//           <FormContainer>
//             <form className="signup-client-agreement-form">
//               <TextInput
//                 title="Email"
//                 placeholder="Enter email"
//                 style={{ marginTop: "60px" }}
//                 value={dataForm.email}
//                 setValue={(value) => dispatch(setEmail(value))}
//                 error={errorsForm.email}
//                 onFocus={() => setErrorsForm({ ...errorsForm, email: false })}
//               />
//               <TextInput
//                 type="password"
//                 title="Password"
//                 placeholder="Enter password"
//                 style={{ marginTop: "60px" }}
//                 value={dataForm.password}
//                 setValue={(value) => dispatch(setPassword(value))}
//                 error={errorsForm.password}
//                 onFocus={() =>
//                   setErrorsForm({ ...errorsForm, password: false })
//                 }
//               />
//               <TextInput
//                 type="password"
//                 title="Repeat Password"
//                 placeholder="Repeat Password"
//                 style={{ marginTop: "60px" }}
//                 value={dataForm.repeatPassword}
//                 setValue={(value) => dispatch(setRepeatPassword(value))}
//                 error={errorsForm.repeatPassword}
//                 onFocus={() =>
//                   setErrorsForm({ ...errorsForm, repeatPassword: false })
//                 }
//               />
//               <CheckBox
//                 page="influencer"
//                 text="Agree to"
//                 linkText="terms and conditions"
//                 style={{ marginTop: "57px" }}
//                 checked={dataForm.acceptAgree}
//                 setChecked={(value) => dispatch(setAcceptAgree(value))}
//               />
//
//               <StandardButton
//                 text="Continue"
//                 style={{ margin: "0 auto", marginTop: "50px" }}
//                 // onClick={register}
//               />
//             </form>
//           </FormContainer>
//         </div>
//       </div>
//       <NotificationContainer />
//     </section>
//   );
// };
//
// export default SignupInfluencerLast;
