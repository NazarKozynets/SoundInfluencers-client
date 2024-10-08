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
import editImg from "../../../../images/icons/edit 1.svg";
import shareImg from "../../../../images/icons/Share.svg";
import mailImg from "../../../../images/icons/mail (1) 1.svg";
import StandardButton from "../../../form/StandardButton";
import AdminShowClientInvoice from "./AdminShowClientInvoice";

const AdminInvoicesClients = () => {
    const [data, setData] = useState([]);
    const [searchResut, setSearchResult] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);
    const [isShowModalPublicLink, setIsShowModalPublicLink] = useState(false);
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    
    const [fieldsForChange, setFieldsForChange] = useState({
        _id: '',
        orderId: '',
        userId: '',
        campaignName: '',
        statusOrder: '',
        amount: '',
        createdAt: '',
        companyName: '',
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
                    orderId: '',
                    userId: '',
                    campaignName: '',
                    statusOrder: '',
                    amount: '',
                    createdAt: '',
                    companyName: '',
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
                statusOrder: invoice.statusOrder,
                createdAt: invoice.createdAt,
                campaignName: invoice.campaignName,
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
                `${process.env.REACT_APP_SERVER}/admin/invoices-clients/update`,
                {
                    _id: fieldsForChange._id,
                    orderId: fieldsForChange.orderId,
                    userId: fieldsForChange.userId,
                    campaignName: fieldsForChange.campaignName,
                    companyName: fieldsForChange.companyName,
                    amount: fieldsForChange.amount,
                    statusOrder: fieldsForChange.statusOrder,
                }
            );
            if (result.status === 200) {
                await updateInvoiceData(fieldsForChange._id);
                setFieldsForChange({
                    _id: '',
                    orderId: '',
                    userId: '',
                    campaignName: '',
                    statusOrder: '',
                    amount: '',
                    createdAt: '',
                    companyName: '',
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updateInvoiceData = async (id) => {
        const result = await axios.get(
            `${process.env.REACT_APP_SERVER}/admin/invoices-clients/getOne/${id}`,
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
                `${process.env.REACT_APP_SERVER}/admin/invoices-clients/getAll`
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
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/payment/download`, {
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

    return (
        <section className="admin">
            <div>
                <div className="admin-title-section">
                    <button onClick={() => navigate('/admin/home')}>
                        <img src={backBtn} style={{transform: "rotate(180deg)"}}/>
                    </button>
                    <TitleSection title='Invoice' span='Clients'/>
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
                                    <AdminShowClientInvoice isEdit={false} fieldsForChange={fieldsForChange}/>
                                </ModalWindow>
                            )}

                            {isShowModalEdit && (
                                <ModalWindow isOpen={isShowModalEdit} setClose={() => {
                                    setIsShowModalEdit(false);
                                }}>
                                    <AdminShowClientInvoice isEdit={true} fieldsForChange={fieldsForChange}/>
                                </ModalWindow>
                            )}

                            {isShowModalPublicLink && (
                                <ModalWindow isOpen={isShowModalPublicLink} setClose={() => {
                                    setIsShowModalPublicLink(false);
                                }}>
                                    <div style={{padding: '20px', maxWidth: '1000px', fontFamily: 'Geometria',}}>
                                        <h1 style={{textAlign: 'center'}}>PUBLIC LINK</h1>
                                        <p style={{textAlign: "center", marginTop: 10, width: '100%'}}>https://nazar.soundinfluencers.com/invoice-download/{fieldsForChange._id}</p>
                                        <StandardButton style={{
                                            margin: '0 auto',
                                            marginTop: '20px',
                                            width: '100%',
                                        }} text='Copy Link' isBlue={true} onClick={() => {
                                            // navigator.clipboard.writeText(`https://nazar.soundinfluencers.com/invoice-download/${fieldsForChange._id}`)
                                            navigator.clipboard.writeText(`http://localhost:3000/invoice-download/${fieldsForChange._id}`)
                                                .then(() => {
                                                })
                                                .catch(err => {
                                                    console.error('Failed to copy the link: ', err);
                                                });
                                        }}/>
                                    </div>
                                </ModalWindow>
                            )}

                            <div className="admin-table-container">
                                <table className="admin-table" style={{width: '75%'}}>
                                    <thead className="admin-table-header">
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Company</th>
                                        <th>Campaign Name</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
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
                                                    value={formatDateStringReport(searchResut.createdAt)}
                                                    readOnly={true}
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
                                            <td className="admin-table-body-td" style={{width: 130}}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    padding: 3,
                                                    gap: '8px',
                                                    marginLeft: -6,
                                                }}>
                                                    <button
                                                        onClick={() => {
                                                            setIsShowModal(true);
                                                        }}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            width: 52,
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
                                                        <img src={editImg} alt="watch"/>
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
                                                    <button
                                                        onClick={() => downloadInvoice(searchResut._id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            paddingLeft: 5,
                                                            paddingRight: 5,
                                                            borderRadius: "10px",
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            marginLeft: 0
                                                        }}>
                                                        <img style={{width: 17}} src={shareImg} alt="share"/>
                                                    </button>
                                                    <button
                                                        onClick={() => downloadInvoice(searchResut._id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            paddingLeft: 5,
                                                            paddingRight: 5,
                                                            borderRadius: "10px",
                                                            border: "1.5px solid black",
                                                            boxSizing: 'border-box',
                                                            cursor: 'pointer',
                                                            marginLeft: 0
                                                        }}>
                                                        <img style={{width: 17}} src={mailImg} alt="mail"/>
                                                    </button>
                                                </div>
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
                                                    value={fieldsForChange._id === searchResut._id ? fieldsForChange.statusOrder : searchResut.statusOrder}
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
                                                        // onChange={(e) => updateInvoiceFieldsInput(e)}
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
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange.campaignName : (invoice.campaignName ? invoice.campaignName : 'N/A')}
                                                        name="campaignName"
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
                                                <td className="admin-table-body-td" style={{width: 130}}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        padding: 3,
                                                        gap: '8px',
                                                        marginLeft: -6,
                                                    }}>
                                                        <button
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                width: 52,
                                                                height: 28,
                                                                borderRadius: "10px",
                                                                paddingLeft: 3,
                                                                paddingRight: 3,
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                margin: 0
                                                            }}>
                                                            <img onClick={() => {
                                                                setIsShowModal(true);
                                                            }}
                                                                 src={watch}
                                                                 alt="watch"
                                                            />
                                                            <img onClick={() => {
                                                                setIsShowModalEdit(true);
                                                                console.log('edit');
                                                            }}
                                                                 src={editImg}
                                                                 alt="watch"
                                                            />
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
                                                        <button
                                                            onClick={() => setIsShowModalPublicLink(true)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 5,
                                                                paddingRight: 5,
                                                                borderRadius: "10px",
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                marginLeft: 0
                                                            }}>
                                                            <img style={{width: 17}} src={shareImg} alt="share"/>
                                                        </button>
                                                        <button
                                                            onClick={() => downloadInvoice(invoice._id)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 5,
                                                                paddingRight: 5,
                                                                borderRadius: "10px",
                                                                border: "1.5px solid black",
                                                                boxSizing: 'border-box',
                                                                cursor: 'pointer',
                                                                marginLeft: 0
                                                            }}>
                                                            <img style={{width: 17}} src={mailImg} alt="mail"/>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="admin-table-body-td"
                                                    style={{width: 90, margin: 0, padding: 0}}>
                                                    <input
                                                        style={{
                                                            fontFamily: "Geometria",
                                                            fontSize: 15,
                                                            fontWeight: 400,
                                                            textAlign: "center",
                                                            margin: 0,
                                                            padding: 0,
                                                            width: '100%',
                                                        }}
                                                        value={fieldsForChange._id === invoice._id ? fieldsForChange.statusOrder : (invoice.statusOrder ? invoice.statusOrder : 'N/A')}
                                                        name="statusOrder"
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

export default AdminInvoicesClients;