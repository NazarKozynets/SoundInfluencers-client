import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentWindow: 0,
    firstName: "",
    email: "",
    phone: "",
    password: "",
    selectedSocialMedia: "",
    attachedSocialMediaAccounts: [],
    currentAccountId: "",
};

export const signupInfluencerSlice = createSlice({
    name: "signup-influencer",
    initialState,
    reducers: {
        setFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPhone: (state, action) => {
            state.phone = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setCurrentWindow: (state, action) => {
            state.currentWindow = action.payload;
        },
        setSelectedSocialMedia: (state, action) => {
            state.selectedSocialMedia = action.payload;
        },
        setSignupClear: (state) => {
            state.firstName = "";
            state.email = "";
            state.phone = "";
            state.password = "";
            state.currentWindow = 0;
            state.selectedSocialMedia = "";
            state.attachedSocialMediaAccounts = [];
            state.currentAccountId = "";
        },
        setNewSocialMediaAccount: (state, action) => {
            state.attachedSocialMediaAccounts.push(action.payload);
        },
        deleteSocialMediaAccount: (state, action) => {
            const accountId = action.payload;
            state.attachedSocialMediaAccounts = state.attachedSocialMediaAccounts.filter(
                (account) => account._id !== accountId
            );
        },
        setCurrentAccountId: (state, action) => {
            state.currentAccountId = action.payload;
        },
        updateCurrentAccountId: (state, action) => {
            state.attachedSocialMediaAccounts = state.attachedSocialMediaAccounts.map(
                (account) => {
                    if (account._id === state.currentAccountId) {
                        return action.payload;
                    }
                    return account;
                }
            );
        }
    },
});

export const {
    setFirstName,
    setEmail,
    setPhone,
    setPassword,
    setSignupClear,
    setCurrentWindow,
    setSelectedSocialMedia,
    setNewSocialMediaAccount,
    deleteSocialMediaAccount,
    setCurrentAccountId,
    updateCurrentAccountId,
} = signupInfluencerSlice.actions;

export default signupInfluencerSlice.reducer;
