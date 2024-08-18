import BreadCrumb from "Common/BreadCrumb";
import DeleteModal from "Common/DeleteModal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, ToastPosition, toast } from "react-toastify";
import {
  CheckCircle,
  ImagePlus,
  LucidePrinter,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import TableContainer from "Common/TableContainer";
import Modal from "Common/Components/Modal";
import { axiosInstance } from "lib/axios";
import Layout from "Layout";
import ReactToPrint from "react-to-print";
import ReportPrint from "report/print/ReportPrint";

const SuratTugas = () => {
  const [data, setData] = useState<any>([]);
  const [eventData, setEventData] = useState<any>();

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = () => setDeleteModal(!deleteModal);

  // Delete Data
  const onClickDelete = (cell: any) => {
    setDeleteModal(true);
    if (cell.id) {
      setEventData(cell);
    }
  };

  const handleDelete = () => {
    if (eventData) {
      handleDeleteSuratMasuk(eventData.id);
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
      id: (eventData && eventData.id) || "",
      nomor_surat: (eventData && eventData.nomor_surat) || "",
      menimbang: (eventData && eventData.menimbang) || "",
      dasar: (eventData && eventData.dasar) || "",
      user_id: (eventData && eventData.user_id) || "",
      keterangan: (eventData && eventData.keterangan) || "",
    },
    validationSchema: Yup.object({
      nomor_surat: Yup.string().required("No Surat is Required"),
      menimbang: Yup.string().required("Menimbang is Required"),
      dasar: Yup.string().required("Dasar is Required"),
      user_id: Yup.string().required("User is Required"),
      keterangan: Yup.string().required("Keterangan is Required"),
    }),

    onSubmit: (values) => {
      console.log("🚀 ~ SuratTugas ~ values:", values);
      if (isEdit) {
        handleUpdateSuratMasuk(values);
      } else {
        handlePostSuratAktif(values);
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

  const printRef = useRef<HTMLDivElement>(null);

  // columns
  const columns = useMemo(
    () => [
      {
        header: "No",
        accessorKey: "no",
        enableColumnFilter: false,
      },
      {
        header: "Nomor Surat",
        accessorKey: "nomor_surat",
        enableColumnFilter: false,
      },
      {
        header: "Menimbang",
        accessorKey: "menimbang",
        enableColumnFilter: false,
      },
      {
        header: "Dasar",
        accessorKey: "dasar",
        enableColumnFilter: false,
      },
      {
        header: "Pegawai",
        accessorKey: "user_id.name",
        enableColumnFilter: false,
      },
      {
        header: "Keterangan",
        accessorKey: "keterangan",
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <div className="flex gap-3">
            {cell.row.original.status === "pending" ? (
              <Link
                to="#!"
                className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md edit-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
                onClick={() => {
                  const data = cell.row.original;
                  handleUpadateStatus(data.id);
                }}
              >
                <CheckCircle className="size-4" />
              </Link>
            ) : (
              ""
            )}
            {cell.row.original.status === "approved" ? (
              <ReactToPrint
                trigger={() => (
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <LucidePrinter className="size-4" />
                  </button>
                )}
                content={() => {
                  const data = cell.row.original;
                  setEventData(data);
                  return printRef.current;
                }}
              />
            ) : (
              <div className="flex gap-2">
                <Link
                  to="#!"
                  className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md edit-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
                  onClick={() => {
                    const data = cell.row.original;

                    handleUpdateDataClick(data);
                  }}
                >
                  <Pencil className="size-4" />
                </Link>
                <Link
                  to="#!"
                  className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
                  onClick={() => {
                    const data = cell.row.original;
                    onClickDelete(data);
                  }}
                >
                  <Trash2 className="size-4" />
                </Link>
              </div>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const user = JSON.parse(localStorage.getItem("authUser")!);

  const naviagate = useNavigate();

  const fetchDataBarangMasuk = async () => {
    setLoadingV(true);
    try {
      const userResponse = await axiosInstance.get("/api/surat-tugas", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(
        "🚀 ~ fetchDataUser ~ userResponse:",
        userResponse.data.data.data
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

  const handleUpadateStatus = async (id: any) => {
    setLoadingV(true);
    try {
      const userResponse = await axiosInstance.post(
        `/api/surat-tugas/${id}`,
        {
          status: "approved",
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Surat Tugas Berhasil Diupdate");
        fetchDataBarangMasuk();
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setLoadingV(false);
    }
  };

  const handlePostSuratAktif = async (data: any) => {
    console.log("🚀 ~ handlePostBarang ~ data:", data);
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("nomor_surat", data.nomor_surat);
      formData.append("menimbang", data.menimbang);
      formData.append("dasar", data.dasar);
      formData.append("user_id", data.user_id);
      formData.append("keterangan", data.keterangan);

      const userResponse = await axiosInstance.post(
        "/api/surat-tugas",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Surat Tugas Berhasil Ditambahkan");
        fetchDataBarangMasuk();
        toggle();
      }
    } catch (error: any) {
      Error("Data Surat Tugas Gagal Ditambahkan");
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSuratMasuk = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("nomor_surat", data.nomor_surat);
      formData.append("menimbang", data.menimbang);
      formData.append("dasar", data.dasar);
      formData.append("user_id", data.user_id);
      formData.append("keterangan", data.keterangan);

      const userResponse = await axiosInstance.post(
        `/api/surat-tugas/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Surat Tugas Berhasil Diupdate");
        fetchDataBarangMasuk();
        toggle();
      }
    } catch (error: any) {
      Error("Data Barang Masuk Gagal Diupdate");
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSuratMasuk = async (id: any) => {
    try {
      setIsLoading(true);
      const userResponse = await axiosInstance.delete(
        `/api/surat-tugas/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Surat Tugas Berhasil Dihapus");
        fetchDataBarangMasuk();
      }
    } catch (error: any) {
      Error("Data Barang Masuk Gagal Dihapus");
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
      const response = await axiosInstance.get("/api/user", {
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

  useEffect(() => {
    fetchDataBarangMasuk();
    fetchDataKondisi();
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
      <BreadCrumb title="Surat Tugas" pageTitle="Surat Tugas" />
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
              Surat Tugas (<b className="total-Employs">{data.length}</b>)
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
                <span className="align-middle">Add Surat Tugas</span>
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
                tableclassName="w-full table-fixed"
                theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500"
                tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500 overflow-hidden text-ellipsis whitespace-nowrap"
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

      {/* print */}
      <div style={{ display: "none" }}>
        <ReportPrint ref={printRef}>
          <div className="px-8 bg-white">
            <h1 className="text-center text-lg font-bold">SURAT TUGAS</h1>
            <p className="text-center">
              {`Nomor: w.o/6/PP.03.2/${validation.values.nomor_surat}/${new Date().getFullYear()}`}
            </p>
            <div className="mt-8">
              <p>Menimbang :</p>
              <br />
              <p>{validation.values.menimbang}</p>
              <br />
              <p>Dasar :</p>
              <br />
              <p>{validation.values.dasar}</p>
              <br />
              <p className="text-center font-bold mt-4">Memberi Tugas</p>
              <p>Kepada yang tersebut di bawah ini:</p>
              <p>
                Nama:{" "}
                <span className="font-bold">
                  {eventData?.user_id?.name ?? ""}
                </span>
              </p>
              <p>
                NIP:{" "}
                <span className="font-bold">
                  {eventData?.user_id?.nip ?? ""}
                </span>
              </p>
              <p>
                Jabatan:{" "}
                <span className="font-bold">
                  {eventData?.user_id?.role ?? ""}
                </span>
              </p>
            </div>
            <div className="mt-8">
              <p>{validation.values.keterangan} </p>
              <p className="mt-4">
                Demikian surat tugas ini diberikan untuk dapat dipergunakan
                sebagaimana mestinya.
              </p>
            </div>
          </div>
        </ReportPrint>
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
            {!!isEdit ? "Edit Surat Tugas" : "Add Surat Tugas"}
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
                  htmlFor="nomor_surat"
                  className="inline-block mb-2 text-base font-medium"
                >
                  No Surat
                </label>
                <input
                  type="text"
                  id="nomor_surat"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="No Surat"
                  name="nomor_surat"
                  onChange={validation.handleChange}
                  value={validation.values.nomor_surat || ""}
                />
                {validation.touched.nomor_surat &&
                validation.errors.nomor_surat ? (
                  <p className="text-red-400">
                    {validation.errors.nomor_surat}
                  </p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="menimbang"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Menimbang
                </label>
                <input
                  type="text"
                  id="menimbang"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Nama Siswa"
                  name="menimbang"
                  onChange={validation.handleChange}
                  value={validation.values.menimbang || ""}
                />
                {validation.touched.menimbang && validation.errors.menimbang ? (
                  <p className="text-red-400">{validation.errors.menimbang}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="dasar"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Dasar
                </label>
                <input
                  type="text"
                  id="dasar"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tempat Lahir"
                  name="dasar"
                  onChange={validation.handleChange}
                  value={validation.values.dasar || ""}
                />
                {validation.touched.dasar && validation.errors.dasar ? (
                  <p className="text-red-400">{validation.errors.dasar}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="user_id"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Staff
                </label>
                <select
                  id="user_id"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="user_id"
                  onChange={(e) => {
                    validation.handleChange(e);
                    validation.setFieldValue("user_id", e.target.value);
                  }}
                  onBlur={validation.handleBlur}
                  value={validation.values.user_id || ""} // set default value
                >
                  <option value="">Pilih Pegawai</option>
                  {kondisi.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {validation.touched.user_id && validation.errors.user_id ? (
                  <p className="text-red-400">{validation.errors.user_id}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="keterangan"
                  className="inline-block mb-2 text-base font-medium"
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
                  : "Add Surat Tugas"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default SuratTugas;
