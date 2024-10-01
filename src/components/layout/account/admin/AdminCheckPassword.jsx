import React, {useState} from "react";
import TextInput from "../../../form/TextInput";
import StandardButton from "../../../form/StandardButton";
import {useNavigate} from "react-router-dom";

const AdminCheckPassword = () => {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    return (
        <div style={{marginTop: '10%'}}>
            <TextInput style={{margin: '0 auto', width: '50%'}} placeholder={"Password"} silverColor={true} value={password} setValue={setPassword}/>
            <StandardButton style={{margin: '20px auto'}} text={"Submit"} onClick={() => {
                if (password === "loN>nFtEkJQ,p2_IpR<o0x7b\\O)\\^+L/") {
                    navigate("/admin/home");
                }
            }} />
        </div>
    )
}

export default AdminCheckPassword;