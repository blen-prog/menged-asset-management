export default function StatCard({
  title,
  value,
  subtitle,
  color,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div
        className={`w-12 h-12 rounded-xl ${color} mb-4`}
      ></div>

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

      <p className="text-sm text-gray-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
}