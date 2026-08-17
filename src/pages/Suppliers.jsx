import { useState } from "react";

import { initialSuppliers } from "../data/suppliersData";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  MoreHorizontal,
  Eye,
  Pencil,
  History,
  X,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


// ======================================================
// SUPPLIERS PAGE
// ======================================================

export default function Suppliers() {




  const [suppliers, setSuppliers] =
  useState(initialSuppliers);
    const totalSuppliers = suppliers.length;


const categories = new Set(
  suppliers.map((sup) => sup.category)
).size;

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");


  const [selectedSupplier, setSelectedSupplier] =
    useState(null);

  const [openMenu, setOpenMenu] =
    useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const suppliersPerPage = 10;
  const [editingSupplier, setEditingSupplier] =
  useState(null);


  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredSuppliers = suppliers.filter(
    (supplier) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
  supplier.companyName
    .toLowerCase()
    .includes(searchValue) ||
  supplier.id
    .toLowerCase()
    .includes(searchValue) ||
  supplier.supplierNumber
    .toLowerCase()
    .includes(searchValue) ||
  supplier.contactPerson
    .toLowerCase()
    .includes(searchValue) ||
  supplier.category
    .toLowerCase()
    .includes(searchValue) ||
  supplier.email
    .toLowerCase()
    .includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        supplier.category === categoryFilter;


      return (
        matchesSearch &&
        matchesCategory 
        
      );
    }
  );


  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.ceil(
    filteredSuppliers.length /
      suppliersPerPage
  );

  const startIndex =
    (currentPage - 1) *
    suppliersPerPage;

  const currentSuppliers =
    filteredSuppliers.slice(
      startIndex,
      startIndex + suppliersPerPage
    );


  // ======================================================
  // FILTER HANDLERS
  // ======================================================

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };


  // ======================================================
  // CATEGORY STYLE
  // ======================================================

  const getCategoryStyle = (category) => {
    switch (category) {
      case "Raw Materials":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "Packaging":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Equipment":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "Logistics":
        return "bg-green-50 text-green-700 border-green-100";

      case "Services":
        return "bg-pink-50 text-pink-700 border-pink-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };





  // ======================================================
  // AVATAR COLORS
  // ======================================================

  const avatarColors = [
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-orange-100 text-orange-700",
    "bg-green-100 text-green-700",
    "bg-pink-100 text-pink-700",
  ];

  const getAvatarColor = (index) =>
    avatarColors[index % avatarColors.length];


  return (
    <div
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
      onClick={() => setOpenMenu(null)}
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Suppliers
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage suppliers and information
          </p>

        </div>


        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-medium transition-colors"
        >

          <Plus size={18} />

          Add Supplier

        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
<StatCard
  title="Total Suppliers"
  value={totalSuppliers}
/>



<StatCard
  title="Categories"
  value={categories}
/>
</div>



      {/* ================================================= */}
      {/* SEARCH + FILTERS */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row gap-3 mb-6">

        {/* SEARCH */}

        <div className="relative flex-1">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="w-full h-14 pl-11 pr-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

        </div>


        {/* CATEGORY */}

        <select
          value={categoryFilter}
          onChange={(e) =>
            handleCategoryFilter(e.target.value)
          }
          className="h-14 lg:w-56 px-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
        >

         <option value="All">
  All Categories
</option>

<option value="Raw Materials">
  Raw Materials
</option>

<option value="Packaging">
  Packaging
</option>

<option value="Logistics">
  Logistics
</option>

<option value="Equipment">
  Equipment
</option>

<option value="Services">
  Services
</option>

        </select>


       

      </div>


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1300px]">

            {/* HEADER */}

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Supplier
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Supplier No
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Category
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Contact Person
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Phone
                </th>
                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
  Email
</th>

                

                <th className="w-16 px-4 py-4" />

              </tr>

            </thead>


            {/* BODY */}

            <tbody>

              {currentSuppliers.length > 0 ? (

                currentSuppliers.map(
                  (supplier, index) => {

                    const initials =
                      supplier.companyName

                        .split(" ")
                        .map(
                          (word) =>
                            word[0]
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();


                    return (

                      <tr
                        key={supplier.id}
                        className="border-t border-gray-100 transition-colors hover:bg-indigo-50/30"
                      >

                        {/* SUPPLIER */}

                        <td className="px-5 py-5">

                          <button
                            onClick={() =>
                              setSelectedSupplier(
                                supplier
                              )
                            }
                            className="flex items-center gap-3 text-left group"
                          >

                            <div
                              className={`
                                w-11 h-11
                                rounded-full
                                flex items-center justify-center
                                font-semibold
                                text-sm
                                ${getAvatarColor(
                                  index
                                )}
                              `}
                            >
                              {initials}
                            </div>


                            <div>

                              <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                {supplier.companyName}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                {supplier.id}
                              </p>

                            </div>

                          </button>

                        </td>

                        <td className="px-5 py-5">
  <span className="text-gray-700 font-medium">
    {supplier.supplierNumber}
  </span>
</td>





                        {/* CATEGORY */}

                        <td className="px-5 py-5">

                          <span
                            className={`
                              inline-flex
                              items-center
                              px-3
                              py-1.5
                              rounded-full
                              border
                              text-xs
                              font-medium
                              whitespace-nowrap
                              ${getCategoryStyle(
                                supplier.category
                              )}
                            `}
                          >
                            {supplier.category}
                          </span>

                        </td>

                        <td className="px-5 py-5">
  <span className="text-gray-700">
    {supplier.contactPerson}
  </span>
</td>


                        {/* PHONE */}

                        <td className="px-5 py-5">

                          <a
                            href={`tel:${supplier.phone.replace(
                              /\s/g,
                              ""
                            )}`}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-700 transition-colors whitespace-nowrap"
                            title="Call supplier"
                          >

                            <Phone
                              size={17}
                              className="text-gray-400"
                            />

                            {supplier.phone}

                          </a>

                        </td>


                        {/* EMAIL */}

                        <td className="px-5 py-5">

                          <a
                            href={`mailto:${supplier.email}`}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-700 transition-colors whitespace-nowrap"
                            title="Send email"
                          >

                            <Mail
                              size={17}
                              className="text-gray-400"
                            />

                            {supplier.email}

                          </a>

                        </td>



                        {/* ACTION MENU */}

                        <td
                          className="px-4 py-5 relative"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >

                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu ===
                                  supplier.id
                                  ? null
                                  : supplier.id
                              )
                            }
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            title="More actions"
                            aria-label="More supplier actions"
                          >

                            <MoreHorizontal
                              size={20}
                            />

                          </button>


                          {openMenu ===
                            supplier.id && (

                            <div className="absolute right-4 top-14 z-30 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1">

                              {/* VIEW DETAILS */}

                              <button
                                onClick={() => {
                                  setSelectedSupplier(
                                    supplier
                                  );
                                  setOpenMenu(
                                    null
                                  );
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >

                                <Eye size={16} />

                                View Details

                              </button>


                              {/* EDIT */}

                              <button
  onClick={() => {
    setEditingSupplier(supplier);
    setOpenMenu(null);
  }}
  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
>

                                <Pencil
                                  size={16}
                                />

                                Edit Supplier

                              </button>


                              {/* PURCHASE HISTORY */}

                              <button
                                onClick={() =>
                                  setOpenMenu(
                                    null
                                  )
                                }
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >

                                <History
                                  size={16}
                                />

                                View Purchase History

                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="py-16 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">

                        <Truck size={22} />

                      </div>

                      <p className="font-medium text-gray-700">
                        No suppliers found
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Try changing your search or filters.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ================================================= */}
        {/* PAGINATION */}
        {/* ================================================= */}

        <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-h-[72px]">

          <p className="text-sm text-gray-500">

            Showing{" "}

            <span className="font-medium text-gray-700">

              {filteredSuppliers.length === 0
                ? 0
                : startIndex + 1}

            </span>

            {" "}–{" "}

            <span className="font-medium text-gray-700">

              {Math.min(
                startIndex +
                  suppliersPerPage,
                filteredSuppliers.length
              )}

            </span>

            {" "}of{" "}

            <span className="font-medium text-gray-700">

              {filteredSuppliers.length}

            </span>

            {" "}suppliers

          </p>


          {totalPages > 1 && (

            <div className="flex items-center gap-1">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >

                <ChevronLeft size={16} />

                Previous

              </button>


              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`
                    min-w-9
                    h-9
                    rounded-lg
                    text-sm
                    font-medium
                    ${
                      currentPage === page
                        ? "bg-indigo-700 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >

                  {page}

                </button>

              ))}


              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >

                Next

                <ChevronRight size={16} />

              </button>

            </div>

          )}

        </div>

      </div>


      {/* ================================================= */}
      {/* SUPPLIER DETAILS MODAL */}
      {/* ================================================= */}

      {selectedSupplier && (

        <SupplierDetails
          supplier={selectedSupplier}
          onClose={() =>
            setSelectedSupplier(null)
          }
        />

      )}

      {editingSupplier && (
  <EditSupplierModal
    supplier={editingSupplier}
    onClose={() =>
      setEditingSupplier(null)
    }
    onSave={(updatedSupplier) => {
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === updatedSupplier.id
            ? updatedSupplier
            : supplier
        )
      );

      setEditingSupplier(null);
    }}
  />
)}

      


      {/* ================================================= */}
      {/* ADD SUPPLIER MODAL */}
      {/* ================================================= */}

      {showAddModal && (

        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Add Supplier
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add a new supplier to Menged
                </p>

              </div>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >

                <X size={20} />

              </button>

            </div>


            <div className="p-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  placeholder="Company Name"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
                />

                <input
                  placeholder="Contact Person"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  placeholder="Category"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  placeholder="Phone"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  placeholder="Email"
                  type="email"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  placeholder="Address"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
                />

              </div>


              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="px-4 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium"
                >
                  Add Supplier
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function EditSupplierModal({
  supplier,
  onClose,
  onSave,
}) {
  const [formData, setFormData] =
    useState(supplier);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">
            Edit Supplier
          </h2>

          <button
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={formData.companyName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  companyName:
                    e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2.5 sm:col-span-2"
            />

            <input
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactPerson:
                    e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2.5"
            />

            <input
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category:
                    e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2.5"
            />

            <input
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone:
                    e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2.5"
            />

            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                    e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2.5"
            />

            <input
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address:
                    e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2.5 sm:col-span-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
  <button
    onClick={onClose}
    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
  >
    Cancel
  </button>

  <button
  onClick={() => {
    onSave(formData);
  }}
  className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium"
>
  Save Changes
</button>
</div>

      </div>
    </div>
  </div>
);
}


// ======================================================
// SUPPLIER DETAILS COMPONENT
// ======================================================

function SupplierDetails({
  supplier,
  onClose,
}) {

const initials =
  supplier.companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >

      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
              {initials}
            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                {supplier.companyName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {supplier.id} · {supplier.category}             </p>

            </div>

          </div>


          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>

        </div>


        {/* BODY */}

        <div className="p-6 space-y-6">

          {/* CONTACT */}

          <section>

            <h3 className="font-semibold text-gray-800 mb-3">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <a
                href={`tel:${supplier.phone.replace(
                  /\s/g,
                  ""
                )}`}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors"
              >

                <Phone
                  size={18}
                  className="text-indigo-600"
                />

                <div>

                  <p className="text-xs text-gray-500">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {supplier.phone}
                  </p>

                </div>

              </a>


              <a
                href={`mailto:${supplier.email}`}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors"
              >

                <Mail
                  size={18}
                  className="text-indigo-600"
                />

                <div>

                  <p className="text-xs text-gray-500">
                    Email
                  </p>

                  <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                    {supplier.email}
                  </p>

                </div>

              </a>


              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl sm:col-span-2">

                <MapPin
                  size={18}
                  className="text-indigo-600"
                />

                <div>

                  <p className="text-xs text-gray-500">
                    Address
                  </p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {supplier.address}
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* SUPPLIER INFORMATION */}

          <section>

            <h3 className="font-semibold text-gray-800 mb-3">
              Supplier Information
            </h3>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
  <div>
    <p className="text-xs text-gray-500">
      Supplier Number
    </p>
    <p className="font-medium">
      {supplier.supplierNumber}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500">
      Category
    </p>
    <p className="font-medium">
      {supplier.category}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500">
      Contact Person
    </p>
    <p className="font-medium">
      {supplier.contactPerson}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500">
      Onboarded Date
    </p>
    <p className="font-medium">
      {supplier.onboardedDate}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500">
      Status
    </p>
    <p className="font-medium">
      {supplier.status}
    </p>
  </div>
</div>

          </section>


          

        </div>


        {/* FOOTER */}

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );

}
  function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        {value}
      </h2>

    </div>
  );
}