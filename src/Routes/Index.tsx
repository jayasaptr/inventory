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
import BarangPage from "pages/Barang/BarangPage";
import ReportBarangKeluar from "report/BarangKeluar";
import ReportPengajuanPerbaikan from "report/PengajuanPerbaikan";
import ReportPermintaanBarang from "report/PermintaanBarang";
import SuratKeteranganAktif from "pages/SuratKeteranganAktif/SuratKeteranganAktif";
import SuratTugas from "pages/SuratTugas/SuratTugas";
import SuratBaik from "pages/SuratBaik/SuratBaik";
import PengarsipanSurat from "pages/Surat/SuratPage";
import ReportArsiSurat from "report/LaporanArsipSurat";
import ReportArsiSuratTugas from "report/LaporanSuratTugas";
import ReportArsiSuratAktif from "report/LaporanSuratAktif";
import ReportArsiSuratBaik from "report/LaporanSuratBaik";
import ReportBarangKabag from "report/ReportBarangKabag";
import AssetPage from "pages/Asset/AssetPage";
import PerbaikanAsset from "pages/PerbaikanAsset/PerbaikanAsset";
import ReportPerbaikanAsset from "report/PerbaikanAsset";
import AssetBarangPage from "pages/AssetBarang/AssetBarangPage";
import LaporanAssetBarangPage from "report/LaporanAssetBarang";
import AssetKeluar from "pages/AssetKeluar/AssetKeluar";
import NewBarangMasukPage from "pages/AssetBarang/NewBarangMasukPage";
import NewAssetMasukPage from "pages/AssetBarang/NewAssetMasukPage";
import ReportPerbaikanBarang from "report/ReportPerbaikanBarang";
import SiswaPage from "pages/Siswa/SiswaPage";

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
        <Route path="/asset" Component={AssetPage} />
        <Route path="/barang" Component={BarangPage} />
        <Route path="/barang-masuks" Component={NewBarangMasukPage} />
        <Route path="/asset-masuks" Component={NewAssetMasukPage} />
        <Route path="/asset-barang" Component={AssetBarangPage} />
        <Route
          path="/laporan-barang-asset"
          Component={LaporanAssetBarangPage}
        />
        <Route path="/barang-masuk" Component={BarangMasukPage} />
        <Route path="/asset-keluar" Component={AssetKeluar} />
        <Route path="/barang-keluar" Component={BarangKeluarPage} />
        <Route path="/pengajuan-perbaikan-asset" Component={PerbaikanAsset} />
        <Route path="/pengajuan-perbaikan" Component={PengajuanPerbaikan} />
        <Route path="/permintaan-barang" Component={BarangRuanganPage} />
        <Route path="/laporan-barang-masuk" Component={ReportBarangMasuk} />
        <Route
          path="/surat-keterangan-aktif"
          Component={SuratKeteranganAktif}
        />
        <Route path="/surat-tugas" Component={SuratTugas} />
        <Route path="/surat-berkelakuan-baik" Component={SuratBaik} />
        <Route path="/pengarsipan-surat" Component={PengarsipanSurat} />
        <Route
          path="/laporan-permintaan-barang"
          Component={ReportPermintaanBarang}
        />

        <Route path="/laporan-barang-keluar" Component={ReportBarangKeluar} />
        <Route
          path="/laporan-pengajuan-perbaikan"
          Component={ReportPerbaikanBarang}
        />
        <Route
          path="/laporan-perbaikan-asset"
          Component={ReportPerbaikanAsset}
        />
        <Route path="/laporan-arsip-surat" Component={ReportArsiSurat} />
        <Route path="/laporan-surat-tugas" Component={ReportArsiSuratTugas} />
        <Route
          path="/laporan-surat-keterangan-aktif"
          Component={ReportArsiSuratAktif}
        />
        <Route
          path="/laporan-surat-berkelakuan-baik"
          Component={ReportArsiSuratBaik}
        />
        <Route path="/report-barang-kabag" Component={ReportBarangKabag} />
        <Route
          path="/report-perbaikan-kabag"
          Component={ReportPengajuanPerbaikan}
        />
        <Route path="/siswa" Component={SiswaPage} />
      </Routes>
    </React.Fragment>
  );
};

export default RouteIndex;
