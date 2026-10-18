import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import Modal from "../../components/ui/Modal.jsx";
import FormMessage from "../../components/ui/FormMessage.jsx";
import { labelClass, inputClass } from "../../components/ui/formStyles.js";
import { api } from "../../services/api.js";

export default function ChangePasswordModal({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatus(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!currentPassword) {
      setStatus({ type: "error", text: "कृपया अपना वर्तमान पासवर्ड दर्ज करें।" });
      return;
    }

    if (!newPassword) {
      setStatus({ type: "error", text: "कृपया नया पासवर्ड दर्ज करें।" });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: "error", text: "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        text: "नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await api.auth.changePassword(currentPassword, newPassword);
      if (res?.success) {
        setStatus({
          type: "success",
          text: "पासवर्ड सफलतापूर्वक बदल दिया गया है!",
        });
        setTimeout(() => {
          handleClose();
        }, 1800);
      } else {
        setStatus({
          type: "error",
          text: res?.message || "पासवर्ड बदलने में त्रुटि हुई।",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        text: err?.message || "वर्तमान पासवर्ड गलत है या सर्वर से कनेक्शन नहीं हो सका।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="पासवर्ड बदलें (Change Password)">
      <div className="space-y-4">
        <FormMessage status={status} />

        {status?.type === "success" ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-pasture-500 animate-bounce" />
            <p className="mt-3 font-medium text-brown-800">
              पासवर्ड सफलतापूर्वक अपडेट हो गया है!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label htmlFor="current-password" className={labelClass}>
                वर्तमान पासवर्ड (Current Password)
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="अपना पुराना पासवर्ड दर्ज करें"
                  className={`${inputClass} pr-10`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700"
                  aria-label={showCurrent ? "पासवर्ड छुपाएं" : "पासवर्ड दिखाएं"}
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="new-password" className={labelClass}>
                नया पासवर्ड (New Password)
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="कम से कम 6 अक्षर"
                  className={`${inputClass} pr-10`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700"
                  aria-label={showNew ? "पासवर्ड छुपाएं" : "पासवर्ड दिखाएं"}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirm-password" className={labelClass}>
                नया पासवर्ड दोबारा दर्ज करें (Confirm New Password)
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="नया पासवर्ड दोबारा लिखें"
                className={inputClass}
                autoComplete="new-password"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-xl border border-brown-200 px-4 py-2 text-sm font-medium text-brown-700 hover:bg-cream-50"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-pasture-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-pasture-600 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    बदल रहे हैं...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    पासवर्ड सेव करें
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
