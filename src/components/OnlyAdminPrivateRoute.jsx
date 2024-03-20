import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
export default function OnlyAdminPrivateRoute() {
   const user = useSelector((state) => state.user.user);
   return user.isAdmin ? <Outlet /> : <Navigate to='/signIn' />;
}
