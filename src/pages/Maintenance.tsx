import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Wrench,
} from "lucide-react";

export default function Maintenance({
  items,
}) {
  const [showRequestModal, setShowRequestModal] =
    useState(false);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [maintenanceRequests, setMaintenanceRequests] =
    useState([]);

  const [newRequest, setNewRequest] =
    useState({
      assetId: "",
      issue: "",
      technician: "",
      status: "Under Maintenance",
      notes: "",
    });

  const user = JSON.parse(
    sessionStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "Administrator";

  const [searchParams] =
    useSearchParams();

  useEffect(() => {
    if (
      searchParams.get("add") ===
      "request"
    ) {
      setShowRequestModal(true);

      window.history.replaceState(
        {},
        "",
        "/maintenance"
      );
    }
  }, [searchParams]);

  const filteredRequests =
    maintenanceRequests.filter((request) => {
      return (
        statusFilter === "All" ||
        request.status === statusFilter
      );
    });

  const handleAddRequest = () => {
    if (
      !newRequest.assetId ||
      !newRequest.issue
    ) {
      alert(
        "Please complete the required fields."
      );
      return;
    }

    const request = {
      id: `MNT-${String(
        maintenanceRequests.length + 1
      ).padStart(3, "0")}`,

      ...newRequest,

      createdDate:
        new Date().toLocaleDateString(),
    };

    setMaintenanceRequests([
      request,
      ...maintenanceRequests,
    ]);

    setNewRequest({
      assetId: "",
      issue: "",
      technician: "",
      status: "Under Maintenance",
      notes: "",
    });

    setShowRequestModal(false);
  };

  const underMaintenanceCount =
    maintenanceRequests.filter(
      (request) =>
        request.status ===
        "Under Maintenance"
    ).length;

  const repairedCount =
    maintenanceRequests.filter(
      (request) =>
        request.status === "Repaired"
    ).length;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Maintenance
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Track repairs and servicing
          </p>
        </div>

        <button
          onClick={() =>
            setShowRequestModal(true)
          }
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} />
          Maintenance Request
        </button>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Requests
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {maintenanceRequests.length}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Under Maintenance
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {underMaintenanceCount}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Repaired
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {repairedCount}
          </h2>
        </div>

      </div>

      {/* Filters */}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6">
        <div className="flex gap-3">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">
              All
            </option>

            <option value="Under Maintenance">
              Under Maintenance
            </option>

            <option value="Repaired">
              Repaired
            </option>
          </select>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Request ID
                </th>

                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Asset
                </th>

                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Issue
                </th>

                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Status
                </th>

                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Technician
                </th>

                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Date
                </th>

                <th className="p-4 text-center text-gray-600 dark:text-gray-300">
                  View
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredRequests.map(
                (request) => (
                  <tr
                    key={request.id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-4 text-gray-800 dark:text-gray-200">
                      {request.id}
                    </td>

                    <td className="p-4 text-gray-800 dark:text-gray-200">
                      {items.find(
                        (item) =>
                          item.id ===
                          request.assetId
                      )?.name ||
                        request.assetId}
                    </td>

                    <td className="p-4 text-gray-800 dark:text-gray-200">
                      {request.issue}
                    </td>

                    <td className="p-4">

                      {request.status ===
                      "Under Maintenance" ? (

                        isAdmin ? (
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={
                                request.status ===
                                "Repaired"
                              }
                              disabled={!isAdmin}
                              onChange={() => {
                                const confirmed =
                                  window.confirm(
                                    request.status ===
                                    "Repaired"
                                      ? "Return this item to Under Maintenance?"
                                      : "Has this item been repaired and returned to service?"
                                  );

                                if (!confirmed)
                                  return;

                                setMaintenanceRequests(
                                  maintenanceRequests.map(
                                    (r) =>
                                      r.id ===
                                      request.id
                                        ? {
                                            ...r,
                                            status:
                                              r.status ===
                                              "Repaired"
                                                ? "Under Maintenance"
                                                : "Repaired",
                                          }
                                        : r
                                  )
                                );
                              }}
                            />

                            Mark Repaired
                          </label>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs">
                            Under Maintenance
                          </span>
                        )

                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
                          Repaired
                        </span>
                      )}

                    </td>

                    <td className="p-4 text-gray-800 dark:text-gray-200">
                      {request.technician}
                    </td>

                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {request.createdDate}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          setSelectedRequest(
                            request
                          )
                        }
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                )
              )}

              {filteredRequests.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-500 dark:text-gray-400"
                  >
                    No maintenance requests
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* New Request Modal */}

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl w-full max-w-lg p-6 shadow-xl">

            <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
              New Maintenance Request
            </h2>

            <div className="space-y-4">

              <select
                value={
                  newRequest.assetId
                }
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    assetId:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">
                  Select Asset
                </option>

                {items
                  .filter(
                    (item) =>
                      item.type ===
                      "Asset"
                  )
                  .map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>

              <textarea
                placeholder="Issue Description"
                value={newRequest.issue}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    issue:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />

              <input
                type="text"
                placeholder="Technician / Vendor"
                value={
                  newRequest.technician
                }
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    technician:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />

              <textarea
                placeholder="Notes"
                value={newRequest.notes}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    notes:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setShowRequestModal(
                    false
                  )
                }
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleAddRequest
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Create Request
              </button>

            </div>

          </div>

        </div>
      )}

      {/* View Request Modal */}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl w-full max-w-lg p-6 shadow-xl">

            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Maintenance Details
            </h2>

            <div className="space-y-3 text-gray-700 dark:text-gray-300">

              <p>
                <strong className="text-gray-900 dark:text-white">
                  ID:
                </strong>{" "}
                {selectedRequest.id}
              </p>

              <p>
                <strong className="text-gray-900 dark:text-white">
                  Issue:
                </strong>{" "}
                {selectedRequest.issue}
              </p>

              <p>
                <strong className="text-gray-900 dark:text-white">
                  Status:
                </strong>{" "}
                {selectedRequest.status}
              </p>

              <p>
                <strong className="text-gray-900 dark:text-white">
                  Technician:
                </strong>{" "}
                {selectedRequest.technician}
              </p>

              <p>
                <strong className="text-gray-900 dark:text-white">
                  Notes:
                </strong>{" "}
                {selectedRequest.notes}
              </p>

            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() =>
                  setSelectedRequest(
                    null
                  )
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}