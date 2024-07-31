import BreadCrumb from "Common/BreadCrumb";
import DeleteModal from "Common/DeleteModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer, ToastPosition, toast } from "react-toastify";
import {
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  Check,
  BookMarked,
  ClipboardList,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import TableContainer from "Common/TableContainer";
import Modal from "Common/Components/Modal";
import { axiosInstance } from "lib/axios";
import Layout from "Layout";

const PengajuanPerbaikan = () => {
  const [data, setData] = useState<any>([]);
  const [eventData, setEventData] = useState<any>();
  const [id, setId] = useState<number>(0);

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = () => setDeleteModal(!deleteModal);

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

  // Delete Data
  const onClickDelete = (cell: any) => {
    setDeleteModal(true);
    // setId(cell);
    if (cell.id) {
      setEventData(cell);
    }
  };

  const handleDelete = () => {
    if (eventData) {
      handleDeleteDataBarangMasuk(eventData.id);
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
      id_barang_masuk: (eventData && eventData.id_barang_masuk.id) || "",
      jumlah: (eventData && eventData.jumlah) || "",
      biaya: (eventData && eventData.biaya) || "",
      tanggal_perbaikan: (eventData && eventData.tanggal_perbaikan) || "",
      tanggal_selesai: (eventData && eventData.tanggal_selesai) || "",
      keterangan: (eventData && eventData.keterangan) || "",
      kwitansi: (eventData && eventData.kwitansi) || "",
    },
    validationSchema: Yup.object({
      id_barang_masuk: Yup.string().required("Pilih Barang"),
      jumlah: Yup.number().required("Jumlah Harus Diisi"),
      biaya: Yup.number().required("Biaya Harus Diisi"),
      tanggal_perbaikan: Yup.string().required("Tanggal Perbaikan Harus Diisi"),
      tanggal_selesai: Yup.string().required("Tanggal Selesai Harus Diisi"),
      keterangan: Yup.string().required("Keterangan Harus Diisi"),
      kwitansi: Yup.string().required("Kwitansi Harus Diisi"),
    }),

    onSubmit: (values) => {
      console.log("🚀 ~ PengajuanPerbaikan ~ values:", values);
      if (isEdit) {
      } else {
        handlePostPerbaikan(values);
      }
      if (isLoading) {
        toggle();
      }
    },
  });

  //   show image with modal
  const [showImage, setShowImage] = useState(false);

  const [image, setImage] = useState("");

  const handleShowImage = (image: string) => {
    setImage(image);
    setShowImage(true);
  };

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

  const user = JSON.parse(localStorage.getItem("authUser")!);

  // columns
  const columns = useMemo(
    () => [
      {
        header: "No",
        accessorKey: "no",
        enableColumnFilter: false,
      },
      {
        header: "Kwitansi",
        cell: (cell: any) => (
          <button
            onClick={() => handleShowImage(cell.row.original.kwitansi)}
            className="flex items-center gap-3"
          >
            <div className="size-6 bg-slate-100">
              <img src={cell.row.original.kwitansi} alt="" className="h-6" />
            </div>
            <h6 className="grow">{cell.getValue()}</h6>
          </button>
        ),
      },
      {
        header: "Nama",
        accessorKey: "id_barang_masuk.nama",
        enableColumnFilter: false,
      },
      {
        header: "Merk",
        accessorKey: "id_barang_masuk.merk",
        enableColumnFilter: false,
      },
      {
        header: "Tanggal Perbaikan",
        accessorKey: "tanggal_perbaikan",
        enableColumnFilter: false,
      },
      {
        header: "Tanggal Selesai",
        accessorKey: "tanggal_selesai",
        enableColumnFilter: false,
      },
      {
        header: "Jumlah",
        accessorKey: "jumlah",
        enableColumnFilter: false,
      },
      {
        header: "Biaya",
        accessorKey: "biaya",
        enableColumnFilter: false,
      },
      {
        header: "Keterangan",
        accessorKey: "keterangan",
        enableColumnFilter: false,
      },
      {
        header: "Kepala Ruangan",
        accessorKey: "id_user.name",
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
            {cell.row.original.status === "disetuji" ? null : (
              <Link
                to="#!"
                className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
                onClick={() => {
                  const data = cell.row.original;
                  if (user.user.role === "admin") {
                    updateStatus(data.id);
                  } else {
                    onClickDelete(data);
                  }
                }}
              >
                {user.user.role === "admin" ? (
                  <Check className="size-4" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Link>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const naviagate = useNavigate();

  const fetchDataPerbaikan = async () => {
    setLoadingV(true);
    const userQuery = "api/perbaikan?search=" + user.user.id;
    const adminQuery = "api/perbaikan";

    try {
      const userResponse = await axiosInstance.get(
        user.user.role === "admin" ? adminQuery : userQuery,
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

  //update status by admin
  const updateStatus = async (id: number) => {
    const formData = new FormData();
    formData.append("status", "disetuji");
    try {
      const response = await axiosInstance.post(
        `/api/perbaikan/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data.success === true) {
        Success("Status Perbaikan Berhasil Diupdate");
        fetchDataPerbaikan();
      }
    } catch (error: any) {
      Error("Status Perbaikan Gagal Diupdate");
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    }
  };

  const handlePostPerbaikan = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("id_barang_masuk", data.id_barang_masuk);
      formData.append("tanggal_perbaikan", data.tanggal_perbaikan);
      formData.append("tanggal_selesai", data.tanggal_selesai);
      formData.append("biaya", data.biaya);
      formData.append("keterangan", data.keterangan);
      formData.append("jumlah", data.jumlah);
      formData.append("kwitansi", data.kwitansi);
      formData.append("status", "proses");

      const userResponse = await axiosInstance.post(
        "/api/perbaikan",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Data Barang Keluar Berhasil Ditambahkan");
        fetchDataPerbaikan();
        toggle();
      }
    } catch (error: any) {
      Error("Data Barang Keluar Gagal Ditambahkan");
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDataBarangMasuk = async (id: any) => {
    try {
      setIsLoading(true);
      const userResponse = await axiosInstance.delete(`/api/perbaikan/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (userResponse.data.success === true) {
        Success("Data Perbaikan Berhasil Dihapus");
        fetchDataPerbaikan();
      }
    } catch (error: any) {
      Error("Data Perbaikan Gagal Dihapus");
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [barang, setBarang] = useState<any>([]);

  const fetchDataBarang = async () => {
    try {
      const response = await axiosInstance.get("/api/barang-masuk", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBarang(response.data.data.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    }
  };

  useEffect(() => {
    fetchDataPerbaikan();
    fetchDataBarang();
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
      <BreadCrumb title="Data Barang" pageTitle="Barang" />
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

      {/* Modal show image */}
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
      <div className="card" id="employeeTable">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <h6 className="text-15 grow">
              Perbaikan (<b className="total-Employs">{data.length}</b>)
            </h6>
            {user.user.role === "admin" ? null : (
              <div className="shrink-0">
                <Link
                  to="#!"
                  data-modal-target="addEmployeeModal"
                  type="button"
                  className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 add-employee"
                  onClick={toggle}
                >
                  <Plus className="inline-block size-4" />{" "}
                  <span className="align-middle">Ajukan Perbaikan</span>
                </Link>
              </div>
            )}
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
            {!!isEdit ? "Edit Barang" : "Add Barang Masuk"}
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
                  htmlFor="id_barang_masuk"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Pilih Barang
                </label>
                <select
                  id="id_barang_masuk"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="id_barang_masuk"
                  onChange={(e) => {
                    validation.handleChange(e);
                    validation.setFieldValue("id_barang_masuk", e.target.value);
                  }}
                  onBlur={validation.handleBlur}
                  value={
                    validation.values.id_barang_masuk ||
                    (eventData && eventData.id_barang_masuk.id) ||
                    ""
                  }
                >
                  <option value="">Pilih Barang</option>
                  {barang.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.nama}
                    </option>
                  ))}
                </select>
                {validation.touched.id_barang_masuk &&
                validation.errors.id_barang_masuk ? (
                  <p className="text-red-400">
                    {validation.errors.id_barang_masuk}
                  </p>
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
                  htmlFor="biaya"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Biaya
                </label>
                <input
                  type="number"
                  id="biaya"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Biaya"
                  name="biaya"
                  onChange={validation.handleChange}
                  value={validation.values.biaya || ""}
                />
                {validation.touched.biaya && validation.errors.biaya ? (
                  <p className="text-red-400">{validation.errors.biaya}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="tanggal_perbaikan"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Tanggal Perbaikan
                </label>
                <input
                  type="date"
                  id="tanggal_perbaikan"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tanggal Perbaikan"
                  name="tanggal_perbaikan"
                  onChange={validation.handleChange}
                  value={validation.values.tanggal_perbaikan || ""}
                />
                {validation.touched.tanggal_perbaikan &&
                validation.errors.tanggal_perbaikan ? (
                  <p className="text-red-400">
                    {validation.errors.tanggal_perbaikan}
                  </p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="tanggal_selesai"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  id="tanggal_selesai"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Tanggal Selesai"
                  name="tanggal_selesai"
                  onChange={validation.handleChange}
                  value={validation.values.tanggal_selesai || ""}
                />
                {validation.touched.tanggal_selesai &&
                validation.errors.tanggal_selesai ? (
                  <p className="text-red-400">
                    {validation.errors.tanggal_selesai}
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
                {isLoading ? "Loading" : !!isEdit ? "Update" : "Add Perbaikan"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default PengajuanPerbaikan;
