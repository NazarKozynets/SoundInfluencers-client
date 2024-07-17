import React, { useEffect, useState } from "react";
import TextInput from "./components/form/TextInput";
import "./styles/main.scss";

import { Route, Routes } from "react-router-dom";
import Signup from "./pages/signup";
import SignupClient from "./pages/signup-client/signup-client";
import SignupClientAgreement from "./pages/signup-client/signup-client-agreement";
import AccountClientHome from "./pages/account/client/home";
import SignupInfluencerAgreement from "./pages/signup-influencer/signup-influencer-agreement";
import AccountInfluencerHome from "./pages/account/influencer/home";
import AccountInfluencerDetails from "./pages/account/influencer/details";
import LoginClientPage from "./pages/login/login-client";
import LoginInfluencerPage from "./pages/login/login-influencer";
import ForgotPasswordEmail from "./pages/login/forgot-password-email";
import ForgotPasswordCode from "./pages/login/forgot-password-code";
import AccountClientDetails from "./pages/account/client/details";
import AccountClientInvoiceDetails from "./pages/account/client/invoice-details";
import AccountClientPastPromos from "./pages/account/client/past-promos";
import AccountClientPastPromosCurrent from "./pages/account/client/past-promos-current";
import AccountInfluencerCreateInvoicePage from "./pages/account/influencer/create-invoice";
import AccountInfluencerInvoicesPage from "./pages/account/influencer/invoices";
import Terms from "./pages/terms-client";
import { ThemeProvider } from "./ThemeContext";
import SignupInfluencer from "./pages/signup-influencer/signup-influencer";
import UseVerify from "./hooks/useVerify";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "./redux/slice/authenticated";
import SignupInfluencerLast from "./pages/signup-influencer/signup-influencer-last";
import AccountInfluencerPastPromos from "./pages/account/influencer/past-promos";
import AccountInfluencerPastPromosCurrentPage from "./pages/account/influencer/past-promos-current";
import ReportCampaigns from "./components/layout/account/influencer/ReportCampaigns";
import ReportCampaignsPage from "./pages/account/influencer/report-campaigns";
import InvoiceResultPage from "./pages/account/influencer/invoice-result";
import AccountClientCreatePromoPage from "./pages/account/client/create-promo";
import AccountInfluencerOngoingPromos from "./pages/account/influencer/ongoing-promos";
import AccountInfluencerNewPromosPage from "./pages/account/influencer/new-promos";
import AccountInfluencerOngoingPromosCurrentPage from "./pages/account/influencer/ongoing-promos-current";
import AccountClientOngoingPromos from "./pages/account/client/ongoing-promos";
import AcountClientOngoingCurrentPage from "./pages/account/client/ongoing-promos-current";
import AccountInfluencerUpdateIngoingPromoPage from "./pages/account/influencer/update-ongoing-promo";
import StripeButton from "./components/Payment/StripeButton";
import PaypalButton from "./components/Payment/PaypalButton";
import TermsClient from "./pages/terms-client";
import TermsInfluencer from "./pages/terms-influencer";
import JivoChat from "./components/JivoChat";
import AccountClientListOffers from "./pages/account/client/chooseOffers";

