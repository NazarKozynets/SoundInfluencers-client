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
import { setAuthenticated, setCurrentRole } from "../redux/slice/authenticated";

const PrivateRoute = ({ element: Element, role = "client", ...rest }) => {
  const dispatch = useDispatch();
  const [isAuth, setisAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UseVerify().then((res) => {
      if(role !== res.dataFetch.role){
        setisAuth(false);
        setLoading(false);
        dispatch(setAuthenticated(false));
        return
      }
      setisAuth(res.verify);
      setLoading(false);
      dispatch(setCurrentRole(res.verify ? res.dataFetch.role : "client"));
      dispatch(setAuthenticated(res.verify));
    });
  });

  if (loading) return null;
  return isAuth ? <Element /> : <Navigate to="/signup" />;
};

export default PrivateRoute;