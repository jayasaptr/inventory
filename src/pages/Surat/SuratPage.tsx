import BreadCrumb from "Common/BreadCrumb";
import DeleteModal from "Common/DeleteModal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, ToastPosition, toast } from "react-toastify";
import {
  CheckCircle,
  ClipboardList,
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

const PengarsipanSurat = () => {
  const [data, setData] = useState<any>([]);
  const [eventData, setEventData] = useState<any>();
  // Image
  const [selectedImage, setSelectedImage] = useState<any>();
  const handleImageChange = (event: any) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        validation.setFieldValue("kwitansi", file);
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      kwitansi: (eventData && eventData.image) || "",
      nomor_surat: (eventData && eventData.nomor_surat) || "",
      instansi: (eventData && eventData.instansi) || "",
      keterangan: (eventData && eventData.keterangan) || "",
      jenis_surat: (eventData && eventData.jenis_surat) || "",
      tanggal_surat: (eventData && eventData.tanggal_surat) || "",
    },
    validationSchema: Yup.object({
      kwitansi: Yup.string().required("Image is Required"),
      nomor_surat: Yup.string().required("No Surat is Required"),
      instansi: Yup.string().required("Instansi is Required"),
      keterangan: Yup.string().required("Keterangan is Required"),
      jenis_surat: Yup.string().required("Jenis Surat is Required"),
      tanggal_surat: Yup.string().required("Tanggal Surat is Required"),
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

  //   show image with modal
  const [showImage, setShowImage] = useState(false);

  const [image, setImage] = useState("");

  const printRef = useRef<HTMLDivElement>(null);
  const handleShowImage = (image: string) => {
    setImage(image);
    setShowImage(true);
  };

  // columns
  const columns = useMemo(
    () => [
      {
        header: "No",
        accessorKey: "no",
        enableColumnFilter: false,
      },
      {
        header: "Images",
        cell: (cell: any) => (
          <button
            onClick={() => handleShowImage(cell.row.original.image)}
            className="flex items-center gap-3"
          >
            <div className="size-6 bg-slate-100">
              <img src={cell.row.original.image} alt="" className="h-6" />
            </div>
            <h6 className="grow">{cell.getValue()}</h6>
          </button>
        ),
      },
      {
        header: "No Surat",
        accessorKey: "nomor_surat",
        enableColumnFilter: false,
      },
      {
        header: "Instansi",
        accessorKey: "instansi",
        enableColumnFilter: false,
      },
      {
        header: "Keterangan",
        accessorKey: "keterangan",
        enableColumnFilter: false,
      },
      {
        header: "Jenis Surat",
        accessorKey: "jenis_surat",
        enableColumnFilter: false,
      },
      {
        header: "Tanggal Surat",
        accessorKey: "tanggal_surat",
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

  const [jenisSurat, setJenisSurat] = useState<any>("");

  const fetchDataBarangMasuk = async () => {
    setLoadingV(true);
    try {
      const userResponse = await axiosInstance.get("/api/surat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          jenis_surat: jenisSurat,
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
        `/api/surat/${id}`,
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
        Success("Data Arsip Surat Berhasil Diupdate");
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
      formData.append("instansi", data.instansi);
      formData.append("keterangan", data.keterangan);
      formData.append("jenis_surat", data.jenis_surat);
      formData.append("tanggal_surat", data.tanggal_surat);
      // image
      if (data.kwitansi) {
        formData.append("image", data.kwitansi);
      }

      const userResponse = await axiosInstance.post("/api/surat", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (userResponse.data.success === true) {
        Success("Data Arsip Surat Berhasil Ditambahkan");
        fetchDataBarangMasuk();
        toggle();
      }
    } catch (error: any) {
      Error("Data Arsip Surat Gagal Ditambahkan");
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
      formData.append("instansi", data.instansi);
      formData.append("keterangan", data.keterangan);
      formData.append("jenis_surat", data.jenis_surat);
      formData.append("tanggal_surat", data.tanggal_surat);
      // image
      if (data.kwitansi) {
        formData.append("image", data.kwitansi);
      }

      const userResponse = await axiosInstance.post(
        `/api/surat/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Arsip Surat Berhasil Diupdate");
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
      const userResponse = await axiosInstance.delete(`/api/surat/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (userResponse.data.success === true) {
        Success("Data Arsip Surat Berhasil Dihapus");
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

  useEffect(() => {
    fetchDataBarangMasuk();
  }, [jenisSurat]);

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
      <BreadCrumb title="Pengarsipan Surat" pageTitle="Pengarsipan Surat" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <Modal
        show={showImage}
        onHide={() => setShowImage(false)}
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-500"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">Kwitansi</Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
          <div className="flex justify-center">
            <img src={image} alt="" className="h-96" />
          </div>
        </Modal.Body>
      </Modal>
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
              Arsip Surat (<b className="total-Employs">{data.length}</b>)
            </h6>
            <div className="flex flex-row gap-2">
              <select
                className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                name="id_category"
                onChange={(e) => setJenisSurat(e.target.value)}
                value={jenisSurat || "0"}
              >
                <option value="">Semua Kondisi</option>
                <option value="surat masuk">Surat Masuk</option>
                <option value="surat keluar">Surat Keluar</option>
              </select>
              <div className="shrink-0">
                <Link
                  to="#!"
                  data-modal-target="addEmployeeModal"
                  type="button"
                  className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 add-employee"
                  onClick={toggle}
                >
                  <Plus className="inline-block size-4" />{" "}
                  <span className="align-middle">Add Pengarsipan Surat</span>
                </Link>
              </div>
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
            <p className="text-center">{validation.values.nomor_surat}</p>
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
            {!!isEdit ? "Edit Arsip Surat" : "Add Arsip Surat"}
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
                <div className="relative size-24 mx-auto mb-4 shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                  {selectedImage ? (
                    <img
                      src={selectedImage || validation.values.kwitansi}
                      alt=""
                      className="object-cover w-full h-full user-profile-image"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <ClipboardList className="size-8 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                    </div>
                  )}
                  <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                    <input
                      id="profile-img-file-input"
                      name="kwitansi"
                      type="file"
                      accept="image/*"
                      className="hidden profile-img-file-input"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="profile-img-file-input"
                      className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit"
                    >
                      <ImagePlus className="size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                    </label>
                  </div>
                </div>
                {validation.touched.kwitansi && validation.errors.kwitansi ? (
                  <p className="text-red-400">{validation.errors.kwitansi}</p>
                ) : null}
              </div>
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
                  htmlFor="instansi"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Instansi
                </label>
                <input
                  type="text"
                  id="instansi"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Instansi"
                  name="instansi"
                  onChange={validation.handleChange}
                  value={validation.values.instansi || ""}
                />
                {validation.touched.instansi && validation.errors.instansi ? (
                  <p className="text-red-400">{validation.errors.instansi}</p>
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
              <div className="xl:col-span-12">
                <label
                  htmlFor="jenis_surat"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Jenis Surat
                </label>
                <select
                  id="jenis_surat"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="jenis_surat"
                  onChange={(e) => {
                    validation.handleChange(e);
                    validation.setFieldValue("jenis_surat", e.target.value);
                  }}
                  onBlur={validation.handleBlur}
                  value={validation.values.jenis_surat || ""} // set default value
                >
                  <option value="">Pilih Jenis Surat</option>
                  <option value="surat masuk">Surat Masuk</option>
                  <option value="surat keluar">Surat Keluar</option>
                </select>
                {validation.touched.jenis_surat &&
                validation.errors.jenis_surat ? (
                  <p className="text-red-400">
                    {validation.errors.jenis_surat}
                  </p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="tanggal_surat"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Tanggal Surat
                </label>
                <input
                  type="date"
                  id="tanggal_surat"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Kelas"
                  name="tanggal_surat"
                  onChange={validation.handleChange}
                  value={validation.values.tanggal_surat || ""}
                />
                {validation.touched.tanggal_surat &&
                validation.errors.tanggal_surat ? (
                  <p className="text-red-400">
                    {validation.errors.tanggal_surat}
                  </p>
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
                  : "Add Arsip Surat"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default PengarsipanSurat;
