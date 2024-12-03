import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentWindow: 0,
    InfluencerDetails: {},
}

export const influencerDetailsSlice = createSlice({
    name: "influencer-details",
    initialState,
    reducers: {
        setCurrentWindow: (state, action) => {
            state.currentWindow = action.payload;
        },
    }
});

export const {
    setCurrentWindow,
} = influencerDetailsSlice.actions;

export default influencerDetailsSlice.reducer;