const App = () => {
  return (
    <>
      <JivoChat/>
      <ThemeProvider>
        <Routes>
          <Route path="/signup" element={<PublicRoute element={Signup} />} />
          <Route
            path="/signup/client"
            element={<PublicRoute role="client" element={SignupClient} />}
          />
          <Route
            path="/signup/client/agreement"
            element={
              <PublicRoute role="client" element={SignupClientAgreement} />
            }
          />
          <Route
            path="/signup/influencer"
            element={
              <PublicRoute role="influencer" element={SignupInfluencer} />
            }
          />
          <Route
            path="/test"
            element={<PublicRoute role="influencer" element={StripeButton} />}
          />
          <Route
            path="/test2"
            element={<PublicRoute role="influencer" element={PaypalButton} />}
          />
          <Route
            path="/signup/influencer/agreement"
            element={
              <PublicRoute
                role="influencer"
                element={SignupInfluencerAgreement}
              />
            }
          />
          <Route
            path="/signup/influencer/last"
            element={
              <PublicRoute role="influencer" element={SignupInfluencerLast} />
            }
          />

          <Route
            path="/account/client"
            element={<PrivateRoute role="client" element={AccountClientHome} />}
          />

          <Route
            path="/account/client/details"
            element={
              <PrivateRoute role="client" element={AccountClientDetails} />
            }
          />
          <Route
            path="/account/client/invoice-details"
            element={
              <PrivateRoute
                role="client"
                element={AccountClientInvoiceDetails}
              />
            }
          />
          <Route
            path="/account/client/past-promos"
            element={
              <PrivateRoute role="client" element={AccountClientPastPromos} />
            }
          />
          <Route
            path="/account/client/list-promo"
            element={
              <PrivateRoute
                role="client"
                element={AccountClientListOffers}
              />
            }
          />
          <Route
            path="/account/client/instagram-promo"
            element={
              <PrivateRoute
                role="client"
                element={AccountClientCreatePromoPage}
              />
            }
          />
          <Route
            path="/account/client/past-promos/:id"
            element={
              <PrivateRoute
                role="client"
                element={AccountClientPastPromosCurrent}
              />
            }
          />
          <Route
            path="/account/client/ongoing-promos"
            element={
              <PrivateRoute
                role="client"
                element={AccountClientOngoingPromos}
              />
            }
          />
          <Route
            path="/account/client/ongoing-promos/:id"
            element={
              <PrivateRoute
                role="client"
                element={AcountClientOngoingCurrentPage}
              />
            }
          />
          <Route
            path="/account/influencer"
            element={
              <PrivateRoute role="influencer" element={AccountInfluencerHome} />
            }
          />
          <Route
            path="/account/influencer/details"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerDetails}
              />
            }
          />
          <Route
            path="/account/influencer/invoices"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerInvoicesPage}
              />
            }
          />
          <Route
            path="/account/influencer/past-promos"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerPastPromos}
              />
            }
          />
          <Route
            path="/account/influencer/past-promos/:id"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerPastPromosCurrentPage}
              />
            }
          />

          <Route
            path="/account/influencer/ongoing-promos"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerOngoingPromos}
              />
            }
          />

          <Route
            path="/account/influencer/ongoing-promos/:id/:instagram"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerOngoingPromosCurrentPage}
              />
            }
          />

          <Route
            path="/account/influencer/update-ongoing-promos/:promoId/:influencerId/:instagram"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerUpdateIngoingPromoPage}
              />
            }
          />

          <Route
            path="/account/influencer/new-promos"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerNewPromosPage}
              />
            }
          />

          <Route
            path="/account/influencer/create-invoice"
            element={
              <PrivateRoute
                role="influencer"
                element={AccountInfluencerCreateInvoicePage}
              />
            }
          />
          <Route
            path="/account/influencer/reports"
            element={
              <PrivateRoute role="influencer" element={ReportCampaignsPage} />
            }
          />
          <Route
            path="/account/influencer/invoice-result"
            element={
              <PrivateRoute role="influencer" element={InvoiceResultPage} />
            }
          />
          <Route
            path="/login/client"
            element={<PublicRoute role="client" element={LoginClientPage} />}
          />
          <Route
            path="/login/influencer"
            element={
              <PublicRoute role="influencer" element={LoginInfluencerPage} />
            }
          />
          <Route path="/forgot" element={<ForgotPasswordEmail />} />
          <Route path="/forgot/code/:email" element={<ForgotPasswordCode />} />
          <Route path="/terms-client" element={<TermsClient />} />
          <Route path="/terms-influencer" element={<TermsInfluencer />} />
          <Route path="/" element={<PublicRoute element={Signup} />} />
        </Routes>
      </ThemeProvider>
      </>
  );
};

export default App;
