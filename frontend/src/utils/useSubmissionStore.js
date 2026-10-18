import { useCallback } from "react";
import { loadFromStorage, saveToStorage, generateId } from "./storage.js";
import { api } from "../services/api.js";

export function useSubmissionStore(key) {
  const add = useCallback(
    async (entry) => {
      const list = loadFromStorage(key, []);
      const record = {
        id: generateId(key),
        createdAt: new Date().toISOString(),
        ...entry,
      };

      // Save locally
      saveToStorage(key, [record, ...list]);

      // Sync to backend asynchronously
      try {
        if (key === "volunteers") {
          await api.volunteers.add(entry);
        } else if (key === "suggestions") {
          await api.suggestions.add(entry);
        } else if (key === "adoptionRequests") {
          await api.adoptions.add(entry);
        }
      } catch (err) {
        console.warn(`Backend sync failed for submission [${key}]:`, err.message);
      }

      return record;
    },
    [key]
  );

  return { add };
}
