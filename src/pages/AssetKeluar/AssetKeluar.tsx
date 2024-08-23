import BreadCrumb from "Common/BreadCrumb";
import DeleteModal from "Common/DeleteModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer, ToastPosition, toast } from "react-toastify";
import { ImagePlus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import TableContainer from "Common/TableContainer";
import Modal from "Common/Components/Modal";
import { axiosInstance } from "lib/axios";
import Layout from "Layout";

const AssetKeluar = () => {
  const [data, setData] = useState<any>([]);
  const [eventData, setEventData] = useState<any>();
  const [id, setId] = useState<number>(0);

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = () => setDeleteModal(!deleteModal);

  // Delete Data
  const onClickDelete = (cell: number) => {
    setDeleteModal(true);
    setId(cell);
  };

  const handleDelete = () => {
    console.log("🚀 ~ handleDelete ~ eventData:", id);
    if (id) {
      handleDeleteDataAssetMasuk(id);
      setDeleteModal(false);
    }
  };
  //

  // Update Data
  const handleUpdateDataClick = (ele: any) => {
    setEventData({ ...ele });
    setIsEdit(true);
    setShow(true);
  };

  // validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // id: (eventData && eventData.id) || "",
      id_asset: (eventData && eventData.id_asset.id) || "",
      kondisi: (eventData && eventData.kondisi.id) || "",
      jumlah: (eventData && eventData.jumlah) || "",
      penerima: (eventData && eventData.penerima) || "",
      tanggal_keluar: (eventData && eventData.tanggal_keluar) || "",
      keterangan: (eventData && eventData.keterangan) || "",
    },
    validationSchema: Yup.object({
      id_asset: Yup.string().required("Pilih Asset"),
      kondisi: Yup.string().required("Pilih Kondisi"),
      jumlah: Yup.string().required("Jumlah harus diisi"),
      penerima: Yup.string().required("Penerima harus diisi"),
      tanggal_keluar: Yup.string().required("Tanggal Keluar harus diisi"),
      keterangan: Yup.string().required("Keterangan harus diisi"),
    }),

    onSubmit: (values) => {
      console.log("🚀 ~ AssetPage ~ values:", values);
      if (isEdit) {
      } else {
        handlePostAssetKeluar(values);
      }
      if (isLoading) {
        toggle();
      }
    },
  });

  //
  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setEventData("");
      setIsEdit(false);
    } else {
      setShow(true);
      setEventData("");
      validation.resetForm();
    }
  }, [show, validation]);

  // columns
  const columns = useMemo(
    () => [
      {
        header: "No",
        accessorKey: "no",
        enableColumnFilter: false,
      },
      {
        header: "Nama",
        accessorKey: "id_asset.name",
        enableColumnFilter: false,
      },
      {
        header: "Penerima",
        accessorKey: "penerima",
        enableColumnFilter: false,
      },
      {
        header: "Jumlah",
        accessorKey: "jumlah",
        enableColumnFilter: false,
      },
      {
        header: "Tanggal Keluar",
        accessorKey: "tanggal_keluar",
        enableColumnFilter: false,
      },
      {
        header: "Kondisi",
        accessorKey: "kondisi",
        enableColumnFilter: false,
      },
      {
        header: "Keterangan",
        accessorKey: "keterangan",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <div className="flex gap-3">
            <Link
              to="#!"
              className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
              onClick={() => {
                const data = cell.row.original;
                onClickDelete(data.id);
              }}
            >
              <Trash2 className="size-4" />
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const user = JSON.parse(localStorage.getItem("authUser")!);

  const naviagate = useNavigate();

  const fetchDataAssetKeluar = async () => {
    setLoadingV(true);
    try {
      const userResponse = await axiosInstance.get("/api/asset-keluar", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
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

  const handleDeleteDataAssetMasuk = async (id: any) => {
    try {
      setIsLoading(true);
      const userResponse = await axiosInstance.delete(
        `/api/asset-keluar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Asset Keluar Berhasil Dihapus");
        fetchDataAssetKeluar();
      }
    } catch (error: any) {
      Error("Data Asset Keluar Gagal Dihapus");
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [kondisi, setKondisi] = useState<any>([]);

  const fetchDataKondisi = async () => {
    try {
      const response = await axiosInstance.get("/api/kondisi", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setKondisi(response.data.data.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    }
  };

  const [Asset, setAsset] = useState<any>([]);

  const handlePostAssetKeluar = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      if (user.user.role === "admin") {
        formData.append("id_asset", data.id_asset);
      } else {
        const dataAsset = JSON.parse(data.id_asset);
        formData.append("id_Asset_ruang", dataAsset.id);
        formData.append("id_asset", dataAsset.id_asset.id);
      }
      formData.append("kondisi", data.kondisi);
      formData.append("jumlah", data.jumlah);
      formData.append("penerima", data.penerima);
      formData.append("tanggal_keluar", data.tanggal_keluar);
      formData.append("keterangan", data.keterangan);

      const userResponse = await axiosInstance.post(
        "/api/asset-keluar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Asset Keluar Berhasil Ditambahkan");
        fetchDataAssetKeluar();
        toggle();
      }
    } catch (error: any) {
      Error("Data Asset Keluar Gagal Ditambahkan");
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataAsset = async () => {
    try {
      const response = await axiosInstance.get("/api/asset", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAsset(response.data.data.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    }
  };

  useEffect(() => {
    fetchDataAssetKeluar();
    fetchDataKondisi();
    fetchDataAsset();
  }, []);

  const [loadingV, setLoadingV] = useState(false);

  const loadingView = (
    <div className="flex flex-wrap items-center gap-5 px-3 py-2 justify-center">
      <div className="inline-block size-8 border-2 border-green-500 rounded-full animate-spin border-l-transparent"></div>
    </div>
  );

  const Success = (title: string) =>
    toast.success(title, {
      autoClose: 3000,
      theme: "colored",
      icon: false,
      position: toast.POSITION.TOP_RIGHT,
      closeButton: false,
    });

  const Error = (title: string) =>
    toast.error(title, {
      autoClose: 3000,
      theme: "colored",
      icon: false,
      position: toast.POSITION.TOP_RIGHT,
      closeButton: false,
    });

  return (
    <Layout>
      <BreadCrumb title="Data Asset" pageTitle="Asset" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />

      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="card" id="employeeTable">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <h6 className="text-15 grow">
              Asset (<b className="total-Employs">{data.length}</b>)
            </h6>
            <div className="shrink-0">
              <Link
                to="#!"
                data-modal-target="addEmployeeModal"
                type="button"
                className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 add-employee"
                onClick={toggle}
              >
                <Plus className="inline-block size-4" />{" "}
                <span className="align-middle">Add Asset Keluar</span>
              </Link>
            </div>
          </div>
          {data && data.length > 0 ? (
            // for no get from 1 index
            (data.map((item: any, index: number) => {
              item.no = index + 1;
              item.total_harga = item.jumlah * item.harga;
              return item;
            }),
            (
              <TableContainer
                isPagination={true}
                columns={columns || []}
                data={data || []}
                customPageSize={5}
                divclassName="-mx-5 overflow-x-auto"
                tableclassName="w-full whitespace-nowrap"
                theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500"
                tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500"
                PaginationClassName="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row"
              />
            ))
          ) : loadingV ? (
            loadingView
          ) : (
            <div className="noresult">
              <div className="py-6 text-center">
                <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                <p className="mb-0 text-slate-500 dark:text-zink-200">
                  No results found. Please try a different search.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Modal */}
      <Modal
        show={show}
        onHide={toggle}
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-500"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {!!isEdit ? "Edit Asset" : "Add Asset Masuk"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
          <form
            className="create-form"
            id="create-form"
            encType="multipart/form-data"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <input type="hidden" value="" name="id" id="id" />
            <input type="hidden" value="add" name="action" id="action" />
            <input type="hidden" id="id-field" />
            <div
              id="alert-error-msg"
              className="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-500/20"
            ></div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <div className="xl:col-span-12">
                <label
                  htmlFor="id_Asset"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Pilih Asset
                </label>
                <select
                  id="id_Asset"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="id_asset"
                  onChange={(e) => {
                    // const datas = JSON.parse(e.target.value);
                    validation.handleChange(e);
                    validation.setFieldValue("id_asset", e.target.value);
                    // if (user.user.role === "admin") {
                    //   validation.setFieldValue("id_Asset", e.target.value);
                    // } else {
                    //   validation.setFieldValue("id_Asset", datas.id);
                    //   validation.setFieldValue(
                    //     "id_Asset_user",
                    //     datas.id_Asset_masuk.id
                    //   );
                    // }
                  }}
                  onBlur={validation.handleBlur}
                  value={
                    validation.values.id_asset ||
                    (eventData && eventData.id_asset.id) ||
                    ""
                  }
                >
                  <option value="">Pilih Asset</option>
                  {Asset.map((item: any, index: number) => (
                    <option
                      key={index}
                      value={
                        user.user.role === "admin"
                          ? item.id
                          : JSON.stringify(item)
                      }
                    >
                      {user.user.role === "admin"
                        ? item.name
                        : item.id_asset.nama}
                    </option>
                  ))}
                </select>
                {validation.touched.id_asset && validation.errors.id_asset ? (
                  <p className="text-red-400">{validation.errors.id_asset}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="kondisi"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Kondisi
                </label>
                <input
                  type="text"
                  id="kondisi"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Kondisi"
                  name="kondisi"
                  onChange={validation.handleChange}
                  value={validation.values.kondisi || ""}
                />
                {validation.touched.kondisi && validation.errors.kondisi ? (
                  <p className="text-red-400">{validation.errors.kondisi}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="jumlah"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Jumlah
                </label>
                <input
                  type="number"
                  id="jumlah"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Jumlah"
                  name="jumlah"
                  onChange={validation.handleChange}
                  value={validation.values.jumlah || ""}
                />
                {validation.touched.jumlah && validation.errors.jumlah ? (
                  <p className="text-red-400">{validation.errors.jumlah}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="penerima"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Penerima
                </label>
                <input
                  type="text"
                  id="penerima"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Penerima"
                  name="penerima"
                  onChange={validation.handleChange}
                  value={validation.values.penerima || ""}
                />
                {validation.touched.penerima && validation.errors.penerima ? (
                  <p className="text-red-400">{validation.errors.penerima}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="tanggal_keluar"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Tanggal Keluar
                </label>
                <input
                  type="date"
                  id="tanggal_keluar"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tanggal Keluar"
                  name="tanggal_keluar"
                  onChange={validation.handleChange}
                  value={validation.values.tanggal_keluar || ""}
                />
                {validation.touched.tanggal_keluar &&
                validation.errors.tanggal_keluar ? (
                  <p className="text-red-400">
                    {validation.errors.tanggal_keluar}
                  </p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="keterangan"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Keterangan
                </label>
                <input
                  type="text"
                  id="keterangan"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Keterangan"
                  name="keterangan"
                  onChange={validation.handleChange}
                  value={validation.values.keterangan || ""}
                />
                {validation.touched.keterangan &&
                validation.errors.keterangan ? (
                  <p className="text-red-400">{validation.errors.keterangan}</p>
                ) : null}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="reset"
                id="close-modal"
                data-modal-close="addEmployeeModal"
                className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                onClick={toggle}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="addNew"
                disabled={isLoading}
                className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
              >
                {isLoading
                  ? "Loading"
                  : !!isEdit
                  ? "Update"
                  : "Add Asset Keluar"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default AssetKeluar;
