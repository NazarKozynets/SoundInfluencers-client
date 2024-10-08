import React, {useEffect, useRef, useState} from "react";
import TitleSection from "../../../TitleSection";
import backBtn from "../../../../images/icons/arrow.svg";
import {useNavigate} from "react-router-dom";
import SearchBar from "../../../form/SearchBar/SearchBar";
import axios from "axios";
import PageLoading from "../../../form/PageLoading/pageLoading";
import {formatDateStringReport} from "../../../../utils/validations";
import watch from "../../../../images/icons/view 1.svg";
import download from "../../../../images/icons/downloads 1.svg";
import SubmitButton from "./form/Influencers/SubmitFooter/SubmitButton";
import ModalWindow from "../../../ModalWindow";

const AdminInvoicesInfluencers = () => {
    const [data, setData] = useState([]);
    const [searchResut, setSearchResult] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);

    const [fieldsForChange, setFieldsForChange] = useState({
        _id: '',
        companyName: '',
        contactEmail: '',
        amount: '',
        selectedPaymentMethod: '',
        status: '',
        createdAt: '',
    });

    const containerRef = useRef(null);
    const saveChangesRef = useRef(null);
    const showInvoiceRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                saveChangesRef.current &&
                !saveChangesRef.current.contains(event.target)
            ) {
                setFieldsForChange({
                    _id: '',
                    companyName: '',
                    contactEmail: '',
                    amount: '',
                    selectedPaymentMethod: '',
                    status: '',
                    createdAt: '',
                });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectInvoice = (invoice) => {
        if (fieldsForChange._id !== invoice._id) {
            setFieldsForChange({
                _id: invoice._id,
                companyName: invoice.companyName,
                contactEmail: invoice.contactEmail,
                amount: invoice.amount,
                selectedPaymentMethod: invoice.selectedPaymentMethod,
                status: invoice.status,
                createdAt: invoice.createdAt,
            });
        }
    };

    const updateInvoiceFieldsInput = (e) => {
        setFieldsForChange({
            ...fieldsForChange,
            [e.target.name]: e.target.value,
        });
    };

    const updateInvoiceOnServer = async () => {
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_SERVER}/admin/invoices-influencers/update`,
                {
                    _id: fieldsForChange._id,
                    companyName: fieldsForChange.companyName,
                    contactEmail: fieldsForChange.contactEmail,
                    amount: fieldsForChange.amount,
                    selectedPaymentMethod: fieldsForChange.selectedPaymentMethod,
                    status: fieldsForChange.status,
                }
            );
            if (result.status === 200) {
                await updateInvoiceData(fieldsForChange._id);
                setFieldsForChange({
                    _id: '',
                    companyName: '',
                    contactEmail: '',
                    amount: '',
                    selectedPaymentMethod: '',
                    status: '',
                    createdAt: '',
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updateInvoiceData = async (id) => {
        const result = await axios.get(
            `${process.env.REACT_APP_SERVER}/admin/invoices-influencers/getOne/${id}`,
        );
        if (result.status === 200) {
            const updatedInvoice = result.data.data;
            const updatedInvoices = data.map((invoice) => {
                if (invoice._id === updatedInvoice._id) {
                    return updatedInvoice;
                }
                return invoice;
            });
            setData(updatedInvoices);
        }
    }
    
    const searchFunction = (data, searchInput) => {
        return data.filter((item) => {
            return item.companyName.toLowerCase().includes(searchInput.toLowerCase());
        });
    };

    const getData = async () => {
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_SERVER}/admin/invoices-influencers/getAll`
            )
            if (result.status === 200) {
                setData(result.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const downloadInvoice = async (invoiceId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/invoice/download`, {
                params: {invoiceId},
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${invoiceId}.pdf`);

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading the invoice:', error);
        }
    };

    const showInvoice = () => {
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
    };

    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => navigate('/admin/home')}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title='Invoice' span='Influencers'/>
                </div>

                {data.length > 0 ? (
                    <div>
                        {fieldsForChange._id && (
                            <SubmitButton ref={saveChangesRef} onSubmit={updateInvoiceOnServer}/>
                        )}

                        <div className="admin-clients-searchbar">
                            <SearchBar setSearchResult={setSearchResult} searchFunction={searchFunction} data={data}
                                       className="large" typeOfSearch="companyNameForInvoices"/>
                        </div>

                        <div ref={containerRef}>
                            {isShowModal && (
                                <ModalWindow isOpen={isShowModal} setClose={() => {
                                    setIsShowModal(false);
                                }}>
                                    {showInvoice()}
                                </ModalWindow>
                            )}

                            <div className="admin-table-container">
                                <table className="admin-table" style={{width: '75%'}}>
                                    <thead className="admin-table-header">
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Company</th>
                                        <th>Date</th>
                                        <th>Amount €</th>
                                        <th>Amount Original</th>
                                        <th>Actions</th>
                                        <th>Payment Method</th>
                                        <th>Payment Details</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {searchResut ? (
                                        <tr onClick={() => selectInvoice(searchResut)}>
                                            <td className="admin-table-body-td" style={{width: 250}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                        height: 50
                                                    }}
                                                    value={fieldsForChange._id === searchResut._id ? fieldsForChange._id : searchResut._id}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{width: 200}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        margin: 0,
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResut._id ? fieldsForChange.companyName : (searchResut.companyName ? searchResut.companyName : 'N/A')}
                                                    name="companyName"
                                                    onChange={(e) => updateInvoiceFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{width: 111}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        margin: 0,
                                                        width: '100%',
                                                    }}
                                                    value={formatDateStringReport(searchResut.createdAt)}
                                                    readOnly={true}
                                                />
                                            </td>
                                            <td className="admin-table-body-td"
                                                style={{width: 90, margin: 0, padding: 0}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        margin: '0',
                                                        padding: 0,
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResut._id ? fieldsForChange.amount : (searchResut.amount ? searchResut.amount : 'N/A')}
                                                    name="amount"
                                                    onChange={(e) => updateInvoiceFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{width: 90}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        margin: '0',
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResut._id ? fieldsForChange.amount : (searchResut.amount ? searchResut.amount : 'N/A')}
                                                    name="amount"
                                                    onChange={(e) => updateInvoiceFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{width: 70}}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    padding: 3,
                                                    gap: '8px',
                                                    marginLeft: -6
                                                }}>
                                                    <button
                                                        onClick={() => {
                                                            setIsShowModal(true);
                                                        }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "10px",
                                                            paddingLeft: 3,
                                                            paddingRight: 3,
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            margin: 0
                                                        }}>
                                                        <img src={watch} alt="watch"/>
                                                    </button>
                                                    <button
                                                        onClick={() => downloadInvoice(searchResut._id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            width: 28,
                                                            height: 28,
                                                            paddingLeft: 5,
                                                            paddingRight: 5,
                                                            borderRadius: "10px",
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            marginLeft: 0
                                                        }}>
                                                        <img src={download} alt="download"/>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="admin-table-body-td">
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResut._id ? fieldsForChange.selectedPaymentMethod : (searchResut.selectedPaymentMethod ? searchResut.selectedPaymentMethod : 'N/A')}
                                                    name='selectedPaymentMethod'
                                                    onChange={(e) => updateInvoiceFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td" style={{width: 260}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "left",
                                                        width: '100%',
                                                    }}
                                                    value={fieldsForChange._id === searchResut._id ? fieldsForChange.contactEmail : (searchResut.contactEmail ? searchResut.contactEmail : 'N/A')}
                                                    name="contactEmail"
                                                    onChange={(e) => updateInvoiceFieldsInput(e)}
                                                />
                                            </td>
                                            <td className="admin-table-body-td"
                                                style={{width: 120, margin: 0, padding: 0}}>
                                                <input
                                                    style={{
                                                        fontFamily: "Geometria",
                                                        fontSize: 15,
                                                        fontWeight: 400,
                                                        textAlign: "center",
                                                        width: '100%',
                                                        margin: '0',
                                                    }}
                                                    value={fieldsForChange._id === searchResut._id ? fieldsForChange.status : searchResut.status}
                                                    name="status"
                                                    onChange={(e) => updateInvoiceFieldsInput(e)}
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((invoice, index) => (
                                            <tr onClick={() => selectInvoice(invoice)}>
                                                <td className="admin-table-body-td" style={{width: 250}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange._id : invoice._id}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{width: 200}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            margin: 0,
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange.companyName : (invoice.companyName ? invoice.companyName : 'N/A')}
                                                        name="companyName"
                                                        onChange={(e) => updateInvoiceFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{width: 111}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            margin: 0,
                                                            width: '100%',
                                                        }}
                                                        value={formatDateStringReport(invoice.createdAt)}
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 90, margin: 0, padding: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            margin: '0',
                                                            padding: 0,
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange.amount : (invoice.amount ? invoice.amount : 'N/A')}
                                                        name="amount"
                                                        onChange={(e) => updateInvoiceFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{width: 90}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            margin: '0',
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange.amount : (invoice.amount ? invoice.amount : 'N/A')}
                                                        name="amount"
                                                        onChange={(e) => updateInvoiceFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{width: 70}}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        padding: 3,
                                                        gap: '8px',
                                                        marginLeft: -6
                                                    }}>
                                                        <button
                                                            onClick={() => {
                                                                setIsShowModal(true);
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                width: 28,
                                                                height: 28,
                                                                borderRadius: "10px",
                                                                paddingLeft: 3,
                                                                paddingRight: 3,
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                margin: 0
                                                            }}>
                                                            <img src={watch} alt="watch"/>
                                                        </button>
                                                        <button
                                                            onClick={() => downloadInvoice(invoice._id)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                width: 28,
                                                                height: 28,
                                                                paddingLeft: 5,
                                                                paddingRight: 5,
                                                                borderRadius: "10px",
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                marginLeft: 0
                                                            }}>
                                                            <img src={download} alt="download"/>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="admin-table-body-td">
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange.selectedPaymentMethod : (invoice.selectedPaymentMethod ? invoice.selectedPaymentMethod : 'N/A')}
                                                        name='selectedPaymentMethod'
                                                        onChange={(e) => updateInvoiceFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td" style={{width: 260}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "left",
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange.contactEmail : (invoice.contactEmail ? invoice.contactEmail : 'N/A')}
                                                        name="contactEmail"
                                                        onChange={(e) => updateInvoiceFieldsInput(e)}
                                                    />
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 120, margin: 0, padding: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            width: '100%',
                                                            margin: '0',
                                                        }}
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange.status : invoice.status}
                                                        name="status"
                                                        onChange={(e) => updateInvoiceFieldsInput(e)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <PageLoading/>
                )}
            </div>
        </section>
    );
}

export default AdminInvoicesInfluencers;