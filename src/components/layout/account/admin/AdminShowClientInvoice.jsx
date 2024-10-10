import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../../../../redux/slice/admin-edit-invoice";
import { formatDateStringReport } from "../../../../utils/validations";

const AdminShowClientInvoice = ({ isEdit }) => {
    const dispatch = useDispatch();

    const invoiceData = useSelector((state) => state.adminEditInvoice);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateField({ field: name, value }));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', fontFamily: 'Geometria' }}>
            <h1 style={{ textAlign: 'left' }}>INVOICE</h1>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'left' }}>
                    {isEdit ? (
                        <>
                            <input
                                type="text"
                                name="fromCompanyName"
                                value={invoiceData.fromCompanyName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="address"
                                value={invoiceData.address}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="townCountry"
                                value={invoiceData.townCountry}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="chamberOfCommerce"
                                value={invoiceData.chamberOfCommerce}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="email"
                                value={invoiceData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="phone"
                                value={invoiceData.phone}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        <>
                            <p style={{ margin: '0' }}>{invoiceData.fromCompanyName}</p>
                            <p style={{ margin: '0' }}>{invoiceData.address}</p>
                            <p style={{ margin: '0' }}>{invoiceData.townCountry}</p>
                            <p style={{ margin: '0' }}>Chamber of Commerce: {invoiceData.chamberOfCommerce}</p>
                            <p style={{ margin: '0' }}>Email Address: {invoiceData.email}</p>
                            <p style={{ margin: '0' }}>Phone number: {invoiceData.phone}</p>
                        </>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    {isEdit ? (
                        <>
                            <input
                                type="text"
                                name="date"
                                value={invoiceData.date ? formatDateStringReport(invoiceData.date) : 'N/A'}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        <>
                            <p style={{ margin: '0 75px 0 0' }}>DATE: {invoiceData.date}</p>
                            <p style={{ margin: '0', textAlign: "left" }}>
                                INVOICE NO.:<br /> {invoiceData.invoiceNo}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <h3 style={{ marginTop: 20 }}>BILL TO</h3>
            {isEdit ? (
                <input
                    type="text"
                    name="companyName"
                    value={invoiceData.companyName}
                    onChange={handleChange}
                />
            ) : (
                <p style={{ margin: '0' }}>{invoiceData.companyName}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <div>
                    <h3>DESCRIPTION</h3>
                    {isEdit ? (
                        <input
                            type="text"
                            name="description"
                            value={invoiceData.description}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{invoiceData.description}</p>
                    )}
                    <h3 style={{ marginTop: 20 }}>SUBTOTAL:</h3>
                    <h3>BALANCE DUE:</h3>
                </div>
                <div>
                    <h3 style={{ textAlign: 'left' }}>TOTAL:</h3>
                    {isEdit ? (
                        <>
                            <input
                                type="text"
                                name="total"
                                value={invoiceData.total}
                                style={{ textAlign: 'left' }}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="subtotal"
                                value={invoiceData.subtotal}
                                style={{ textAlign: 'left', marginTop: 20 }}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="balanceDue"
                                value={invoiceData.balanceDue}
                                style={{ textAlign: 'left' }}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        <>
                            <h3 style={{ textAlign: 'right' }}>{invoiceData.total}€</h3>
                            <h3 style={{ textAlign: 'right', marginTop: 20 }}>{invoiceData.subtotal}€</h3>
                            <h3 style={{ textAlign: 'right' }}>{invoiceData.balanceDue}€</h3>
                        </>
                    )}
                </div>
            </div>

            {isEdit ? (
                <div style={{ display: 'flex' }}>
                    <h3 style={{ marginTop: 17 }}>PAYMENT TERMS:</h3>
                    <input
                        type="text"
                        name="paymentTerms"
                        value={invoiceData.paymentTerms}
                        style={{ marginTop: 20, marginLeft: 6 }}
                        onChange={handleChange}
                    />
                </div>
            ) : (
                <p style={{ margin: '20px 0 0 0' }}>Payment Terms: {invoiceData.paymentTerms}</p>
            )}
        </div>
    );
};

export default AdminShowClientInvoice;
