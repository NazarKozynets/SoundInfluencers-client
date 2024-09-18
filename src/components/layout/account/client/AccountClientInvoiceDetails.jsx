import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import edit from "../../../../images/icons/edit.svg";
import ModalWindow from "../../../ModalWindow";
import TextInput from "../../../form/TextInput";
import StandardButton from "../../../form/StandardButton";
import UseVerify from "../../../../hooks/useVerify";
import axios from "axios";

import { useNavigate } from "react-router-dom";


import arrow from "../../../../images/icons/arrow.svg";

const AccountClientInvoiceDetails = () => {
  const navigation = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    country: "",
    vatNumber: "",
    company: "",
  });
  const [isOpenPersonal, setIsOpenPersonal] = useState(false);
  const [dataInvoice, setDataInvoice] = useState({
    firstName: "",
    lastName: "",
    address: "",
    country: "",
    vatNumber: "",
    company: "",
  });

  const updateInvoiceDetails = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const result = await axios.put(
        `${process.env.REACT_APP_SERVER}/invoice/details`,
        { ...dataInvoice, id: dataFetch._id }
      );
      if (result.data.code === 200) {
        setData(dataInvoice);
        setIsOpenPersonal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const result = await axios(
        `${process.env.REACT_APP_SERVER}/invoice/details/one?userId=${dataFetch._id}`
      );

      if (result.data.code === 200) {
        setData(result.data.invoiceDetails);
        setDataInvoice(result.data.invoiceDetails);
        
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <section className="account-influencer-details">
        <div className="container-form">
          <div className="account-influencer-details-block" style={{position: 'relative'}}>
            <button
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 50,
                  height: 50,
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigation("/account/client")
                }}
            >
              <img src={arrow} style={{transform: "rotate(180deg)"}}/>
            </button>
            
            <div style={{marginTop: window.innerWidth < 768 ? 50 : 0}}>
              <TitleSection title="MY" span="account"/>
            </div>

            <p className="account-influencer-details-second">
              My Invoice Details
            </p>

            <div className="account-influencer-details-thoomb">
              <div className="account-influencer-details-wrapper">
                <div className="account-influencer-details-wrapper-header">
                  <p className="account-influencer-details-wrapper-header-title">
                    Personal Details
                  </p>

                  <button
                      className="account-influencer-details-wrapper-header-edit"
                      onClick={() => setIsOpenPersonal(true)}
                  >
                    <img
                        className="account-influencer-details-wrapper-header-edit-icon"
                        src={edit}
                    />
                  </button>
                </div>

                <div className="account-influencer-details-wrapper-content">
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      First name
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.firstName ? data.firstName : `No data`}
                    </p>
                  </div>
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Last name
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.lastName ? data.lastName : `No data`}
                    </p>
                  </div>

                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Address
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.address ? data.address : `No data`}
                    </p>
                  </div>
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Country
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.country ? data.country : `No data`}
                    </p>
                  </div>
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      Company
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.company ? data.company : `No data`}
                    </p>
                  </div>
                  <div className="account-influencer-details-wrapper-content-item">
                    <p className="account-influencer-details-wrapper-content-title">
                      VAT Number (only if VAT Registered)
                    </p>
                    <p className="account-influencer-details-wrapper-content-value">
                      {data.vatNumber ? data.vatNumber : `No data`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModalWindow
          header="Personal Details"
          isOpen={isOpenPersonal}
          setClose={setIsOpenPersonal}
      >
        <div className="account-influencer-details-form">
          <TextInput
              title="First name"
              placeholder="John"
              style={{marginTop: "80px"}}
              value={dataInvoice.firstName}
              setValue={(value) =>
              setDataInvoice({ ...dataInvoice, firstName: value })
            }
          />
          <TextInput
            title="Last name"
            placeholder="Doe"
            style={{ marginTop: "50px" }}
            value={dataInvoice.lastName}
            setValue={(value) =>
              setDataInvoice({ ...dataInvoice, lastName: value })
            }
          />

          <TextInput
            title="Address"
            placeholder="16212TH Avenue NY. Manhattan AB TIR"
            style={{ marginTop: "50px" }}
            value={dataInvoice.address}
            setValue={(value) =>
              setDataInvoice({ ...dataInvoice, address: value })
            }
          />
          <TextInput
            title="Country"
            placeholder="
            USA"
            style={{ marginTop: "50px" }}
            value={dataInvoice.country}
            setValue={(value) =>
              setDataInvoice({ ...dataInvoice, country: value })
            }
          />
          <TextInput
            title="Company"
            placeholder="Company"
            style={{ marginTop: "50px" }}
            value={dataInvoice.company}
            setValue={(value) =>
              setDataInvoice({ ...dataInvoice, company: value })
            }
          />

          <TextInput
            title="VAT Number (only if VAT Registered)"
            placeholder="1234 5678 9012 3456"
            style={{ marginTop: "50px" }}
            value={dataInvoice.vatNumber}
            setValue={(value) =>
              setDataInvoice({ ...dataInvoice, vatNumber: value })
            }
          />

          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StandardButton
              text="Save changes"
              onClick={updateInvoiceDetails}
            />
          </div>
        </div>
      </ModalWindow>
    </>
  );
};

export default AccountClientInvoiceDetails;
