import BreadCrumb from "Common/BreadCrumb";
import DeleteModal from "Common/DeleteModal";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ImagePlus, Pencil, Plus, Search, Trash2 } from "lucide-react";
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import TableContainer from "Common/TableContainer";
import Modal from "Common/Components/Modal";
import { axiosInstance } from "lib/axios";
import Layout from "Layout";
import ReactToPrint, { useReactToPrint } from "react-to-print";

const AssetBarangPage = () => {
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
      handleDeleteDataBarang(eventData.id);
      setDeleteModal(false);
    }
  };
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
      nama: (eventData && eventData.nama) || "",
      merk: (eventData && eventData.merk) || "",
      id_category: (eventData && eventData.id_category) || "",
      jumlah: (eventData && eventData.jumlah) || "",
      satuan: (eventData && eventData.satuan) || "",
      harga: (eventData && eventData.harga) || "",
      keterangan: (eventData && eventData.keterangan) || "",
    },
    validationSchema: Yup.object({
      nama: Yup.string().required("Nama is required"),
      merk: Yup.string().required("Merk is required"),
      id_category: Yup.string().required("Category is required"),
      jumlah: Yup.number().required("Jumlah is required"),
      satuan: Yup.string().required("Satuan is required"),
      harga: Yup.number().required("Harga is required"),
      keterangan: Yup.string().required("Keterangan is required"),
    }),

    onSubmit: (values) => {
      console.log("🚀 ~ AssetBarangPage ~ values:", values);
      if (isEdit) {
        handleUpdateDataBarang(values);
      } else {
        handlePostBarang(values);
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
        header: "Kode",
        accessorKey: "kode",
        enableColumnFilter: false,
      },
      {
        header: "Name",
        accessorKey: "nama",
        enableColumnFilter: false,
      },
      {
        header: "Jumlah",
        accessorKey: "jumlah",
        enableColumnFilter: false,
      },
      {
        header: "Kategory",
        accessorKey: "category",
        enableColumnFilter: false,
      },
      {
        header: "Kondisi",
        accessorKey: "kondisi",
        enableColumnFilter: false,
      },
    ],
    []
  );

  const user = JSON.parse(localStorage.getItem("authUser")!);

  const [idCategory, setIdCategory] = useState<any>("");
  const [namaBarang, setNamaBarang] = useState<any>("");

  const fetchDataBarang = async () => {
    try {
      const userResponse = await axiosInstance.get("/api/asset-barang", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          category: idCategory,
          search: namaBarang,
        },
      });
      setData(userResponse.data.data.data);
    } catch (error) {
      console.log("🚀 ~ fetchDataUser ~ error:", error);
    }
  };

  const handlePostBarang = async (data: any) => {
    console.log("🚀 ~ handlePostBarang ~ data:", data);
    try {
      setIsLoading(true);
      // upload file
      const formData = new FormData();
      formData.append("nama", data.nama);
      formData.append("merk", data.merk);
      formData.append("id_category", data.id_category);
      formData.append("jumlah", data.jumlah);
      formData.append("satuan", data.satuan);
      formData.append("harga", data.harga);
      formData.append("keterangan", data.keterangan);

      const userResponse = await axiosInstance.post(
        "/api/asset-barang",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("🚀 ~ handlePostDataUser ~ userResponse:", userResponse);

      if (userResponse.data.success === true) {
        fetchDataBarang();
        toggle();
      }
    } catch (error) {
      console.log("🚀 ~ handlePostDataUser ~ errorss:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDataBarang = async (data: any) => {
    try {
      setIsLoading(true);
      // upload file
      const formData = new FormData();
      formData.append("nama", data.nama);
      formData.append("merk", data.merk);
      formData.append("id_category", data.id_category);
      formData.append("jumlah", data.jumlah);
      formData.append("satuan", data.satuan);
      formData.append("harga", data.harga);
      formData.append("keterangan", data.keterangan);

      const userResponse = await axiosInstance.post(
        `/api/barang/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("🚀 ~ handleUpdateDataUser ~ userResponse:", userResponse);

      if (userResponse.data.success === true) {
        fetchDataBarang();
        toggle();
      }
    } catch (error) {
      console.log("🚀 ~ handleUpdateDataUser ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDataBarang = async (id: any) => {
    try {
      setIsLoading(true);
      const userResponse = await axiosInstance.delete(`/api/barang/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log("🚀 ~ handleDeleteDataUser ~ userResponse:", userResponse);

      if (userResponse.data.success === true) {
        fetchDataBarang();
      }
    } catch (error) {
      console.log("🚀 ~ handleDeleteDataUser ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataBarang();
  }, [idCategory, namaBarang]);

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Your Document Title",
  });

  return (
    <Layout>
      <BreadCrumb title="Data Barang / Asset" pageTitle="Barang" />
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
              Barang / Asset (<b className="total-Employs">{data.length}</b>)
            </h6>
            <div className="shrink-0">
              <div className="xl:col-span-12 flex flex-row gap-2">
                {/* <ReactToPrint
                  trigger={() => {
                    return <button className="btn btn-primary">Print</button>;
                  }}
                  content={() => printRef.current}
                /> */}
                <div className="relative hidden ltr:ml-3 rtl:mr-3 lg:block group-data-[layout=horizontal]:hidden group-data-[layout=horizontal]:lg:block">
                  <input
                    type="text"
                    className="py-2 pr-4 text-sm text-topbar-item bg-topbar border border-topbar-border rounded pl-8 placeholder:text-slate-400 form-control focus-visible:outline-0 min-w-[300px] focus:border-blue-400 group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:border-topbar-border-dark group-data-[topbar=dark]:placeholder:text-slate-500 group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:border-topbar-border-brand group-data-[topbar=brand]:placeholder:text-blue-300 group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:border-zink-500 group-data-[topbar=dark]:dark:text-zink-100"
                    placeholder="Cari Barang / Asset"
                    autoComplete="off"
                    onChange={(e) => {
                      setNamaBarang(e.target.value);
                    }}
                  />
                  <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-topbar-item fill-slate-100 group-data-[topbar=dark]:fill-topbar-item-bg-hover-dark group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=brand]:fill-topbar-item-bg-hover-brand group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:text-zink-200 group-data-[topbar=dark]:dark:fill-zink-600" />
                </div>
                <select
                  id="id_category"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="id_category"
                  onChange={(e) => {
                    setIdCategory(e.target.value);
                  }}
                  value={idCategory || ""} // set default value
                >
                  <option value="">Semua Category</option>
                  {Array.from(
                    new Set(data.map((item: any) => item.category))
                  ).map((category: any) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {data && data.length > 0 ? (
            // for no get from 1 index
            (data.map((item: any, index: number) => {
              item.no = index + 1;
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
        <div ref={printRef} className="p-6 bg-white dark:bg-zink-800">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <img
                src="/images/pondok.png"
                alt="School Logo"
                className="h-24 w-24 mr-4"
              />
              <div className="text-center">
                <h1 className="text-lg font-bold">
                  PEMERINTAH KABUPATEN CILAWANG
                </h1>
                <h2 className="text-lg font-bold">
                  DINAS PENDIDIKAN, PEMUDA, DAN OLAHRAGA
                </h2>
                <h3 className="text-xl font-bold">SMA NEGERI 2 GUSU LAN</h3>
                <p className="text-sm">
                  Jl. Kalianget No. 13 Gusu Lan, Cilawang Kode Pos 6548
                </p>
                <p className="text-sm">
                  website: gusulan.cilawang.sch.id, Email: gusulan@gmail.com
                </p>
              </div>
            </div>
            <hr className="border-t-2 border-black" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">
            Data Barang / Asset
          </h2>
          <table className="min-w-full divide-y divide-slate-200 dark:divide-zink-600">
            <thead className="bg-slate-100 dark:bg-zink-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-zink-200 uppercase tracking-wider">
                  Stok
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zink-800 divide-y divide-slate-200 dark:divide-zink-600">
              {data && data.length > 0 ? (
                data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-zink-100">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-zink-200">
                      {item.namaBarang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-zink-200">
                      {item.kategori}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-zink-200">
                      {item.harga}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-zink-200">
                      {item.stok}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500 dark:text-zink-200"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-8 text-right">
            <p className="text-sm">Cilawang, [Tanggal Cetak]</p>
            <p className="text-sm">Kepala Sekolah</p>
            <div className="h-24"></div>
            <p className="text-sm font-bold">[Nama Kepala Sekolah]</p>
          </div>
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
            {!!isEdit ? "Edit Barang" : "Add Barang"}
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
                  htmlFor="namaBarang"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Nama Barang
                </label>
                <input
                  type="text"
                  id="namaBarang"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Nama Barang"
                  name="nama"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.nama || ""}
                />
                {validation.touched.nama && validation.errors.nama ? (
                  <p className="text-red-400">{validation.errors.nama}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="merkInput"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Merk
                </label>
                <input
                  type="text"
                  id="merkInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Merk"
                  name="merk"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.merk || ""}
                />
                {validation.touched.merk && validation.errors.merk ? (
                  <p className="text-red-400">{validation.errors.merk}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="id_category"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Category
                </label>
                {validation.touched.id_category &&
                validation.errors.id_category ? (
                  <p className="text-red-400">
                    {validation.errors.id_category}
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
                {/* select user */}
                <label
                  htmlFor="satuan"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Satuan
                </label>
                <select
                  id="satuan"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="satuan"
                  onChange={validation.handleChange}
                  value={validation.values.satuan || ""} // set default value
                >
                  <option value="">Pilih Satuan</option>
                  <option value="Buah">Buah</option>
                  <option value="Unit">Unit</option>
                  <option value="Meter">Meter</option>
                  <option value="Centimeter">Centimeter</option>
                  <option value="Milimeter">Milimeter</option>
                </select>
                {validation.touched.satuan && validation.errors.satuan ? (
                  <p className="text-red-400">{validation.errors.satuan}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="harga"
                  className="inline-block mb-2 text-balance font-medium"
                >
                  Harga
                </label>
                <input
                  type="number"
                  id="harga"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Harga"
                  name="harga"
                  onChange={validation.handleChange}
                  value={validation.values.harga || ""}
                />
                {validation.touched.harga && validation.errors.harga ? (
                  <p className="text-red-400">{validation.errors.harga}</p>
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
                {isLoading ? "Loading" : !!isEdit ? "Update" : "Add Barang"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default AssetBarangPage;
