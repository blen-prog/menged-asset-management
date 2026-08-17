import {
  Plus,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function QuickActions() {
  const user = JSON.parse(
  sessionStorage.getItem("user")
);

const isAdmin =
  user?.role === "Administrator";

  const isPurchase =
  user?.role === "Purchasing Manager";

const isViewer =
  user?.role === "Viewer";

  if (isViewer) return null;
  const navigate = useNavigate();
  const actions = [
  ...((isAdmin || isPurchase)
    ? [
        {
          title: "Add Item",
          icon: <Plus size={18} />,
          color: "bg-green-600 hover:bg-green-700",
        },
      ]
    : []),

  {
    title: "Maintenance Request",
    icon: <Wrench size={18} />,
    color: "bg-orange-600 hover:bg-orange-700",
  },
];

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3">
  {actions

    .map((action, index) => (
          <button
  key={index}
  onClick={() => {
    if (action.title === "Add Item") {
      navigate("/all-items?add=item");
    }
  }}
  className={`flex items-center gap-3 p-4 rounded-xl text-white transition transform hover:scale-105 ${action.color}`}
>
            <div className="p-2 rounded-lg bg-white/20">
              {action.icon}
            </div>

            <span className="text-sm font-medium">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}