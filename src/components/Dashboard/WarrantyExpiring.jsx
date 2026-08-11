import { ShieldAlert } from "lucide-react";

export default function WarrantyExpiring() {
  const warranties = [
    {
      item: "Dell Latitude 5520",
      expiry: "7 days",
    },
    {
      item: "Cisco Catalyst 2960",
      expiry: "12 days",
    },
    {
      item: "HP LaserJet Pro",
      expiry: "18 days",
    },
    {
      item: "Ticket Validator V204",
      expiry: "25 days",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Warranty Expiring Soon
      </h2>

      <div className="space-y-3">
        {warranties.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 border-b pb-3 last:border-0"
          >
            <div className="bg-yellow-100 p-2 rounded-lg">
              <ShieldAlert
                size={16}
                className="text-yellow-600"
              />
            </div>

            <div>
              <p className="text-sm font-medium">
                {item.item}
              </p>

              <p className="text-xs text-red-500">
                Expires in {item.expiry}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full text-sm text-blue-600 font-medium">
        View All
      </button>
    </div>
  );
}