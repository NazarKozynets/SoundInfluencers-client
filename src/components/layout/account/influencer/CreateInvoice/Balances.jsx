import React, { useState } from "react";
import acceptAll from "../../../../../images/icons/accept-all.svg";
import StandardButton from "../../../../form/StandardButton";

const CreateInvoiceBalances = () => {
  const [allBalance, setAllBalance] = useState(0);
  const [isSwitch, setIsSwitch] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  return (
    <>
      <div className="container">
        <p className="create-invoice-second">Select Balances</p>

        <p className="create-invoice-balance">
          Balance Due:
          <span className="create-invoice-balance-span"> {allBalance} $</span>
        </p>

        <p className="create-invoice-balance-decor">The Chef</p>

        <div className="create-invoice-wallet">
          <div className="create-invoice-wallet-header">
            <div
              className="create-invoice-wallet-header-all"
              style={{ flex: 1 }}
            >
              <button
                className="create-invoice-wallet-header-all-button"
                onClick={() => setSelectAll(!selectAll)}
              >
                {selectAll && (
                  <img
                    className="create-invoice-wallet-header-all-icon"
                    src={acceptAll}
                  />
                )}
              </button>
            </div>
            <p
              className="create-invoice-wallet-header-title"
              style={{ flex: 3 }}
            >
              Reference Code
            </p>
            <p
              className="create-invoice-wallet-header-title"
              style={{ flex: 3 }}
            >
              Report Name
            </p>
            <p
              className="create-invoice-wallet-header-title"
              style={{ flex: 3 }}
            >
              Balance Due
            </p>
          </div>

          <div className="create-invoice-wallet-content">
            <div className="create-invoice-wallet-content-item">
              <div style={{ flex: 1 }}>
                <button
                  className={`create-invoice-form-content-switch-input ${
                    isSwitch && "active"
                  }`}
                  onClick={() => setIsSwitch(!isSwitch)}
                >
                  <div className="create-invoice-form-content-switch-input-decor"></div>
                </button>
              </div>

              <p
                className="create-invoice-wallet-content-item-code"
                style={{ flex: 3 }}
              >
                Trans-10021
              </p>
              <p
                className="create-invoice-wallet-content-item-name"
                style={{ flex: 3 }}
              >
                The Chef
              </p>
              <p
                className="create-invoice-wallet-content-item-due"
                style={{ flex: 3 }}
              >
                50.1 USD
              </p>
            </div>
            <div className="create-invoice-wallet-content-item">
              <div style={{ flex: 1 }}>
                <button
                  className={`create-invoice-form-content-switch-input ${
                    isSwitch && "active"
                  }`}
                  onClick={() => setIsSwitch(!isSwitch)}
                >
                  <div className="create-invoice-form-content-switch-input-decor"></div>
                </button>
              </div>

              <p
                className="create-invoice-wallet-content-item-code"
                style={{ flex: 3 }}
              >
                Trans-10021
              </p>
              <p
                className="create-invoice-wallet-content-item-name"
                style={{ flex: 3 }}
              >
                The Chef
              </p>
              <p
                className="create-invoice-wallet-content-item-due"
                style={{ flex: 3 }}
              >
                50.1 USD
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "60px",
          }}
        >
          <StandardButton text="Create Invoice" />
        </div>
      </div>
    </>
  );
};

export default CreateInvoiceBalances;
