import axios from "axios";
import React, { useState } from "react";

const StripeButton = () => {
  const handleSubmit = async () => {
    const result = await axios.post(
      `${process.env.REACT_APP_SERVER}/payment/create-order-stripe`,
      {
        nameProduct: "test",
        userId: "test",
        amount: 55,
      }
    );
    if (result.data.code === 201) {
      document.location.href = result.data.paymentUrl;
    }
  };

  return (
    <>
      <button onClick={handleSubmit}>test</button>
    </>
  );
};

export default StripeButton;
