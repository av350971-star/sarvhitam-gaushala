import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage, generateId } from "../utils/storage.js";
import {
  defaultSiteInfo,
  defaultStatistics,
  defaultCows,
  defaultGallery,
  defaultDonation,
} from "../data/defaultData.js";
import { api } from "../services/api.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [siteInfo, setSiteInfo] = useState(() =>
    loadFromStorage("siteInfo", defaultSiteInfo)
  );
  const [statistics, setStatistics] = useState(() =>
    loadFromStorage("statistics", defaultStatistics)
  );
  const [cows, setCows] = useState(() => loadFromStorage("cows", defaultCows));
  const [gallery, setGallery] = useState(() =>
    loadFromStorage("gallery", defaultGallery)
  );
  const [donation, setDonation] = useState(() =>
    loadFromStorage("donation", defaultDonation)
  );

  // Sync state to localStorage cache
  useEffect(() => saveToStorage("siteInfo", siteInfo), [siteInfo]);
  useEffect(() => saveToStorage("statistics", statistics), [statistics]);
  useEffect(() => saveToStorage("cows", cows), [cows]);
  useEffect(() => saveToStorage("gallery", gallery), [gallery]);
  useEffect(() => saveToStorage("donation", donation), [donation]);

  // Fetch fresh data from Backend on mount
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        const [siteRes, statsRes, cowsRes, galleryRes, donRes] = await Promise.allSettled([
          api.siteInfo.get(),
          api.statistics.get(),
          api.cows.get(),
          api.gallery.get(),
          api.donation.get(),
        ]);

        if (!isMounted) return;

        if (siteRes.status === "fulfilled" && siteRes.value?.data) {
          setSiteInfo(siteRes.value.data);
        }
        if (statsRes.status === "fulfilled" && Array.isArray(statsRes.value?.data) && statsRes.value.data.length > 0) {
          setStatistics(statsRes.value.data);
        }
        if (cowsRes.status === "fulfilled" && Array.isArray(cowsRes.value?.data)) {
          setCows(cowsRes.value.data);
        }
        if (galleryRes.status === "fulfilled" && Array.isArray(galleryRes.value?.data)) {
          setGallery(galleryRes.value.data);
        }
        if (donRes.status === "fulfilled" && donRes.value?.data) {
          setDonation(donRes.value.data);
        }
      } catch (err) {
        console.warn("Could not fetch remote data, using local cache:", err.message);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------- Website Information ----------
  const updateSiteInfo = async (patch) => {
    const updated = { ...siteInfo, ...patch };
    setSiteInfo(updated);
    try {
      await api.siteInfo.update(updated);
    } catch (e) {
      console.warn("Backend updateSiteInfo failed, saved locally:", e.message);
    }
  };

  // ---------- Statistics ----------
  const addStatistic = async (stat) => {
    const newStat = {
      id: generateId("stat"),
      enabled: true,
      value: null,
      label: "",
      ...stat,
    };
    setStatistics((prev) => [...prev, newStat]);
    try {
      await api.statistics.add(newStat);
    } catch (e) {
      console.warn("Backend addStatistic failed, saved locally:", e.message);
    }
  };

  const updateStatistic = async (id, patch) => {
    setStatistics((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
    try {
      await api.statistics.update(id, patch);
    } catch (e) {
      console.warn("Backend updateStatistic failed, saved locally:", e.message);
    }
  };

  const deleteStatistic = async (id) => {
    setStatistics((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.statistics.delete(id);
    } catch (e) {
      console.warn("Backend deleteStatistic failed, saved locally:", e.message);
    }
  };

  // ---------- Gau Mata / Cows ----------
  const addCow = async (cow) => {
    const newCow = {
      id: generateId("cow"),
      name: "",
      photo: "",
      description: "",
      status: "स्वस्थ",
      adoptionInfo: "",
      ...cow,
    };
    setCows((prev) => [newCow, ...prev]);
    try {
      await api.cows.add(newCow);
    } catch (e) {
      console.warn("Backend addCow failed, saved locally:", e.message);
    }
  };

  const updateCow = async (id, patch) => {
    setCows((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    try {
      await api.cows.update(id, patch);
    } catch (e) {
      console.warn("Backend updateCow failed, saved locally:", e.message);
    }
  };

  const deleteCow = async (id) => {
    setCows((prev) => prev.filter((c) => c.id !== id));
    try {
      await api.cows.delete(id);
    } catch (e) {
      console.warn("Backend deleteCow failed, saved locally:", e.message);
    }
  };

  // ---------- Gallery ----------
  const addPhoto = async (photo) => {
    const newPhoto = {
      id: generateId("photo"),
      image: "",
      title: "",
      description: "",
      category: "Other",
      ...photo,
    };
    setGallery((prev) => [newPhoto, ...prev]);
    try {
      await api.gallery.add(newPhoto);
    } catch (e) {
      console.warn("Backend addPhoto failed, saved locally:", e.message);
    }
  };

  const updatePhoto = async (id, patch) => {
    setGallery((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    try {
      await api.gallery.update(id, patch);
    } catch (e) {
      console.warn("Backend updatePhoto failed, saved locally:", e.message);
    }
  };

  const deletePhoto = async (id) => {
    setGallery((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.gallery.delete(id);
    } catch (e) {
      console.warn("Backend deletePhoto failed, saved locally:", e.message);
    }
  };

  // ---------- Donation ----------
  const updateDonation = async (patch) => {
    const updated = { ...donation, ...patch };
    setDonation(updated);
    try {
      await api.donation.update(updated);
    } catch (e) {
      console.warn("Backend updateDonation failed, saved locally:", e.message);
    }
  };

  const addSuggestedAmount = async (amount) => {
    const updatedAmounts = [
      ...donation.suggestedAmounts,
      { id: generateId("amt"), amount },
    ];
    updateDonation({ suggestedAmounts: updatedAmounts });
  };

  const updateSuggestedAmount = async (id, amount) => {
    const updatedAmounts = donation.suggestedAmounts.map((a) =>
      a.id === id ? { ...a, amount } : a
    );
    updateDonation({ suggestedAmounts: updatedAmounts });
  };

  const deleteSuggestedAmount = async (id) => {
    const updatedAmounts = donation.suggestedAmounts.filter((a) => a.id !== id);
    updateDonation({ suggestedAmounts: updatedAmounts });
  };

  const value = {
    siteInfo,
    updateSiteInfo,
    statistics,
    addStatistic,
    updateStatistic,
    deleteStatistic,
    cows,
    addCow,
    updateCow,
    deleteCow,
    gallery,
    addPhoto,
    updatePhoto,
    deletePhoto,
    donation,
    updateDonation,
    addSuggestedAmount,
    updateSuggestedAmount,
    deleteSuggestedAmount,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useGaushalaData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useGaushalaData must be used inside <DataProvider>");
  }
  return ctx;
}
