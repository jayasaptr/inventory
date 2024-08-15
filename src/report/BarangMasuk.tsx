import React, { useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Layout from "Layout";
import { column } from "pages/Components/Table/ReactTable";
import TableContainer from "Common/TableContainer";
import { basic } from "Common/data";
import { axiosInstance } from "lib/axios";
import { useNavigate } from "react-router-dom";

const ReportBarangMasuk = () => {
  const [showDateFilter, setShowDateFilter] = useState(false);

  const columns: column[] = React.useMemo(
    () => [
      {
        header: "Nama",
        accessorKey: "nama",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Merk",
        accessorKey: "merk",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Category",
        accessorKey: "id_category.name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Kondisi",
        accessorKey: "id_kondisi.nama",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Jumlah",
        accessorKey: "jumlah",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Total Harga",
        accessorKey: "total_harga",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Tanggal Masuk",
        accessorKey: "tanggal_masuk",
        enableColumnFilter: false,
        enableSorting: true,
      },
    ],
    []
  );

  const user = JSON.parse(localStorage.getItem("authUser")!);

  const naviagate = useNavigate();

  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

  const [loadingV, setLoadingV] = useState(false);

  const fetchDataBarangMasuk = async () => {
    setLoadingV(true);
    try {
      const userResponse = await axiosInstance.get(
        "/api/report-barang-masuk?date=" + date,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setData(userResponse.data.data.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setLoadingV(false);
    }
  };

  const loadingView = (
    <div className="flex flex-wrap items-center gap-5 px-3 py-2 justify-center">
      <div className="inline-block size-8 border-2 border-green-500 rounded-full animate-spin border-l-transparent"></div>
    </div>
  );

  React.useEffect(() => {
    fetchDataBarangMasuk();
  }, [date]);

  return (
    <Layout>
      <BreadCrumb title="Report Barang Masuk" pageTitle="Report Barang Masuk" />
      <div className="card">
        <div className="card-body">
          <div className="flex gap-2 mb-4 justify-end">
            <div className="relative">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowDateFilter(!showDateFilter)}
              >
                Pilih Tanggal
              </button>
              {showDateFilter && (
                <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg p-2">
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              )}
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Print
            </button>
          </div>
          {loadingV ? (
            loadingView
          ) : (
            <TableContainer
              isPagination={true}
              isTfoot={true}
              isSelect={false}
              isGlobalFilter={false}
              columns={columns || []}
              data={
                data.map((item: any) => {
                  return {
                    ...item,
                    jumlah: item.jumlah,
                    harga: item.harga,
                    total_harga: item.jumlah * item.harga,
                  };
                }) || []
              }
              customPageSize={10}
              divclassName="my-2 col-span-12 overflow-x-auto lg:col-span-12"
              tableclassName="display dataTable w-full text-sm align-middle whitespace-nowrap"
              theadclassName="border-b border-slate-200 dark:border-zink-500"
              trclassName="group-[.stripe]:even:bg-slate-50 group-[.stripe]:dark:even:bg-zink-600 transition-all duration-150 ease-linear group-[.hover]:hover:bg-slate-50 dark:group-[.hover]:hover:bg-zink-600 [&.selected]:bg-custom-500 dark:[&.selected]:bg-custom-500 [&.selected]:text-custom-50 dark:[&.selected]:text-custom-50"
              thclassName="p-3 group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500 sorting px-3 py-4 text-slate-900 bg-slate-200/50 font-semibold text-left dark:text-zink-50 dark:bg-zink-600 dark:group-[.bordered]:border-zink-500"
              tdclassName="p-3 group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500"
              PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReportBarangMasuk;
