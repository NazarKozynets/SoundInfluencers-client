import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    invoiceNo: '',
    date: '',
    companyName: '',
    fromCompanyName: "TECHNO TV LTD",
    chamberOfCommerce: "10458319",
    email: "admin@soundinfluencers.com",
    phone: "+44 7537 129190",
    address: "124 City Road",
    townCountry: 'EC1V 2NX - London - England - UK',
    description: "campaign",
    paymentTerms: "Within 7 business days",
    total: '',
    subtotal: '',
    balanceDue: '',
    userId: '',
    additionalFields: [], 
};

export const adminEditInvoiceSlice = createSlice({
    name: "admin-edit-invoice",
    initialState,
    reducers: {
        updateField: (state, action) => {
            const {field, value} = action.payload;
            if (state[field] !== undefined) {
                state[field] = value;
            }
        },
        addField: (state, action) => {
            const {fieldName, fieldValue} = action.payload;
            state.additionalFields.push({fieldName, fieldValue});
        },
        updateAdditionalField: (state, action) => {
            const {index, fieldValue} = action.payload;
            if (state.additionalFields[index]) {
                state.additionalFields[index].fieldValue = fieldValue;
            }
        },
        updateMultipleFields: (state, action) => {
            action.payload.forEach(({ field, value }) => {
                if (state[field] !== undefined) {
                    state[field] = value;
                }
            });
        },
        resetFields: (state) => {
            return initialState; 
        },
    },
});

export const {
    updateField,
    addField,
    updateAdditionalField,
    updateMultipleFields,
    resetFields,
} = adminEditInvoiceSlice.actions;
export default adminEditInvoiceSlice.reducer;
