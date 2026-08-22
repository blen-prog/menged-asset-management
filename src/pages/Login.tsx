import { Box, Monitor, Shield, Bus } from "lucide-react";
import logo from "../assets/menged-logo.png";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { usersData } from "../data/usersData";

export default function Login() {
  
  const cards = [
    {
      icon: <Box size={24} />,
      title: "Inventory",
      subtitle: "924 Items",
      color: "bg-gray-700",
    },
    {
      icon: <Monitor size={24} />,
      title: "Assets",
      subtitle: "213 Tracked",
      color: "bg-gray-800",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure",
      subtitle: "Role-Based Access",
      color: "bg-gray-700",
    },
    {
      icon: <Bus size={24} />,
      title: "Velocity Fleet",
      subtitle: "45+ Validators",
      color: "bg-gray-800",
    },
  ];
  const navigate = useNavigate();

const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
  const handleLogin = () => {
  const user = usersData.find(
    (u) =>
      u.phone === phone &&
      u.password === password
  );

  if (!user) {
    setError("Invalid phone number or password");
    return;
  }

  sessionStorage.setItem("isLoggedIn", "true");

  sessionStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  navigate("/");
};
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="fixed top-0 right-0 z-50 bg-gray-200 px-6 py-3 shadow-sm w-1/2 flex justify-end">
  <img src={logo} alt="Menged Logo" className="h-14" />
</div>

      <div className="min-h-screen flex">
        {/* Left Panel */}
        <div className="w-1/2 bg-black text-white p-14 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-16">
            <div className="bg-gray-800 p-4 rounded-2xl">
                <Bus size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Menged Solution PLC</h1>
                <p className="text-gray-400">Asset Management Systems</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white/10 border border-white/10 rounded-3xl p-6"
                >
                  <div
                    className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-5`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{card.title}</h3>
                  <p className="text-gray-400">{card.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Manage every asset.
              <br />
              From bus validators to laptops.
            </h2>
            <p className="text-gray-400 mt-6 text-l max-w-2xl">
              Real-time tracking of office assets, Velocity payment hardware,
              spare parts, maintenance, and employee assignments all in one
              platform.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <h1 className="text-5xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-3 mb-10 text-lg">
              Sign in to your account to continue
            </p>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">Phone Number</label>
                <input
  type="tel"
  placeholder="+251912345678"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="w-full p-4 rounded-xl border border-gray-300 bg-white"
/>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium">Password</label>
                  <button
                    type="button"
                    className="text-blue-600 text-sm"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
  type="password"
  placeholder="••••••••"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full p-4 rounded-xl border border-gray-300 bg-white"
/>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" />
                <span className="text-gray-600">Remember me for 30 days</span>
              </div>
              {error && (
  <p className="text-red-600 text-sm">
    {error}
  </p>
)}

<button
  onClick={handleLogin}
  className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-semibold"
>
  Sign In
</button>
            </div>

            <div className="border-t mt-14 pt-8 text-center text-gray-400 text-sm">
              © 2024 Menged Solution PLC · Addis Ababa, Ethiopia
              <br />
              Velocity Bus Payment System Management Platform
            </div>
          </div>
        </div>
      </div>
    </>
  );
}