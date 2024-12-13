import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    influencerApprovedAccounts: [],
};

export const influencerApprovedAccountsSlice = createSlice({
    name: "influencer-approved-accounts",
    initialState,
    reducers: {
        setInfluencerApprovedAccounts: (state, action) => {
            state.influencerApprovedAccounts = action.payload;
        },
        setInfluencerApprovedAccountsClear: (state) => {
            state.influencerApprovedAccounts = [];
        },
    },
});

export const {setInfluencerApprovedAccounts, setInfluencerApprovedAccountsClear} = influencerApprovedAccountsSlice.actions;

export default influencerApprovedAccountsSlice.reducer;