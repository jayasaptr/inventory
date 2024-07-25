import React from "react";
import { Route, Routes } from "react-router-dom";
import DataUser from "pages/DataUser/DataUser";
import Login from "pages/Authentication/Login";
import Ecommerce from "pages/Dashboards/Ecommerce";
import CategoryPage from "pages/Category/CategoryPage";
import KondisiPage from "pages/Kondisi/KondisiPage";
import RuanganPage from "pages/Ruangan/RuanganPage";

const RouteIndex = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/dashboard" Component={Ecommerce} />
        <Route path="/user" Component={DataUser} />
        <Route path="/category" Component={CategoryPage} />
        <Route path="/kondisi" Component={KondisiPage} />
        <Route path="/ruangan" Component={RuanganPage} />
      </Routes>
    </React.Fragment>
  );
};

export default RouteIndex;
