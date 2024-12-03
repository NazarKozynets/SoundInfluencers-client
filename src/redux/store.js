import { configureStore } from "@reduxjs/toolkit";
import signupClientReducer from "./slice/signup-client";
import signupInfluencerReducer from "./slice/signup-influencer";
import authenticatedReducer from "./slice/authenticated";
import createInvoiceReducer from "./slice/create-invoice";
import createPromoReducer from "./slice/create-promo";
import adminEditInvoiceReducer from "./slice/admin-edit-invoice";
import adminOffersReducer from "./slice/admin-offers"
import influencerDetailsReducer from "./slice/influencer-details";

export const store = configureStore({
  reducer: {
    signupClient: signupClientReducer,
    signupInfluencer: signupInfluencerReducer,
    authenticated: authenticatedReducer,
    createInvoice: createInvoiceReducer,
    createPromo: createPromoReducer,
    adminEditInvoice: adminEditInvoiceReducer,
    adminOffers: adminOffersReducer,
    influencerDetails: influencerDetailsReducer,
  },
});
