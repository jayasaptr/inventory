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

const BarangRuanganPage = () => {
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
      id_asset_barang: (eventData && eventData.id_asset_barang.id) || "",
      id_ruangan: (eventData && eventData.id_ruangan.id) || "",
      jumlah: (eventData && eventData.jumlah) || "",
      keterangan: (eventData && eventData.keterangan) || "",
    },
    validationSchema: Yup.object({
      id_asset_barang: Yup.string().required("Pilih Barang"),
      id_ruangan: Yup.string().required("Pilih Ruangan"),
      jumlah: Yup.number().required("Jumlah harus diisi"),
      keterangan: Yup.string().required("Keterangan harus diisi"),
    }),

    onSubmit: (values) => {
      console.log("🚀 ~ PengajuanPerbaikan ~ values:", values);
      if (isEdit) {
      } else {
        handlePostPermintaan(values);
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
        header: "Nama",
        accessorKey: "id_asset_barang.nama",
        enableColumnFilter: false,
      },
      {
        header: "Jumlah",
        accessorKey: "jumlah",
        enableColumnFilter: false,
      },
      {
        header: "Keterangan",
        accessorKey: "keterangan",
        enableColumnFilter: false,
      },
      {
        header: "Ruangan",
        accessorKey: "id_ruangan.nama",
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
      },
      {
        header: "Tanggal Permintaan",
        accessorKey: "tanggal",
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

  const fetchDataBarangRuangan = async () => {
    setLoadingV(true);
    const userQuery = "api/new-barang-ruangan?search=" + user.user.id;
    const adminQuery = "api/new-barang-ruangan";

    try {
      const userResponse = await axiosInstance.get(
        user.user.role === "admin" || user.user.role === "staf"
          ? adminQuery
          : userQuery,
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
        `/api/new-barang-ruangan/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data.success === true) {
        Success("Status Perbaikan Berhasil Diupdate");
        fetchDataBarangRuangan();
      }
    } catch (error: any) {
      Error("Status Perbaikan Gagal Diupdate");
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    }
  };

  const handlePostPermintaan = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("id_asset_barang", data.id_asset_barang);
      formData.append("id_ruangan", data.id_ruangan);
      formData.append("jumlah", data.jumlah);
      formData.append("keterangan", data.keterangan);
      formData.append("id_user", user.user.id);
      formData.append("tanggal", new Date().toISOString().split("T")[0]);
      formData.append("status", "diproses");

      const userResponse = await axiosInstance.post(
        "/api/new-barang-ruangan",
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
        fetchDataBarangRuangan();
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
      const userResponse = await axiosInstance.delete(
        `/api/new-barang-ruangan/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (userResponse.data.success === true) {
        Success("Barang Berhasil Dihapus");
        fetchDataBarangRuangan();
      }
    } catch (error: any) {
      Error("Barang Gagal Dihapus");
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
      const response = await axiosInstance.get("/api/asset-barang", {
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

  const [ruangan, setRuangan] = useState<any>([]);

  const fetchDataRuanganByUserId = async () => {
    const idUser = user.user.id;
    try {
      if (user.user.role === "kabag") {
        const response = await axiosInstance.get(
          `/api/ruangan-user?id_user=${idUser}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setRuangan(response.data.data);
      } else {
        const response = await axiosInstance.get(`/api/ruangan`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setRuangan(response.data.data.data);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    }
  };

  useEffect(() => {
    fetchDataRuanganByUserId();
    fetchDataBarangRuangan();
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
      <BreadCrumb
        title="Data Permintaan Barang"
        pageTitle="Permintaan Barang"
      />
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
              Permintaan (<b className="total-Employs">{data.length}</b>)
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
                  <span className="align-middle">Ajukan Permintaan</span>
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
            {!!isEdit ? "Edit Barang" : "Ajukan Permintaan"}
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
                  htmlFor="id_asset_barang"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Pilih Barang
                </label>
                <select
                  id="id_asset_barang"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="id_asset_barang"
                  onChange={(e) => {
                    validation.handleChange(e);
                    validation.setFieldValue("id_asset_barang", e.target.value);
                  }}
                  onBlur={validation.handleBlur}
                  value={
                    validation.values.id_asset_barang ||
                    (eventData && eventData.id_asset_barang.id) ||
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
                {validation.touched.id_asset_barang &&
                validation.errors.id_asset_barang ? (
                  <p className="text-red-400">
                    {validation.errors.id_asset_barang}
                  </p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="id_ruangan"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Pilih Ruangan
                </label>
                <select
                  id="id_ruangan"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="id_ruangan"
                  onChange={(e) => {
                    validation.handleChange(e);
                    validation.setFieldValue("id_ruangan", e.target.value);
                  }}
                  onBlur={validation.handleBlur}
                  value={
                    validation.values.id_ruangan ||
                    (eventData && eventData.id_ruangan.id) ||
                    ""
                  }
                >
                  <option value="">Pilih Ruangan</option>
                  {ruangan.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.nama}
                    </option>
                  ))}
                </select>
                {validation.touched.id_ruangan &&
                validation.errors.id_ruangan ? (
                  <p className="text-red-400">{validation.errors.id_ruangan}</p>
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
                {isLoading ? "Loading" : !!isEdit ? "Update" : "Add Permintaan"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default BarangRuanganPage;
