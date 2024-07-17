import React, { useEffect, useState } from "react";
import TextInput from "../../../../form/TextInput";
import StandardButton from "../../../../form/StandardButton";
import AltButton from "../../../../form/AltButton";
import {
  setAccountNumber,
  setAmount,
  setBankAccountCurrency,
  setBankBranchName,
  setBankCountry,
  setBankName,
  setBeneficiary,
  setBeneficiaryAddress,
  setCurrentWindow,
  setIban,
  setPayee,
  setSortCode,
  setSwiftOrBic,
  setClearForm,
  setPaypalEmail,
  setClearFormWithoutAmount,
} from "../../../../../redux/slice/create-invoice";
import { useDispatch, useSelector } from "react-redux";

const CreateInvoicePayment = () => {
  const dispatch = useDispatch();
  const dataForm = useSelector((state) => state.createInvoice.data);
  const [errorForm, setErrorForm] = useState({
    // payee: false,
    bankName: false,
    // bankBranchName: false,
    bankCountry: false,
    bankAccountCurrency: false,
    sortCode: false,
    accountNumber: false,
    swiftOrBic: false,
    amount: false,
  });

  const nextForm = () => {
    console.log(dataForm);
    let listError = {
      // payee: false,
      bankName: false,
      beneficiary: false,
      beneficiaryAddress: false,
      bankCountry: false,
      bankAccountCurrency: false,
      sortCode: false,
      accountNumber: false,
      swiftOrBic: false,
      amount: false,
    };

    // let haveError = false;
    // for (let checkError in dataForm) {
    //   if (checkError === "contactName") break;
    //   if (checkError === "amount") {
    //     if (dataForm[checkError] === 0 || !Boolean(dataForm[checkError])) {
    //       haveError = true;
    //     }
    //   }
    //   if (dataForm[checkError] === "") {
    //     haveError = true;
    //     listError = {
    //       ...listError,
    //       [checkError]: true,
    //     };
    //   }
    // }

    // if (haveError) return setErrorForm(listError);

    dispatch(setCurrentWindow(1));
  };

  const handleAmount = (value) => {
    const balance = window.sessionStorage.getItem("balance");
    if (+balance >= +value) return dispatch(setAmount(value));
  };

  const [selectDetails, setSelectDetails] = useState(
    window.sessionStorage.getItem("selectDetails") === "true" || false
  );
  const [selectDetailsPaypal, setSelectDetailsPaypal] = useState(
    window.sessionStorage.getItem("selectDetailsPaypal") === "true" || false
  );

  const handleSelectDetails = (isSelectDetails) => {
    window.sessionStorage.setItem("selectDetails", isSelectDetails);
    window.sessionStorage.setItem("selectDetailsPaypal", false);
    setSelectDetailsPaypal(false);
    setSelectDetails(isSelectDetails);
  };

  useEffect(() => {
    if (selectDetailsPaypal)  dispatch(setClearFormWithoutAmount());
  }, [selectDetailsPaypal]);

  return (
    <>
      <div className="container-form">
        <p className="create-invoice-second">Select Payment Method</p>
        <div className="create-invoice-select">
          <button
            className={`create-invoice-select-button ${
              !selectDetails && !selectDetailsPaypal && "active"
            }`}
            onClick={() => handleSelectDetails(false)}
          >
            UK BANK TRANSFER
          </button>
          <button
            className={`create-invoice-select-button ${
              selectDetails && !selectDetailsPaypal && "active"
            }`}
            onClick={() => handleSelectDetails(true)}
          >
            International BANK TRANSFER
          </button>
          <button
            className={`create-invoice-select-button ${
              selectDetailsPaypal && "active"
            }`}
            onClick={() => {
              window.sessionStorage.setItem("selectDetailsPaypal", true);
              setSelectDetailsPaypal(true);
              dispatch(setClearForm());
            }}
          >
            Paypal
          </button>
        </div>
        <div className="create-invoice-form">
          <div className="create-invoice-form-header">
            <p className="create-invoice-form-header-title">Bank Transfer</p>
          </div>

          <div className="create-invoice-form-content">
            {/* <TextInput
              title="Payee*"
              placeholder="Enter Payee"
              style={{ maxWidth: "665px", margin: "0 auto" }}
              value={dataForm.payee}
              setValue={(value) => dispatch(setPayee(value))}
              error={errorForm.payee}
              onFocus={() => setErrorForm({ ...errorForm, payee: false })}
            /> */}
            {!selectDetailsPaypal && (
              <>
                <TextInput
                  title="Beneficiary*"
                  placeholder="Enter Beneficiary"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.beneficiary}
                  setValue={(value) => dispatch(setBeneficiary(value))}
                  error={errorForm.beneficiary}
                  onFocus={() =>
                    setErrorForm({ ...errorForm, beneficiary: false })
                  }
                />
                <TextInput
                  title="Beneficiary address*"
                  placeholder="Enter Beneficiary address"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.beneficiaryAddress}
                  setValue={(value) => dispatch(setBeneficiaryAddress(value))}
                  error={errorForm.beneficiaryAddress}
                  onFocus={() =>
                    setErrorForm({ ...errorForm, beneficiaryAddress: false })
                  }
                />
              </>
            )}
            {selectDetails && !selectDetailsPaypal ? (
              <>
                {" "}
                <TextInput
                  title="IBAN*"
                  placeholder="Enter IBAN"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.iban}
                  setValue={(value) => dispatch(setIban(value))}
                  error={errorForm.iban}
                  onFocus={() => setErrorForm({ ...errorForm, iban: false })}
                />
                <TextInput
                  title="Bank Name*"
                  placeholder="Enter Bank Name"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.bankName}
                  setValue={(value) => dispatch(setBankName(value))}
                  error={errorForm.bankName}
                  onFocus={() =>
                    setErrorForm({ ...errorForm, bankName: false })
                  }
                />
                <TextInput
                  title="Bank Country*"
                  placeholder="Enter Bank Country"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.bankCountry}
                  setValue={(value) => dispatch(setBankCountry(value))}
                  error={errorForm.bankCountry}
                  onFocus={() =>
                    setErrorForm({ ...errorForm, bankCountry: false })
                  }
                />
                <TextInput
                  title="Bank Account Currency*"
                  placeholder="Enter Bank Account Currency"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.bankAccountCurrency}
                  setValue={(value) => dispatch(setBankAccountCurrency(value))}
                  error={errorForm.bankAccountCurrency}
                  onFocus={() =>
                    setErrorForm({ ...errorForm, bankAccountCurrency: false })
                  }
                />
              </>
            ) : (
              <></>
            )}
            {!selectDetails && !selectDetailsPaypal ? (
              <>
                <TextInput
                  title="Sort Code*"
                  placeholder="Enter Sort Code"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.sortCode}
                  setValue={(value) => dispatch(setSortCode(value))}
                  error={errorForm.sortCode}
                  onFocus={() =>
                    setErrorForm({ ...errorForm, sortCode: false })
                  }
                />
                <TextInput
                  title="Account Number*"
                  placeholder="Enter Account Number"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.accountNumber}
                  setValue={(value) => dispatch(setAccountNumber(value))}
                  error={errorForm.accountNumber}
                  onFocus={() =>
                    setErrorForm({ ...errorForm, accountNumber: false })
                  }
                />
              </>
            ) : (
              <></>
            )}
            {selectDetails && !selectDetailsPaypal ? (
              <>
                <TextInput
                  title="SWIFT / BIC"
                  placeholder="SWIFT / BIC"
                  style={{
                    maxWidth: "665px",
                    margin: "0 auto",
                    marginTop: "60px",
                  }}
                  value={dataForm.swiftOrBic}
                  setValue={(value) => dispatch(setSwiftOrBic(value))}
                  error={errorForm.swiftOrBic}
                  onFocus={() =>
                    setErrorForm({ ...errorForm, swiftOrBic: false })
                  }
                />
              </>
            ) : (
              <></>
            )}

            {selectDetailsPaypal &&  <TextInput
              title="Paypal email"
              placeholder="Enter paypal email"
              style={{ maxWidth: "665px", margin: "0 auto", marginTop: "60px" }}
              value={dataForm.paypalEmail}
              setValue={(value) => dispatch(setPaypalEmail(value))}
              // error={errorForm.paypalEmail}
              // onFocus={() => setErrorForm({ ...errorForm, amount: false })}
            />
           }

            <TextInput
              title="Amount"
              placeholder="Enter Amount"
              style={{ maxWidth: "665px", margin: "0 auto", marginTop: "60px" }}
              value={dataForm.amount}
              setValue={handleAmount}
              error={errorForm.amount}
              onFocus={() => setErrorForm({ ...errorForm, amount: false })}
            />

  

            {!selectDetailsPaypal && (
              <div className="create-invoice-form-content-notification">
                <p className="create-invoice-form-content-notification-text">
                  Please note that the required numbers for receiving money
                  through bank transfers can vary depending on your country. If
                  you are uncertain about the specific requirements, we
                  recommend contacting your bank directly for information
                  regarding international payments.
                </p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "60px",
              }}
            >
              <StandardButton
                text={selectDetailsPaypal ? "Continue with Paypal" : "Continue with Bank"}
                onClick={nextForm}
                style={{ padding: "6px 25px" }}
              />
            </div>
          </div>
        </div>

        {/* <div className="create-invoice-form">
          <div className="create-invoice-form-header">
            <p className="create-invoice-form-header-title">Paypal</p>
          </div>

          <div
            className="create-invoice-form-content"
            style={{ padding: "50px 34px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <AltButton text="Connect new PayPal account" />
            </div>

            <div className="create-invoice-form-content-notification">
              <p className="create-invoice-form-content-notification-text">
                <strong>Bank details are required in all instances.</strong>
                <br />
                PayPal details should only be provided in the event you do not
                have a bank account.
                <br />
                <br /> You may be charged fees (up to 6%) by PayPal and in some
                cases money can be held by them before being paid though to you.
                We cannot be held responsible for money held or lost by PayPal
                and we will only be able to re-pay funds if they have been
                returned to us in full.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default CreateInvoicePayment;
