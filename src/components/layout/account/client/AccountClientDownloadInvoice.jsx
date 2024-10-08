import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Loading from "../../../form/PageLoading/pageLoading";
import TitleSection from "../../../TitleSection";

const AccountClientDownloadInvoice = () => {
    const [isDownloaded, setIsDownloaded] = useState(false);

    const { invoiceId } = useParams();

    const downloadInvoice = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/payment/download`, {
                params: { invoiceId }, // Pass invoiceId as an object
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${invoiceId}.pdf`);

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            setIsDownloaded(true);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        downloadInvoice();
    }, []);
    
    return (
        <div>
            {isDownloaded ? (
                <div>
                    <TitleSection title="Invoice downloaded" />
                </div>
            ) : (<Loading />)}
        </div>
    );
}

export default AccountClientDownloadInvoice;