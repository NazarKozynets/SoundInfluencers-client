import { createSlice } from "@reduxjs/toolkit";

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
        selectPriceInfluencers: [],
        campaignName: "",
        paymentType: "",
        paymentStatus: "wait",
        createdAt: "",
        videos: [
            {
                videoLink: "",
                postDescription: "",
                storyTag: " ",
                swipeUpLink: " ",
                specialWishes: " ",
            },
        ],
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
            state.data.currency = action.payload;
        },
        setSelectPrice: (state, action) => {
            state.data.selectPrice = action.payload;
        },
        setSelectPriceInfluencers: (state, action) => {
            state.data.selectPriceInfluencers = action.payload;
        },
        setSelectAmount: (state, action) => {
            state.data.amount = action.payload;
        },
        setSelectInfluencer: (state, action) => {
            state.data.selectInfluencers = action.payload;
        },
        updateSelectInfluencer: (state, action) => {
            state.data.selectInfluencers = action.payload;
        },
        setCampaignName: (state, action) => {
            state.data.campaignName = action.payload;
        },
        setPaymentType: (state, action) => {
            state.data.paymentType = action.payload;
        },
        setCreatedAt: (state, action) => {
            state.data.createdAt = action.payload;
        },
        addVideo: (state, action) => {
            const newVideo = {
                ...action.payload,
                forInfluencers: [],
            };
            state.data.videos.push(newVideo);
        },
        updateVideo: (state, action) => {
            const { index, videoData } = action.payload;
            if (state.data.videos[index]) {
                state.data.videos[index] = {
                    ...state.data.videos[index], 
                    ...videoData 
                };
            }
        },
        removeVideo: (state, action) => {
            const index = action.payload;
            if (state.data.videos[index]) {
                state.data.videos.splice(index, 1);
            }
        },
        setClearCampaignDetails: (state, action) => {
            state.data.campaignName = "";
            state.data.videos = [
                {
                    videoLink: "",
                    postDescription: "",
                    storyTag: "",
                    swipeUpLink: "",
                    specialWishes: "",
                },
            ];
            state.data.createdAt = "";
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
                selectPriceInfluencers: [],
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
    updateSelectInfluencer,
    setCampaignName,
    setPaymentType,
    setCreatedAt,
    addVideo,
    updateVideo,
    removeVideo,
    setClearForm,
    setClearCampaignDetails,
    setSelectPriceInfluencers,
} = createPromoSlice.actions;

export default createPromoSlice.reducer;
