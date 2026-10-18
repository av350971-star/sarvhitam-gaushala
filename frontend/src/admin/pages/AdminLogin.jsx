import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ArrowLeft, Home, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import LogoMark from "../../components/ui/LogoMark.jsx";
import FormMessage from "../../components/ui/FormMessage.jsx";
import { inputClass, labelClass } from "../../components/ui/formStyles.js";

export default function AdminLogin() {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);

  // If already authenticated, show friendly options instead of an infinite redirect loop
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brown-900 px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-lift sm:p-8">
          <LogoMark className="mx-auto h-12 w-12" />
          <h1 className="mt-3 font-display text-2xl text-brown-800">
            आप पहले से लॉगिन हैं
          </h1>
          <p className="mt-2 text-sm text-brown-500">
            आप वर्तमान में Admin सेशन में प्रमाणित हैं।
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 rounded-full bg-pasture-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pasture-600 shadow-soft"
            >
              Dashboard पर जाएं
            </Link>

            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-full border border-brown-200 py-2.5 text-sm font-medium text-brown-700 transition-colors hover:bg-cream-50"
            >
              <Home className="h-4 w-4" />
              मुख्य वेबसाइट पर जाएं
            </Link>

            <button
              type="button"
              onClick={logout}
              className="pt-2 text-xs text-red-500 hover:text-red-700 hover:underline"
            >
              दूसरे खाते से लॉगिन करें (Logout)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setStatus({ type: "error", text: "कृपया email और password दोनों दर्ज करें।" });
      return;
    }

    try {
      const res = await login(email, password);
      if (res === true || res?.success) {
        const redirectTo = location.state?.from?.pathname || "/admin";
        navigate(redirectTo, { replace: true });
      } else {
        setStatus({
          type: "error",
          text: res?.message || "Invalid email या password। कृपया पुनः प्रयास करें।",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        text: err?.message || "Login में त्रुटि हुई। कृपया पुनः प्रयास करें।",
      });
    }
  };

  const handleGoBack = () => {
    // If user arrived from another page on the site, go back; otherwise go to Home
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brown-900 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-lift sm:p-8">
        {/* Navigation Back Link */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brown-400 transition-colors hover:text-brown-700"
          >
            <ArrowLeft className="h-4 w-4" />
            वापस जाएं (Back)
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-brown-400 hover:text-brown-700"
            title="मुख्य वेबसाइट"
          >
            <Home className="h-3.5 w-3.5" />
            होम
          </Link>
        </div>

        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="h-12 w-12" />
          <h1 className="mt-3 font-display text-2xl text-brown-800">Admin Login</h1>
          <p className="mt-1 text-sm text-brown-400">
            सर्व हितम सेवा गौशाला CMS
          </p>
        </div>

        <FormMessage status={status} />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="admin-email" className={labelClass}>
              Email / Username
            </label>
            <input
              id="admin-email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="admin@gaushala.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Password छिपाएं" : "Password दिखाएं"}
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-brown-400 transition-colors hover:bg-cream-100 hover:text-brown-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-pasture-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pasture-600 shadow-soft"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Login
          </button>
        </form>

        <div className="mt-6 border-t border-cream-200 pt-4 text-center">
          <Link
            to="/"
            className="text-xs text-brown-500 transition-colors hover:text-pasture-600 hover:underline"
          >
            ← मुख्य वेबसाइट पर वापस जाएं
          </Link>
        </div>
      </div>
    </div>
  );
}
