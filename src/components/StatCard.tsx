import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  color = "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${color}`}
      >
        {icon}
      </div>

      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </h3>

      <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">
        {value}
      </h2>

      {subtitle && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}