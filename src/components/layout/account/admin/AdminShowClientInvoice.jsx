import React from "react";
import {formatDateStringReport} from "../../../../utils/validations";

const AdminShowClientInvoice = (fieldsForChange) => {
    const invoiceData = {
        date: fieldsForChange.createdAt ? formatDateStringReport(fieldsForChange.createdAt) : 'N/A',
        invoiceNo: fieldsForChange._id,
        billTo: {
            companyName: fieldsForChange.companyName || 'N/A',
            chamberOfCommerce: '10458319',
            email: 'admin@soundinfluencers.com',
            phone: '+44 7537 129190',
            address: '124 City Road, EC1V 2NX, London, England - UK'
        },
        description: 'campaign',
        total: `${fieldsForChange.amount}€`,
        subtotal: `${fieldsForChange.amount}€`,
        balanceDue: `${fieldsForChange.amount}€`,
        paymentTerms: 'Within 7 business days'
    };

    return (
        <div style={{padding: '20px', maxWidth: '800px', fontFamily: 'Geometria',}}>
            <h1 style={{textAlign: 'left'}}>INVOICE</h1>
            <div
                style={{marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{textAlign: 'left'}}>
                    <p style={{margin: '0'}}>21 Curven Road</p>
                    <p style={{margin: '0'}}>London UK</p>
                </div>
                <div style={{textAlign: 'right'}}>
                    <p style={{margin: '0 75px 0 0'}}>DATE: {invoiceData.date}</p>
                    <p style={{margin: '0', textAlign: "left"}}>
                        INVOICE NO.:<br/> {invoiceData.invoiceNo}
                    </p>
                </div>
            </div>
            <h3 style={{marginTop: 20}}>BILL TO</h3>
            <p style={{margin: '0'}}>{invoiceData.billTo.companyName}</p>
            <p style={{margin: '0'}}>Chamber of Commerce: {invoiceData.billTo.chamberOfCommerce}</p>
            <p style={{margin: '0'}}>Email Address: {invoiceData.billTo.email}</p>
            <p style={{margin: '0'}}>Phone number: {invoiceData.billTo.phone}</p>
            <p style={{margin: '0'}}>{invoiceData.billTo.address}</p>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20}}>
                <div>
                    <h3>DESCRIPTION</h3>
                    <p>{invoiceData.description}</p>
                    <h3 style={{marginTop: 20}}>SUBTOTAL:</h3>
                    <h3 style={{}}>BALANCE DUE:</h3>
                </div>
                <div>
                    <h3 style={{textAlign: 'right'}}>TOTAL:</h3>
                    <h3 style={{textAlign: 'right'}}>{invoiceData.total}</h3>
                    <h3 style={{textAlign: 'right', marginTop: 20}}>{invoiceData.subtotal}</h3>
                    <h3 style={{textAlign: 'right'}}>{invoiceData.balanceDue}</h3>
                </div>
            </div>
            <p style={{margin: '20px 0 0 0'}}>Payment Terms: {invoiceData.paymentTerms}</p>
        </div>
    );
}

export default AdminShowClientInvoice;