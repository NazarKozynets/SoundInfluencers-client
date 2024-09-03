import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentWindow: 0,
    data: {
        currency: "€",
        amount: 0,
        selectPrice: {
            variant: 0,
            price: 0,
        },
        selectInfluencers: [],
        campaignName: "",
        videoLink: "",
        postDescription: "",
        storyTag: "",
        swipeUpLink: "",
        dateRequest: "",
        specialWishes: "",
        paymentType: "",
        paymentStatus: "wait",
    },
};

export const createPromoSlice = createSlice({
    name: "create-promo",
    initialState,
    reducers: {
        setCurrentWindow: (state, action) => {
            state.currentWindow = action.payload;
        },
        setSelectCurrency: (state, action) => {
            state.data.currency = action.payload
        },
        setSelectPrice: (state, action) => {
            state.data.selectPrice = action.payload;
        },
        setSelectAmount: (state, action) => {
            state.data.amount = action.payload;
        },
        setSelectInfluencer: (state, action) => {
            state.data.selectInfluencers = action.payload;
        },
        setCampaignName: (state, action) => {
            state.data.campaignName = action.payload;
        },
        setVideoLink: (state, action) => {
            state.data.videoLink = action.payload;
        },
        setPostDescription: (state, action) => {
            state.data.postDescription = action.payload;
        },
        setDateRequest: (state, action) => {
            state.data.dateRequest = action.payload;
        },
        setStoryTag: (state, action) => {
            state.data.storyTag = action.payload;
        },
        setSwipeUpLink: (state, action) => {
            state.data.swipeUpLink = action.payload;
        },
        setSpecialWishes: (state, action) => {
            state.data.specialWishes = action.payload;
        },
        setPaymentType: (state, action) => {
            state.data.paymentType = action.payload;
        },

        setClearForm: (state) => {
            state.data = {
                currency: "€",
                amount: 0,
                selectPrice: {
                    variant: 0,
                    price: 0,
                },
                selectInfluencers: [],
                campaignName: "",
                videoLink: "",
                postDescription: "",
                storyTag: "",
                swipeUpLink: "",
                dateRequest: "",
                specialWishes: "",
                paymentType: "",
                paymentStatus: "wait",
            };
        },
    },
});

export const {
    setCurrentWindow,
    setSelectCurrency,
    setSelectPrice,
    setSelectAmount,
    setSelectInfluencer,
    setCampaignName,
    setVideoLink,
    setPostDescription,
    setDateRequest,
    setStoryTag,
    setSwipeUpLink,
    setSpecialWishes,
    setPaymentType,
    setClearForm,
} = createPromoSlice.actions;

export default createPromoSlice.reducer;
