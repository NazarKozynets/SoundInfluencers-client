import React, { forwardRef } from "react";
import StandardButton from "../../../../../../form/StandardButton";
import "./submitButton.css";

const SubmitButton = forwardRef(({ onSubmit }, ref) => {
    return (
        <div ref={ref} className="container-admin-submit-button">
            <StandardButton onClick={onSubmit} text="Submit" style={{ height: 40 }} />
        </div>
    );
});

export default SubmitButton;