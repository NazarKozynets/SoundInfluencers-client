import React, { useEffect, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
  Outlet,
} from "react-router-dom";
import UseVerify from "../hooks/useVerify";
import { useDispatch } from "react-redux";
import { setCurrentRole } from "../redux/slice/authenticated";

const PublicRoute = ({ element: Element, ...rest }) => {
  const dispatch = useDispatch();
  const [isAuth, setisAuth] = useState(true);
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    UseVerify().then((res) => {
      setisAuth(res.verify);
      setRole(res.verify ? res.dataFetch.role : "client");
      dispatch(setCurrentRole(res.verify ? res.dataFetch.role : "client"));
      setLoading(false);
    });
  });

  if (loading) return null;
  return !isAuth ? (
      <Element />
  ) : (
      <Navigate to={role === "client" ? "/account/client" : "/account/influencer"} />
  );
};

export default PublicRoute;
