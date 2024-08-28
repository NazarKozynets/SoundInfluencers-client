import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentWindow: 0,
    data: {
        payee: "",
        bankName: "",
        beneficiary: "",
        beneficiaryAddress: '',
        iban: '',
        vat: '',
        bankCountry: "",
        bankAccountCurrency: "",
        sortCode: "",
        accountNumber: "",
        swiftOrBic: "",
        amount: 0,
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        paypalEmail: "",
        companyName: "",
        companyId: "",
        street: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
        notes: "",
        selectedPaymentMethod: "UK BANK TRANSFER",
    },
};

export const createInvoiceSlice = createSlice({
    name: "create-invoice",
    initialState,
    reducers: {
        setCurrentWindow: (state, action) => {
            state.currentWindow = action.payload;
        },
        setPayee: (state, action) => {
            state.data.payee = action.payload;
        },
        setBankName: (state, action) => {
            state.data.bankName = action.payload;
        },
        setBeneficiary: (state, action) => {
            state.data.beneficiary = action.payload;
        },
        setBeneficiaryAddress: (state, action) => {
            state.data.beneficiaryAddress = action.payload;
        },
        setIban: (state, action) => {
            state.data.iban = action.payload;
        },
        setVat: (state, action) => {
            state.data.vat = action.payload;
        },
        setBankCountry: (state, action) => {
            state.data.bankCountry = action.payload;
        },
        setBankAccountCurrency: (state, action) => {
            state.data.bankAccountCurrency = action.payload;
        },
        setSortCode: (state, action) => {
            state.data.sortCode = action.payload;
        },
        setAccountNumber: (state, action) => {
            state.data.accountNumber = action.payload;
        },
        setSwiftOrBic: (state, action) => {
            state.data.swiftOrBic = action.payload;
        },
        setContactName: (state, action) => {
            state.data.contactName = action.payload;
        },
        setContactPhone: (state, action) => {
            state.data.contactPhone = action.payload;
        },
        setContactEmail: (state, action) => {
            state.data.contactEmail = action.payload;
        },
        setPaypalEmail: (state, action) => {
            state.data.paypalEmail = action.payload;
        },
        setCompanyName: (state, action) => {
            state.data.companyName = action.payload;
        },
        setCompanyId: (state, action) => {
            state.data.companyId = action.payload;
        },
        setStreet: (state, action) => {
            state.data.street = action.payload;
        },
        setCity: (state, action) => {
            state.data.city = action.payload;
        },
        setState: (state, action) => {
            state.data.state = action.payload;
        },
        setPostcode: (state, action) => {
            state.data.postcode = action.payload;
        },
        setCountry: (state, action) => {
            state.data.country = action.payload;
        },
        setNotes: (state, action) => {
            state.data.notes = action.payload;
        },
        setAmount: (state, action) => {
            state.data.amount = action.payload;
        },
        setSelectPaymentMethod: (state, action) => {
            state.data.selectedPaymentMethod = action.payload;
        },

        setClearForm: (state) => {
            state.currentWindow = 0;
            state.data.payee = "";
            state.data.bankName = "";
            state.data.beneficiary = "";
            state.data.beneficiaryAddress = "";
            state.data.iban = "";
            state.data.bankCountry = "";
            state.data.bankAccountCurrency = "";
            state.data.sortCode = "";
            state.data.accountNumber = "";
            state.data.swiftOrBic = "";
            state.data.amount = 0;
            state.data.contactName = "";
            state.data.contactPhone = "";
            state.data.contactEmail = "";
            state.data.paypalEmail = "";
            state.data.companyName = "";
            state.data.companyId = "";
            state.data.street = "";
            state.data.city = "";
            state.data.state = "";
            state.data.postcode = "";
            state.data.country = "";
            state.data.notes = "";
        },
        setClearFormWithoutAmount: (state) => {
            state.currentWindow = 0;
            state.data.payee = "";
            state.data.bankName = "";
            state.data.beneficiary = "";
            state.data.beneficiaryAddress = "";
            state.data.iban = "";
            state.data.bankCountry = "";
            state.data.bankAccountCurrency = "";
            state.data.sortCode = "";
            state.data.accountNumber = "";
            state.data.swiftOrBic = "";
            state.data.contactName = "";
            state.data.contactPhone = "";
            state.data.contactEmail = "";
            state.data.paypalEmail = "";
            state.data.companyName = "";
            state.data.companyId = "";
            state.data.street = "";
            state.data.city = "";
            state.data.state = "";
            state.data.postcode = "";
            state.data.country = "";
            state.data.notes = "";
        },


        setAllFormInvoice: (state, action) => {
            state.data = action.payload
        }
    },
});

export const {
    setCurrentWindow,
    setPayee,
    setBankName,
    setBeneficiary,
    setBeneficiaryAddress,
    setVat,
    setIban,
    setBankCountry,
    setBankAccountCurrency,
    setSortCode,
    setAccountNumber,
    setSwiftOrBic,
    setContactName,
    setContactPhone,
    setContactEmail,
    setPaypalEmail,
    setCompanyName,
    setCompanyId,
    setStreet,
    setCity,
    setState,
    setPostcode,
    setCountry,
    setNotes,
    setClearForm,
    setClearFormWithoutAmount,
    setAmount,
    setAllFormInvoice,
    setSelectPaymentMethod
} = createInvoiceSlice.actions;

export default createInvoiceSlice.reducer;
