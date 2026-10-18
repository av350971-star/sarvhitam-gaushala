import { useState, useEffect } from "react";
import { Users, Heart, MessageSquare, Phone, Mail, MapPin, Calendar, Loader2 } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader.jsx";
import AdminCard from "../components/AdminCard.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { api } from "../../services/api.js";

export default function InquiriesAdmin() {
  const [activeTab, setActiveTab] = useState("volunteers");
  const [volunteers, setVolunteers] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAllInquiries = async () => {
      setLoading(true);
      try {
        const [volRes, adoptRes, suggRes] = await Promise.allSettled([
          api.volunteers.get(),
          api.adoptions.get(),
          api.suggestions.get(),
        ]);

        if (!isMounted) return;

        if (volRes.status === "fulfilled" && volRes.value?.data) {
          setVolunteers(volRes.value.data);
        }
        if (adoptRes.status === "fulfilled" && adoptRes.value?.data) {
          setAdoptions(adoptRes.value.data);
        }
        if (suggRes.status === "fulfilled" && suggRes.value?.data) {
          setSuggestions(suggRes.value.data);
        }
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllInquiries();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="आवेदन एवं सुझाव (Inquiries)"
        subtitle="वेबसाइट पर आम जनता द्वारा भेजे गए स्वयंसेवक आवेदन, गोद लेने के अनुरोध और सुझाव।"
      />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-brown-200/50 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("volunteers")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "volunteers"
              ? "bg-pasture-500 text-white shadow-soft"
              : "bg-white text-brown-700 hover:bg-cream-100"
          }`}
        >
          <Users className="h-4 w-4" />
          स्वयंसेवक आवेदन ({volunteers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("adoptions")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "adoptions"
              ? "bg-pasture-500 text-white shadow-soft"
              : "bg-white text-brown-700 hover:bg-cream-100"
          }`}
        >
          <Heart className="h-4 w-4" />
          गौ माता गोद अनुरोध ({adoptions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("suggestions")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "suggestions"
              ? "bg-pasture-500 text-white shadow-soft"
              : "bg-white text-brown-700 hover:bg-cream-100"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          सुझाव ({suggestions.length})
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-pasture-500" />
        </div>
      ) : (
        <div>
          {/* Volunteers Tab */}
          {activeTab === "volunteers" && (
            <div>
              {volunteers.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="अभी कोई स्वयंसेवक आवेदन नहीं मिला है।"
                  subtitle="वेबसाइट पर 'Volunteer' फॉर्म से आवेदन आने पर यहाँ दिखेंगे।"
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {volunteers.map((vol) => (
                    <AdminCard key={vol._id} className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-base font-semibold text-brown-800">
                            {vol.fullName}
                          </h3>
                          {vol.sevaType && (
                            <span className="shrink-0 rounded-full bg-pasture-50 px-2.5 py-0.5 text-xs font-medium text-pasture-700">
                              {vol.sevaType}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs text-brown-600">
                          <p className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-brown-400" />
                            <a href={`tel:${vol.phone}`} className="hover:underline font-medium text-brown-800">
                              {vol.phone}
                            </a>
                          </p>
                          {vol.email && (
                            <p className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-brown-400" />
                              <a href={`mailto:${vol.email}`} className="hover:underline">
                                {vol.email}
                              </a>
                            </p>
                          )}
                          {vol.city && (
                            <p className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-brown-400" />
                              {vol.city}
                            </p>
                          )}
                        </div>

                        {vol.message && (
                          <div className="mt-3 rounded-lg bg-cream-50 p-2.5 text-xs text-brown-700">
                            <p className="font-medium text-brown-500 mb-0.5">संदेश:</p>
                            {vol.message}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 border-t border-brown-100 pt-2 flex items-center justify-between text-[11px] text-brown-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(vol.createdAt)}
                        </span>
                        <a
                          href={`https://wa.me/91${vol.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-pasture-600 hover:underline"
                        >
                          WhatsApp करें
                        </a>
                      </div>
                    </AdminCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Adoptions Tab */}
          {activeTab === "adoptions" && (
            <div>
              {adoptions.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="अभी कोई गोद लेने का अनुरोध नहीं आया है।"
                  subtitle="वेबसाइट पर 'गौ माता गोद लें' फॉर्म से अनुरोध यहाँ दिखेंगे।"
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {adoptions.map((req) => (
                    <AdminCard key={req._id} className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-base font-semibold text-brown-800">
                            {req.applicantName}
                          </h3>
                          {req.cowName && (
                            <span className="shrink-0 rounded-full bg-marigold-50 px-2.5 py-0.5 text-xs font-medium text-marigold-600">
                              गौ: {req.cowName}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs text-brown-600">
                          <p className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-brown-400" />
                            <a href={`tel:${req.phone}`} className="hover:underline font-medium text-brown-800">
                              {req.phone}
                            </a>
                          </p>
                          {req.email && (
                            <p className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-brown-400" />
                              <a href={`mailto:${req.email}`} className="hover:underline">
                                {req.email}
                              </a>
                            </p>
                          )}
                          {req.address && (
                            <p className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-brown-400" />
                              {req.address}
                            </p>
                          )}
                        </div>

                        {req.message && (
                          <div className="mt-3 rounded-lg bg-cream-50 p-2.5 text-xs text-brown-700">
                            <p className="font-medium text-brown-500 mb-0.5">विवरण:</p>
                            {req.message}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 border-t border-brown-100 pt-2 flex items-center justify-between text-[11px] text-brown-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(req.createdAt)}
                        </span>
                        <a
                          href={`https://wa.me/91${req.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-pasture-600 hover:underline"
                        >
                          WhatsApp करें
                        </a>
                      </div>
                    </AdminCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === "suggestions" && (
            <div>
              {suggestions.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="अभी कोई सुझाव प्राप्त नहीं हुआ है।"
                  subtitle="वेबसाइट पर 'सुझाव' फॉर्म द्वारा भेजे गए सुझाव यहाँ दिखेंगे।"
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((sug) => (
                    <AdminCard key={sug._id} className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-base font-semibold text-brown-800">
                            {sug.name || "अनाम नागरिक"}
                          </h3>
                        </div>

                        {sug.phone && (
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-brown-500">
                            <Phone className="h-3 w-3 text-brown-400" />
                            <a href={`tel:${sug.phone}`} className="hover:underline">
                              {sug.phone}
                            </a>
                          </p>
                        )}

                        <div className="mt-3 rounded-lg bg-cream-50 p-3 text-xs leading-relaxed text-brown-800">
                          {sug.suggestion}
                        </div>
                      </div>

                      <div className="mt-4 border-t border-brown-100 pt-2 flex items-center justify-between text-[11px] text-brown-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(sug.createdAt)}
                        </span>
                        {sug.phone && (
                          <a
                            href={`https://wa.me/91${sug.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-pasture-600 hover:underline"
                          >
                            WhatsApp करें
                          </a>
                        )}
                      </div>
                    </AdminCard>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
