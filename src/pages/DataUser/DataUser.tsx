import BreadCrumb from "Common/BreadCrumb";
import DeleteModal from "Common/DeleteModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { ImagePlus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import TableContainer from "Common/TableContainer";
import Modal from "Common/Components/Modal";
import dummyImg from "assets/images/users/user-dummy-img.jpg";
import { axiosInstance } from "lib/axios";
import Layout from "Layout";

const DataUser = () => {
  const naviagate = useNavigate();
  const [data, setData] = useState<any>([]);
  const [eventData, setEventData] = useState<any>();

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Image
  const [selectedImage, setSelectedImage] = useState<any>();

  const handleImageChange = (event: any) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        validation.setFieldValue("foto", file);
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      handleDeleteDataUser(eventData.id);
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
      name: (eventData && eventData.name) || "",
      nip: (eventData && eventData.nip) || "",
      foto: (eventData && eventData.foto) || "",
      role: (eventData && eventData.role) || "",
      email: (eventData && eventData.email) || "",
      password: (eventData && eventData.password) || "",
      no_telp: (eventData && eventData.no_telp) || "",
      alamat: (eventData && eventData.alamat) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      nip: Yup.string().required("NIP is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
      no_telp: Yup.string().required("Phone number is required"),
      alamat: Yup.string().required("Location is required"),
      role: Yup.string().required("Role is required"),
      foto: Yup.string().required("Image is required"),
    }),

    onSubmit: (values) => {
      if (isEdit) {
        handleUpdateDataUser(values);
      } else {
        handlePostDataUser(values);
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
      setSelectedImage("");
    } else {
      setShow(true);
      setEventData("");
      setSelectedImage("");
      validation.resetForm();
    }
  }, [show, validation]);

  // columns
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="flex items-center gap-3">
            <div className="size-6 rounded-full shrink-0 bg-slate-100">
              <img
                src={cell.row.original.foto || dummyImg}
                alt=""
                className="h-6 rounded-full"
              />
            </div>
            <h6 className="grow">{cell.getValue()}</h6>
          </div>
        ),
      },
      {
        header: "NIP",
        accessorKey: "nip",
        enableColumnFilter: false,
      },
      {
        header: "Email Id",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Phone Number",
        accessorKey: "no_telp",
        enableColumnFilter: false,
      },
      {
        header: "Location",
        accessorKey: "alamat",
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
              data-modal-target="addEmployeeModal"
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
        ),
      },
    ],
    []
  );

  const user = JSON.parse(localStorage.getItem("authUser")!);

  const fetchDataUser = async () => {
    try {
      const userResponse = await axiosInstance.get("/api/user", {
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
    }
  };

  const handlePostDataUser = async (data: any) => {
    try {
      setIsLoading(true);
      // upload file
      const formData = new FormData();
      formData.append("foto", data.foto);
      formData.append("name", data.name);
      formData.append("nip", data.nip);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("no_telp", data.no_telp);
      formData.append("alamat", data.alamat);
      formData.append("role", data.role);

      const userResponse = await axiosInstance.post("/api/user", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (userResponse.data.success === true) {
        fetchDataUser();
        toggle();
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDataUser = async (data: any) => {
    try {
      setIsLoading(true);
      // upload file
      const formData = new FormData();
      formData.append("foto", data.foto);
      formData.append("name", data.name);
      formData.append("nip", data.nip);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("no_telp", data.no_telp);
      formData.append("alamat", data.alamat);
      formData.append("role", data.role);

      const userResponse = await axiosInstance.post(
        `/api/user/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (userResponse.data.success === true) {
        fetchDataUser();
        toggle();
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDataUser = async (id: any) => {
    try {
      setIsLoading(true);
      const userResponse = await axiosInstance.delete(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (userResponse.data.success === true) {
        fetchDataUser();
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        naviagate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  return (
    <Layout>
      <BreadCrumb title="Data User" pageTitle="Users" />
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
              Employee (<b className="total-Employs">{data.length}</b>)
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
                <span className="align-middle">Add Employee</span>
              </Link>
            </div>
          </div>
          {data && data.length > 0 ? (
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
            {!!isEdit ? "Edit Employee" : "Add Employee"}
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
                <div className="relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                  <img
                    src={selectedImage || validation.values.foto || dummyImg}
                    alt=""
                    className="object-cover w-full h-full rounded-full user-profile-image"
                  />
                  <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                    <input
                      id="profile-img-file-input"
                      name="foto"
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
                {validation.touched.foto && validation.errors.foto ? (
                  <p className="text-red-400">{validation.errors.foto}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="nipInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  NIP
                </label>
                <input
                  type="text"
                  id="nipInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="NIP"
                  name="nip"
                  onChange={validation.handleChange}
                  value={validation.values.nip || ""}
                />
                {validation.touched.nip && validation.errors.nip ? (
                  <p className="text-red-400">{validation.errors.nip}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="employeeInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="employeeInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Employee name"
                  name="name"
                  onChange={validation.handleChange}
                  value={validation.values.name || ""}
                />
                {validation.touched.name && validation.errors.name ? (
                  <p className="text-red-400">{validation.errors.name}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="emailInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="emailInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="example@tailwick.com"
                  name="email"
                  onChange={validation.handleChange}
                  value={validation.values.email || ""}
                />
                {validation.touched.email && validation.errors.email ? (
                  <p className="text-red-400">{validation.errors.email}</p>
                ) : null}
              </div>
              {isEdit ? null : (
                <div className="xl:col-span-12">
                  <label
                    htmlFor="passwordInput"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="passwordInput"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    name="password"
                    onChange={validation.handleChange}
                    value={validation.values.password || ""}
                  />
                  {validation.touched.password && validation.errors.password ? (
                    <p className="text-red-400">{validation.errors.password}</p>
                  ) : null}
                </div>
              )}
              <div className="xl:col-span-6">
                <label
                  htmlFor="phoneNumberInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="locationInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter location"
                  name="no_telp"
                  onChange={validation.handleChange}
                  value={validation.values.no_telp || ""}
                />
                {validation.touched.no_telp && validation.errors.no_telp ? (
                  <p className="text-red-400">{validation.errors.no_telp}</p>
                ) : null}
              </div>
              <div className="xl:col-span-6">
                <label
                  htmlFor="locationInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="locationInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter location"
                  name="alamat"
                  onChange={validation.handleChange}
                  value={validation.values.alamat || ""}
                />
                {validation.touched.alamat && validation.errors.alamat ? (
                  <p className="text-red-400">{validation.errors.alamat}</p>
                ) : null}
              </div>
              <div className="xl:col-span-12">
                <label
                  htmlFor="designationSelect"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Role
                </label>
                <select
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  data-choices
                  data-choices-search-false
                  id="typeSelect"
                  name="role"
                  onChange={validation.handleChange}
                  value={validation.values.role || ""}
                >
                  <option value="admin">Admin</option>
                  <option value="guru">Guru</option>
                </select>
                {validation.touched.role && validation.errors.role ? (
                  <p className="text-red-400">{validation.errors.role}</p>
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
                {isLoading ? "Loading" : !!isEdit ? "Update" : "Add Employee"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default DataUser;
