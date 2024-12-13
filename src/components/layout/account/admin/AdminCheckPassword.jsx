import React, { useState } from "react";
import TextInput from "../../../form/TextInput";
import StandardButton from "../../../form/StandardButton";
import { useNavigate } from "react-router-dom";

const AdminCheckPassword = () => {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (password === "loN>nFtEkJQ,p2_IpR<o0x7b\\O)\\^+L/") {
            window.sessionStorage.setItem("isAdmin", "true");
            navigate("/admin/home");
        } else {
            alert("Invalid password");
        }
    };

    return (
        <div style={{ marginTop: '10%' }}>
            <TextInput
                style={{ margin: '0 auto', width: '50%' }}
                placeholder={"Password"}
                silverColor={true}
                value={password}
                setValue={setPassword}
            />
            <StandardButton
                style={{ margin: '20px auto' }}
                text={"Submit"}
                onClick={handleSubmit}
            />
        </div>
    );
};

export default AdminCheckPassword;
