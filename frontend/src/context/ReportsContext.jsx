import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage, generateId } from "../utils/storage.js";
import { defaultReports } from "../data/defaultData.js";
import { api } from "../services/api.js";

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(() =>
    loadFromStorage("reports", defaultReports)
  );

  useEffect(() => saveToStorage("reports", reports), [reports]);

  // Fetch reports on mount
  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        const res = await api.reports.get();
        if (isMounted && res?.success && Array.isArray(res.data)) {
          setReports(res.data);
        }
      } catch {
        // If not authenticated or backend offline, keep local reports
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const addReport = async (report) => {
    const newReport = {
      id: generateId("report"),
      cowId: "",
      cowName: "",
      cowPhoto: "",
      description: "",
      photo: "",
      contactName: "",
      contactPhone: "",
      status: "New",
      createdAt: new Date().toISOString(),
      ...report,
    };

    setReports((prev) => [newReport, ...prev]);

    try {
      const res = await api.reports.add(newReport);
      if (res?.data) {
        setReports((prev) =>
          prev.map((r) => (r.id === newReport.id ? { ...r, ...res.data } : r))
        );
      }
    } catch (err) {
      console.warn("Report saved locally, failed to sync with backend:", err.message);
    }

    return newReport;
  };

  const updateReportStatus = async (id, status) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    try {
      await api.reports.updateStatus(id, status);
    } catch (err) {
      console.warn("Failed to update status on server:", err.message);
    }
  };

  const deleteReport = async (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));

    try {
      await api.reports.delete(id);
    } catch (err) {
      console.warn("Failed to delete report on server:", err.message);
    }
  };

  const value = { reports, addReport, updateReportStatus, deleteReport };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) {
    throw new Error("useReports must be used inside <ReportsProvider>");
  }
  return ctx;
}
