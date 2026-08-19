import { useState } from "react";
import { initialEmployees } from "../data/employeesData";

import {
  Search,
  Plus,
  Phone,
  Mail,
  MoreHorizontal,
  Eye,
  Pencil,
  History,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


// ======================================================
// EMPLOYEES PAGE
// ======================================================

export default function Employees() {

  const [employees, setEmployees] = useState(initialEmployees);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (emp) => emp.status === "Inactive"
  ).length;

  const departments = new Set(
    employees.map((emp) => emp.department)
  ).size;

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [openMenu, setOpenMenu] =
    useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const employeesPerPage = 10;


  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredEmployees = employees.filter(
    (employee) => {

      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase()
          .includes(searchValue) ||

        employee.id
          .toLowerCase()
          .includes(searchValue) ||

        employee.employeeNumber
          .toLowerCase()
          .includes(searchValue) ||

        employee.department
          .toLowerCase()
          .includes(searchValue) ||

        employee.position
          .toLowerCase()
          .includes(searchValue) ||

        employee.email
          .toLowerCase()
          .includes(searchValue);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );
    }
  );


  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.ceil(
    filteredEmployees.length /
      employeesPerPage
  );

  const startIndex =
    (currentPage - 1) *
    employeesPerPage;

  const currentEmployees =
    filteredEmployees.slice(
      startIndex,
      startIndex + employeesPerPage
    );


  // ======================================================
  // FILTER HANDLERS
  // ======================================================

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDepartmentFilter = (value) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
  };


  // ======================================================
  // ROLE STYLE
  // ======================================================

  const getRoleStyle = (role) => {
    switch (role) {

      case "Administrator":
        return "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";

      case "Inventory Manager":
        return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";

      case "Maintenance":
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";

      case "Driver":
        return "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };


  // ======================================================
  // AVATAR COLORS
  // ======================================================

  const avatarColors = [
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  ];

  const getAvatarColor = (index) =>
    avatarColors[index % avatarColors.length];


  // ======================================================
  // SAVE EDIT
  // ======================================================

  const handleSaveEdit = (updatedEmployee) => {

    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === updatedEmployee.id
          ? updatedEmployee
          : employee
      )
    );

    setEditingEmployee(null);
  };


  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6"
      onClick={() => setOpenMenu(null)}
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Employees
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage employees and information
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

          Add Employee

        </button>

      </div>


      {/* ================================================= */}
      {/* STAT CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <StatCard
          title="Total Employees"
          value={totalEmployees}
        />

        <StatCard
          title="Active Employees"
          value={activeEmployees}
        />

        <StatCard
          title="Inactive Employees"
          value={inactiveEmployees}
        />

        <StatCard
          title="Departments"
          value={departments}
        />

      </div>


      {/* ================================================= */}
      {/* SEARCH + FILTERS */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row gap-3 mb-6">

        <div className="relative flex-1">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="w-full h-14 pl-11 pr-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
          />

        </div>


        <select
          value={departmentFilter}
          onChange={(e) =>
            handleDepartmentFilter(e.target.value)
          }
          className="h-14 lg:w-56 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 dark:text-gray-300"
        >

          <option value="All">
            All Departments
          </option>

          <option value="Administration">
            Administration
          </option>

          <option value="Operations">
            Operations
          </option>

          <option value="IT">
            IT
          </option>

          <option value="HR">
            HR
          </option>

          <option value="Finance">
            Finance
          </option>

        </select>

      </div>


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px]">

            <thead className="bg-gray-50 dark:bg-gray-800/70">

              <tr>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                  Employee
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                  Employee No
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                  Department
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                  Position
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                  Phone
                </th>

                <th className="text-left px-5 py-4 text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                  Email
                </th>

                <th className="w-16 px-4 py-4" />

              </tr>

            </thead>


            <tbody>

              {currentEmployees.length > 0 ? (

                currentEmployees.map(
                  (employee, index) => {

                    const initials =
                      `${employee.firstName} ${employee.lastName}`
                        .split(" ")
                        .map(
                          (name) =>
                            name[0]
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();


                    return (

                      <tr
                        key={employee.id}
                        className="border-t border-gray-100 dark:border-gray-800 transition-colors hover:bg-indigo-50/30 dark:hover:bg-gray-800/60"
                      >

                        {/* EMPLOYEE */}

                        <td className="px-5 py-5">

                          <button
                            onClick={() =>
                              setSelectedEmployee(
                                employee
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
                                ${getAvatarColor(index)}
                              `}
                            >
                              {initials}
                            </div>


                            <div>

                              <p className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                                {`${employee.firstName} ${employee.lastName}`}
                              </p>

                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {employee.id}
                              </p>

                            </div>

                          </button>

                        </td>


                        {/* EMPLOYEE NUMBER */}

                        <td className="px-5 py-5">

                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {employee.employeeNumber}
                          </span>

                        </td>


                        {/* DEPARTMENT */}

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
                              ${getRoleStyle(
                                employee.department
                              )}
                            `}
                          >
                            {employee.department}
                          </span>

                        </td>


                        {/* POSITION */}

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
                              ${getRoleStyle(
                                employee.position
                              )}
                            `}
                          >
                            {employee.position}
                          </span>

                        </td>


                        {/* PHONE */}

                        <td className="px-5 py-5">

                          <a
                            href={`tel:${employee.phone.replace(
                              /\s/g,
                              ""
                            )}`}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
                            title="Call employee"
                          >

                            <Phone
                              size={17}
                              className="text-gray-400"
                            />

                            {employee.phone}

                          </a>

                        </td>


                        {/* EMAIL */}

                        <td className="px-5 py-5">

                          <a
                            href={`mailto:${employee.email}`}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
                            title="Send email"
                          >

                            <Mail
                              size={17}
                              className="text-gray-400"
                            />

                            {employee.email}

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
                                openMenu === employee.id
                                  ? null
                                  : employee.id
                              )
                            }
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="More actions"
                            aria-label="More employee actions"
                          >

                            <MoreHorizontal
                              size={20}
                            />

                          </button>


                          {openMenu === employee.id && (

                            <div className="absolute right-4 top-14 z-30 w-52 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1">

                              {/* VIEW DETAILS */}

                              <button
                                onClick={() => {
                                  setSelectedEmployee(
                                    employee
                                  );
                                  setOpenMenu(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >

                                <Eye size={16} />

                                View Details

                              </button>


                              {/* EDIT */}

                              <button
                                onClick={() => {
                                  setEditingEmployee({
                                    ...employee,
                                  });
                                  setOpenMenu(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >

                                <Pencil size={16} />

                                Edit Employee

                              </button>


                              {/* TRANSACTIONS */}

                              <button
                                onClick={() =>
                                  setOpenMenu(null)
                                }
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >

                                <History size={16} />

                                View Transactions

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
                    colSpan={7}
                    className="py-16 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mb-3">

                        <Users size={22} />

                      </div>

                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        No employees found
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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

        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-h-[72px]">

          <p className="text-sm text-gray-500 dark:text-gray-400">

            Showing{" "}

            <span className="font-medium text-gray-700 dark:text-gray-200">

              {filteredEmployees.length === 0
                ? 0
                : startIndex + 1}

            </span>

            {" "}–{" "}

            <span className="font-medium text-gray-700 dark:text-gray-200">

              {Math.min(
                startIndex + employeesPerPage,
                filteredEmployees.length
              )}

            </span>

            {" "}of{" "}

            <span className="font-medium text-gray-700 dark:text-gray-200">

              {filteredEmployees.length}

            </span>

            {" "}employees

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
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
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
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >

                Next

                <ChevronRight size={16} />

              </button>

            </div>

          )}

        </div>

      </div>


      {/* ================================================= */}
      {/* EMPLOYEE DETAILS MODAL */}
      {/* ================================================= */}

      {selectedEmployee && (

        <EmployeeDetails
          employee={selectedEmployee}
          onClose={() =>
            setSelectedEmployee(null)
          }
        />

      )}


      {/* ================================================= */}
      {/* EDIT EMPLOYEE MODAL */}
      {/* ================================================= */}

      {editingEmployee && (

        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() =>
            setEditingEmployee(null)
          }
          onSave={handleSaveEdit}
        />

      )}


      {/* ================================================= */}
      {/* ADD EMPLOYEE MODAL */}
      {/* ================================================= */}

      {showAddModal && (

        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">

              <div>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Add Employee
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add a new employee to Menged
                </p>

              </div>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              >

                <X size={20} />

              </button>

            </div>


            <div className="p-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  placeholder="First Name"
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  placeholder="Last Name"
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  placeholder="Phone"
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  placeholder="Email"
                  type="email"
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="px-4 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium"
                >
                  Add Employee
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


// ======================================================
// EMPLOYEE DETAILS COMPONENT
// ======================================================

function EmployeeDetails({
  employee,
  onClose,
}) {

  const initials =
    `${employee.firstName} ${employee.lastName}`
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();


  return (

    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >

      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold">
              {initials}
            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {employee.firstName} {employee.lastName}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {employee.id} · {employee.position}
              </p>

            </div>

          </div>


          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>

        </div>


        {/* BODY */}

        <div className="p-6 space-y-6">

          {/* CONTACT */}

          <section>

            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <a
                href={`tel:${employee.phone.replace(
                  /\s/g,
                  ""
                )}`}
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >

                <Phone
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />

                <div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                    {employee.phone}
                  </p>

                </div>

              </a>


              <a
                href={`mailto:${employee.email}`}
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >

                <Mail
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />

                <div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>

                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1 break-all">
                    {employee.email}
                  </p>

                </div>

              </a>

            </div>

          </section>


          {/* EMPLOYEE INFORMATION */}

          <section>

            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Employee Information
            </h3>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">

              <div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Employee Number
                </p>

                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {employee.employeeNumber}
                </p>

              </div>


              <div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Department
                </p>

                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {employee.department}
                </p>

              </div>


              <div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Position
                </p>

                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {employee.position}
                </p>

              </div>


              <div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Employment Date
                </p>

                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {employee.employmentDate}
                </p>

              </div>

            </div>

          </section>

        </div>


        {/* FOOTER */}

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// EDIT EMPLOYEE MODAL
// ======================================================

function EditEmployeeModal({
  employee,
  onClose,
  onSave,
}) {

  const [form, setForm] = useState({
    ...employee,
  });


  const handleChange = (field, value) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  };


  return (

    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >

      <div
        className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">

          <div>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Edit Employee
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update employee information
            </p>

          </div>


          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >

            <X size={20} />

          </button>

        </div>


        {/* FORM */}

        <div className="p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              value={form.firstName || ""}
              onChange={(e) =>
                handleChange(
                  "firstName",
                  e.target.value
                )
              }
              placeholder="First Name"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />


            <input
              value={form.lastName || ""}
              onChange={(e) =>
                handleChange(
                  "lastName",
                  e.target.value
                )
              }
              placeholder="Last Name"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />


            <input
              value={form.employeeNumber || ""}
              onChange={(e) =>
                handleChange(
                  "employeeNumber",
                  e.target.value
                )
              }
              placeholder="Employee Number"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />


            <input
              value={form.department || ""}
              onChange={(e) =>
                handleChange(
                  "department",
                  e.target.value
                )
              }
              placeholder="Department"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />


            <input
              value={form.position || ""}
              onChange={(e) =>
                handleChange(
                  "position",
                  e.target.value
                )
              }
              placeholder="Position"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />


            <input
              value={form.employmentDate || ""}
              onChange={(e) =>
                handleChange(
                  "employmentDate",
                  e.target.value
                )
              }
              placeholder="Employment Date"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />


            <input
              value={form.phone || ""}
              onChange={(e) =>
                handleChange(
                  "phone",
                  e.target.value
                )
              }
              placeholder="Phone"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />


            <input
              value={form.email || ""}
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target.value
                )
              }
              placeholder="Email"
              type="email"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>


          {/* BUTTONS */}

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>


            <button
              onClick={() =>
                onSave(form)
              }
              className="px-4 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium"
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
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
}) {

  return (

    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
        {value}
      </h2>

    </div>

  );
}