import { usersData } from "../data/usersData";
import {
  X,
  Car,
  User,
  CalendarDays,
  Clock,
  FileText,
  CircleCheck,
  Wrench,
  RotateCcw,
  ArrowUpRight,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

export default function TransactionDetails({
  transaction,
  items,
  onClose,
}) {
  if (!transaction) return null;
 
 const asset = items.find(
  item => item.id === transaction.assetId
);

const employee = usersData.find(
  (user) => user.id === transaction.employeeId
);



  const getTypeIcon = () => {
    switch (transaction.type) {
      case "Assignment":
        return <ArrowUpRight size={16} />;

      case "Return":
        return <RotateCcw size={16} />;

      case "Maintenance":
        return <Wrench size={16} />;

      case "Disposal":
        return <ClipboardList size={16} />;

      default:
        return <FileText size={16} />;
    }
  };

  const getTypeStyle = () => {
    switch (transaction.type) {
      case "Assignment":
        return "bg-blue-50 text-blue-700 border border-blue-100";

      case "Return":
        return "bg-green-50 text-green-700 border border-green-100";

      case "Maintenance":
        return "bg-amber-50 text-amber-700 border border-amber-100";

      case "Disposal":
        return "bg-gray-100 text-gray-600 border border-gray-200";

      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-xl font-semibold text-gray-800">
                Transaction Details
              </h2>

              <span
                className={`inline-flex items-center justify-center gap-1.5 min-w-[110px] px-3 py-1.5 rounded-full text-xs font-medium ${getTypeStyle()}`}
              >
                {getTypeIcon()}
                {transaction.type}
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-1">
              {transaction.id}
            </p>

          </div>


          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>

        </div>


        {/* CONTENT */}

        <div className="p-6 space-y-6">


          {/* STATUS */}

          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">

            <div>

              <p className="text-xs text-gray-500">
                Transaction Status
              </p>

              <div className="flex items-center gap-2 mt-1">

                <CircleCheck
                  size={18}
                  className={
                    transaction.status === "Completed"
                      ? "text-green-600"
                      : "text-amber-600"
                  }
                />

                <span className="font-medium text-gray-800">
                  {transaction.status}
                </span>

              </div>

            </div>


            <div className="text-right">

              <p className="text-xs text-gray-500">
                Transaction ID
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {transaction.id}
              </p>

            </div>

          </div>


          {/* ASSET INFORMATION */}

          <section>

            <div className="flex items-center gap-2 mb-3">

              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">

                {asset?.purpose === "Vehicle"
                  ? <Car size={18} />
                  : <ClipboardList size={18} />
                }

              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  Asset Information
                </h3>

                <p className="text-xs text-gray-500">
                  Asset involved in this transaction
                </p>

              </div>

            </div>


            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">

              <DetailItem
                label="Asset Name"
                value={asset?.name}
              />

              <DetailItem
                label="Asset ID"
                value={transaction.assetId}
              />

              <DetailItem
                label="Category"
                value={asset?.category}
              />

              <DetailItem
                label="Asset Status"
                value={transaction.assetStatus}
              />

            </div>

          </section>


          {/* EMPLOYEE */}

          <section>

            <div className="flex items-center gap-2 mb-3">

              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <User size={18} />
              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  Employee Information
                </h3>

                <p className="text-xs text-gray-500">
                  Employee involved in the transaction
                </p>

              </div>

            </div>


            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">

              <DetailItem
                label="Employee Name"
                value={employee?.name}
              />

              <DetailItem
                label="Employee ID"
                value={transaction.employeeId}
              />

              <DetailItem
                label="Role"
                value={employee?.role}
              />

            </div>

          </section>


          {/* TRANSACTION INFORMATION */}

          <section>

            <div className="flex items-center gap-2 mb-3">

              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <FileText size={18} />
              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  Transaction Information
                </h3>

                <p className="text-xs text-gray-500">
                  Details about this activity
                </p>

              </div>

            </div>


            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">

              <DetailItem
                label="Transaction Type"
                value={transaction.type}
              />

              <DetailItem
                label="Date"
                value={transaction.date}
                icon={<CalendarDays size={14} />}
              />

              <DetailItem
                label="Time"
                value={transaction.time}
                icon={<Clock size={14} />}
              />

              <DetailItem
                label="Recorded By"
                value={transaction.recordedBy}
              />
              <DetailItem
  label="Cost"
  value={`ETB ${transaction.cost?.toLocaleString() || 0}`}
/>

            </div>

          </section>
          



          {/* CONDITION */}

          {transaction.condition && (

            <section>

              <h3 className="font-semibold text-gray-800 mb-3">
                Asset Condition
              </h3>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-xs text-gray-500">
                  Condition
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1">
                  {transaction.condition}
                </p>

              </div>

            </section>

          )}


          {/* NOTES */}

          {transaction.notes && (

            <section>

              <h3 className="font-semibold text-gray-800 mb-3">
                Notes
              </h3>

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-sm text-gray-600 leading-relaxed">
                  {transaction.notes}
                </p>

              </div>

            </section>

          )}


          {/* TIMELINE */}

          <section>

            <div className="flex items-center gap-2 mb-4">

              <ShieldCheck
                size={18}
                className="text-blue-600"
              />

              <h3 className="font-semibold text-gray-800">
                Transaction Timeline
              </h3>

            </div>


            <div className="relative ml-2">

              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />


              {/* CREATED */}

              <div className="relative flex gap-4 pb-6">

                <div className="relative z-10 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100 mt-1" />

                <div>

                  <p className="text-sm font-medium text-gray-800">
                    Transaction created
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {transaction.date} · {transaction.time}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Recorded by {transaction.recordedBy}
                  </p>

                </div>

              </div>


              {/* STATUS */}

              <div className="relative flex gap-4">

                <div className="relative z-10 w-4 h-4 rounded-full bg-green-600 border-4 border-green-100 mt-1" />

                <div>

                  <p className="text-sm font-medium text-gray-800">
                    {transaction.status}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Transaction successfully recorded
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>


        {/* FOOTER */}

        <div className="flex justify-end px-6 py-4 border-t border-gray-100">

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// REUSABLE DETAIL ITEM
// ======================================================

function DetailItem({
  label,
  value,
  icon,
}) {

  return (

    <div>

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800 mt-1">

        {icon}

        {value || "—"}

      </p>

    </div>
    

  );
}