import React, { useState } from "react";
import { MailCheck, Package, PackageX, Wallet2 } from "lucide-react";
import CountUp from "react-countup";
import { axiosInstance } from "lib/axios";
import { useNavigate } from "react-router-dom";

const Widgets = () => {
  const naviagate = useNavigate();
  const [data, setData] = useState<any>({});
  const [loadingV, setLoadingV] = useState<boolean>(false);

  const user = JSON.parse(localStorage.getItem("authUser")!);
  const fetchDataUser = async () => {
    setLoadingV(true);
    try {
      const userResponse = await axiosInstance.get("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setData(userResponse.data?.data || {});
    } catch (error: any) {
      Error("Something went wrong");
      if (error.response?.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setLoadingV(false);
    }
  };

  React.useEffect(() => {
    fetchDataUser();
  }, []);

  return (
    <React.Fragment>
      <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
        <div className="text-center card-body">
          <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
            <Wallet2 />
          </div>
          <h5 className="mt-4 mb-2">
            <CountUp
              end={data.total_biaya_perbaikan ? data.total_biaya_perbaikan : 0}
              className="counter-value"
            />
          </h5>
          <p className="text-slate-500 dark:text-zink-200">
            Total Biaya Perbaikan
          </p>
        </div>
      </div>
      <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
        <div className="text-center card-body">
          <div className="flex items-center justify-center mx-auto text-purple-500 bg-purple-100 rounded-full size-14 dark:bg-purple-500/20">
            <Package />
          </div>
          <h5 className="mt-4 mb-2">
            <CountUp
              end={data.total_barang_masuk ? data.total_barang_masuk : 0}
              className="counter-value"
            />
          </h5>
          <p className="text-slate-500 dark:text-zink-200">
            Total Barang Masuk
          </p>
        </div>
      </div>

      <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
        <div className="text-center card-body">
          <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full size-14 dark:bg-red-500/20">
            <PackageX />
          </div>
          <h5 className="mt-4 mb-2">
            <CountUp
              end={data.total_barang_keluar ? data.total_barang_keluar : 0}
              className="counter-value"
            />
          </h5>
          <p className="text-slate-500 dark:text-zink-200">
            Total Barang Keluar
          </p>
        </div>
      </div>
      <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
        <div className="text-center card-body">
          <div className="flex items-center justify-center mx-auto text-green-500 bg-green-100 rounded-full size-14 dark:bg-green-500/20">
            <MailCheck />
          </div>
          <h5 className="mt-4 mb-2">
            <CountUp
              end={data.total_surat_masuk ? data.total_surat_masuk : 0}
              className="counter-value"
            />
          </h5>
          <p className="text-slate-500 dark:text-zink-200">Total Surat Masuk</p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Widgets;
