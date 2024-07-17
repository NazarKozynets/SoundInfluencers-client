import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  company: "",
  companyType: "",
  instagram: "",
  email: "",
  phone: "",
  referalCode: "",
  username: "",
  password: "",
  repeatPassword: "",
  acceptAgree: false,
};

export const signupClientSlice = createSlice({
  name: "signup-client",
  initialState,
  reducers: {
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    setCompanyType: (state, action) => {
      state.companyType = action.payload;
    },
    setInstagram: (state, action) => {
      state.instagram = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setReferalCode: (state, action) => {
      state.referalCode = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRepeatPassword: (state, action) => {
      state.repeatPassword = action.payload;
    },
    setAcceptAgree: (state, action) => {
      state.acceptAgree = action.payload;
    },
    setSignupClear: (state) => {
      state = {
        firstName: "",
        company: "",
        companyType: "",
        instagram: "",
        email: "",
        phone: "",
        referalCode: "",
        username: "",
        password: "",
        repeatPassword: "",
        acceptAgree: false,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setFirstName,
  setCompany,
  setCompanyType,
  setInstagram,
  setEmail,
  setPhone,
  setReferalCode,
  setUsername,
  setPassword,
  setRepeatPassword,
  setAcceptAgree,
  setSignupClear,
} = signupClientSlice.actions;

export default signupClientSlice.reducer;
