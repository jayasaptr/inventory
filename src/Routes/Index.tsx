import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DataUser from "pages/DataUser/DataUser";
import Login from "pages/Authentication/Login";
import Ecommerce from "pages/Dashboards/Ecommerce";
import CategoryPage from "pages/Category/CategoryPage";
import KondisiPage from "pages/Kondisi/KondisiPage";
import RuanganPage from "pages/Ruangan/RuanganPage";
import BarangMasukPage from "pages/BarangMasuk/BarangMasukPage";
import BarangKeluarPage from "pages/BarangKeluar/BarangKeluarPage";
import PengajuanPerbaikan from "pages/PengajuanPerbaikan/PerbaikanPage";
import BarangRuanganPage from "pages/BarangRuangan/BarangRuanganPage";
import ReportBarangMasuk from "report/BarangMasuk";

const RouteIndex = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" Component={Login} />
        <Route path="/dashboard" Component={Ecommerce} />
        <Route path="/user" Component={DataUser} />
        <Route path="/category" Component={CategoryPage} />
        <Route path="/kondisi" Component={KondisiPage} />
        <Route path="/ruangan" Component={RuanganPage} />
        <Route path="/barang-masuk" Component={BarangMasukPage} />
        <Route path="/barang-keluar" Component={BarangKeluarPage} />
        <Route path="/pengajuan-perbaikan" Component={PengajuanPerbaikan} />
        <Route path="/permintaan-barang" Component={BarangRuanganPage} />
        <Route path="/laporan-barang-masuk" Component={ReportBarangMasuk} />
      </Routes>
    </React.Fragment>
  );
};

export default RouteIndex;
