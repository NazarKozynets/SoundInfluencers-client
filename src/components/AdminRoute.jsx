import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ element }) => {
    const isAdmin = window.sessionStorage.getItem("isAdmin") === "true";

    return isAdmin ? element : <Navigate to="/admin" />;
};

export default AdminRoute;
