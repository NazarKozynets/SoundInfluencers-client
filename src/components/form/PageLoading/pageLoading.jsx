import React from "react";
import "./loading.css";
import {BarLoader, CircleLoader} from "react-spinners";

const Loading = () => {
    return (
        <div className="loading-container">
            <BarLoader color={"#3498db"} loading={true} size={100}/>
        </div>
    );
};

export default Loading;
