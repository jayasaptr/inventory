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

const SuratKeteranganAktif = () => {
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
      no_surat: (eventData && eventData.no_surat) || "",
      nama_siswa: (eventData && eventData.nama_siswa) || "",
      tempat_lahir: (eventData && eventData.tempat_lahir) || "",
      tanggal_lahir: (eventData && eventData.tanggal_lahir) || "",
      kelas: (eventData && eventData.kelas) || "",
      tahun_ajaran: (eventData && eventData.tahun_ajaran) || "",
      alamat: (eventData && eventData.alamat) || "",
    },
    validationSchema: Yup.object({
      no_surat: Yup.string().required("No Surat is Required"),
      nama_siswa: Yup.string().required("Nama Siswa is Required"),
      tempat_lahir: Yup.string().required("Tempat Lahir is Required"),
      tanggal_lahir: Yup.string().required("Tanggal Lahir is Required"),
      kelas: Yup.string().required("Kelas is Required"),
      tahun_ajaran: Yup.string().required("Tahun Ajar is Required"),
      alamat: Yup.string().required("Alamat is Required"),
    }),

    onSubmit: (values) => {
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
        header: "No Surat",
        accessorKey: "no_surat",
        enableColumnFilter: false,
      },
      {
        header: "Nama Siswa",
        accessorKey: "nama_siswa",
        enableColumnFilter: false,
      },
      {
        header: "Tempat Lahir",
        accessorKey: "tempat_lahir",
        enableColumnFilter: false,
      },
      {
        header: "Tanggal Lahir",
        accessorKey: "tanggal_lahir",
        enableColumnFilter: false,
      },
      {
        header: "Kelas",
        accessorKey: "kelas",
        enableColumnFilter: false,
      },
      {
        header: "Tahun Ajar",
        accessorKey: "tahun_ajaran",
        enableColumnFilter: false,
      },
      {
        header: "Alamat",
        accessorKey: "alamat",
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
      const userResponse = await axiosInstance.get("/api/surat-aktif", {
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
        `/api/surat-aktif/${id}`,
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
        Success("Data Surat Aktif Berhasil Diupdate");
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
      formData.append("no_surat", data.no_surat);
      formData.append("nama_siswa", data.nama_siswa);
      formData.append("tempat_lahir", data.tempat_lahir);
      formData.append("tanggal_lahir", data.tanggal_lahir);
      formData.append("kelas", data.kelas);
      formData.append("tahun_ajaran", data.tahun_ajaran);
      formData.append("alamat", data.alamat);

      const userResponse = await axiosInstance.post(
        "/api/surat-aktif",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Surat Aktif Berhasil Ditambahkan");
        fetchDataBarangMasuk();
        toggle();
      }
    } catch (error: any) {
      Error("Data Surat Aktif Gagal Ditambahkan");
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
      formData.append("no_surat", data.no_surat);
      formData.append("nama_siswa", data.nama_siswa);
      formData.append("tempat_lahir", data.tempat_lahir);
      formData.append("tanggal_lahir", data.tanggal_lahir);
      formData.append("kelas", data.kelas);
      formData.append("tahun_ajaran", data.tahun_ajaran);
      formData.append("alamat", data.alamat);

      const userResponse = await axiosInstance.post(
        `/api/surat-aktif/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Surat Aktif Berhasil Diupdate");
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
        `/api/surat-aktif/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Surat Aktif Berhasil Dihapus");
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

  const [category, setCategory] = useState<any>([]);
  const fetchDataCategory = async () => {
    try {
      const response = await axiosInstance.get("/api/category", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCategory(response.data.data.data);
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
    fetchDataCategory();
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
      <BreadCrumb title="Surat Aktif" pageTitle="Surat Aktif" />
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
              Surat Aktif (<b className="total-Employs">{data.length}</b>)
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
                <span className="align-middle">Add Surat Aktif</span>
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

      {/* print */}
      <div style={{ display: "none" }}>
        <ReportPrint ref={printRef}>
          <div className="px-8 bg-white">
            <h1 className="text-center text-lg font-bold">
              SURAT KETERANGAN AKTIF
            </h1>
            <p className="text-center">
              {`w.o/6/PP.03.2/${validation.values.nomor_surat}/${new Date().getFullYear()}`}
            </p>
            <div className="mt-8">
              <p>Yang bertanda tangan di bawah ini :</p>
              <p>
                Nama: <span className="font-bold">HANIFAH, S.Pd.I</span>
              </p>
              <p>NIP: </p>
              <p>
                Jabatan: <span className="font-bold">Kepala Madrasah</span>
              </p>
              <p>
                Unit Kerja:{" "}
                <span className="font-bold">MTs Darul Istiqamah</span>
              </p>
            </div>
            <div className="mt-8">
              <p>Menerangkan bahwa siswa berikut :</p>
              <p>
                Nama:{" "}
                <span className="font-bold">
                  {validation.values.nama_siswa}
                </span>
              </p>
              <p>
                TTL:{" "}
                <span className="font-bold">
                  {validation.values.tempat_lahir},{" "}
                  {validation.values.tanggal_lahir}
                </span>
              </p>
              <p>
                Kelas:{" "}
                <span className="font-bold">{validation.values.kelas}</span>
              </p>
              <p>
                Tahun Ajaran:{" "}
                <span className="font-bold">
                  {validation.values.tahun_ajaran}
                </span>
              </p>
              <p>
                Alamat:{" "}
                <span className="font-bold">{validation.values.alamat}</span>
              </p>
            </div>
            <div className="mt-8">
              <p>
                {`Adalah santri/wati aktif di Pondok Pesantren Darul Istiqamah Barabai terhitung dari ${new Date().toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "long", year: "numeric" }
                )} hingga tanggal ${new Date(
                  new Date().setMonth(new Date().getMonth() + 1)
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}.`}
              </p>
              <p>
                Demikian Surat Keterangan ini diberikan untuk dapat dipergunakan
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
            {!!isEdit ? "Edit Surat Aktif" : "Add Surat Aktif"}
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
                  htmlFor="no_surat"
                  className="inline-block mb-2 text-base font-medium"
                >
                  No Surat
                </label>
                <input
                  type="text"
                  id="no_surat"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="No Surat"
                  name="no_surat"
                  onChange={validation.handleChange}
                  value={validation.values.no_surat || ""}
                />
                {validation.touched.no_surat && validation.errors.no_surat ? (
                  <p className="text-red-400">{validation.errors.no_surat}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="nama_siswa"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Nama Siswa
                </label>
                <input
                  type="text"
                  id="nama_siswa"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Nama Siswa"
                  name="nama_siswa"
                  onChange={validation.handleChange}
                  value={validation.values.nama_siswa || ""}
                />
                {validation.touched.nama_siswa &&
                validation.errors.nama_siswa ? (
                  <p className="text-red-400">{validation.errors.nama_siswa}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="tempat_lahir"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  id="tempat_lahir"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tempat Lahir"
                  name="tempat_lahir"
                  onChange={validation.handleChange}
                  value={validation.values.tempat_lahir || ""}
                />
                {validation.touched.tempat_lahir &&
                validation.errors.tempat_lahir ? (
                  <p className="text-red-400">
                    {validation.errors.tempat_lahir}
                  </p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="tanggal_lahir"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  id="tanggal_lahir"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tanggal Lahir"
                  name="tanggal_lahir"
                  onChange={validation.handleChange}
                  value={validation.values.tanggal_lahir || ""}
                />
                {validation.touched.tanggal_lahir &&
                validation.errors.tanggal_lahir ? (
                  <p className="text-red-400">
                    {validation.errors.tanggal_lahir}
                  </p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="kelas"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Kelas
                </label>
                <input
                  type="text"
                  id="kelas"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Kelas"
                  name="kelas"
                  onChange={validation.handleChange}
                  value={validation.values.kelas || ""}
                />
                {validation.touched.kelas && validation.errors.kelas ? (
                  <p className="text-red-400">{validation.errors.kelas}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="tahun_ajaran"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Tahun Ajar
                </label>
                <input
                  type="text"
                  id="tahun_ajaran"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tahun Ajar"
                  name="tahun_ajaran"
                  onChange={validation.handleChange}
                  value={validation.values.tahun_ajaran || ""}
                />
                {validation.touched.tahun_ajaran &&
                validation.errors.tahun_ajaran ? (
                  <p className="text-red-400">
                    {validation.errors.tahun_ajaran}
                  </p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="alamat"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Alamat
                </label>
                <input
                  type="text"
                  id="alamat"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Alamat"
                  name="alamat"
                  onChange={validation.handleChange}
                  value={validation.values.alamat || ""}
                />
                {validation.touched.alamat && validation.errors.alamat ? (
                  <p className="text-red-400">{validation.errors.alamat}</p>
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
                  : "Add Surat Aktif"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default SuratKeteranganAktif;
