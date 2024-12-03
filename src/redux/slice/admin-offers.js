import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentWindow: 0,
    offersData: [],
    influencersData: [],
    selectedSocialMedia: 'Instagram',
    isNew: false,
    newOffer: {
        connectInfluencer: [],
        followers: '? Followers Combined',
        id: 0,
        maxInfluencer: 100,
        musicStyles: [],
        network: '? Networks Included with',
        price: 0,
        story: '? IG Post & Story on'
    },
    newOffers: [],
    deletedOffers: [],
};

export const adminOffersSlice = createSlice({
    name: "admin-offers",
    initialState,
    reducers: {
        setCurrentWindow: (state, action) => {
            state.currentWindow = action.payload;
        },
        setIsNew: (state, action) => {
            state.isNew = action.payload;
        },
        setNewOffer: (state, action) => {
            state.newOffer = action.payload;
        },
        setNewOffers: (state, action) => {
            state.newOffers.push(action.payload);
        },
        removeFromNewOffers: (state, action) => {
            state.newOffers = state.newOffers.filter(offer => offer._id !== action.payload._id);
        },
        deleteOfferCompletely: (state, action) => {
            state.deletedOffers.push(action.payload);
        },
        removeFromDeletedOffers: (state, action) => {
            state.deletedOffers = state.deletedOffers.filter(offer => offer._id !== action.payload._id);
        },
        deleteGenreFromOffer: (state, action) => {
            state.deletedOffers.push(action.payload);
        },
        setSelectedSocialMedia: (state, action) => {
            state.selectedSocialMedia = action.payload;
        },
        setInfluencersData: (state, action) => {
            state.influencersData = action.payload;
        },
    },
});

export const {
    setCurrentWindow,
    setIsNew,
    setNewOffer,
    deleteOfferCompletely,
    deleteGenreFromOffer,
    setNewOffers,
    removeFromDeletedOffers,
    setSelectedSocialMedia,
    setInfluencersData,
} = adminOffersSlice.actions;

export default adminOffersSlice.reducer;