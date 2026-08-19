import { ReactNode } from "react";
import { Plus, Wrench, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface User {
  role?: string;
}

interface ActionItem {
  title: string;
  icon: ReactNode;
  color: string;
  path: string;
}

export default function QuickActions() {
  const navigate = useNavigate();

  const user: User | null = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const isAdmin = user?.role === "Administrator";
  const isPurchase = user?.role === "Purchasing Manager";
  const isViewer = user?.role === "Viewer";

  if (isViewer) return null;

  const actions: ActionItem[] = [
    ...(isAdmin || isPurchase
      ? [
          {
            title: "Add Item",
            icon: <Plus size={18} />,
            color:
              "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600",
            path: "/all-items?add=item",
          },
        ]
      : []),
    {
      title: "Maintenance Request",
      icon: <Wrench size={18} />,
      color:
        "bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600",
      path: "/maintenance?add=request",
    },
    {
      title: "Item Request",
      icon: <ClipboardList size={18} />,
      color:
        "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600",
      path: "/requests?add=request",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-3 p-4 rounded-xl text-white transition transform hover:scale-105 active:scale-95 ${action.color}`}
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