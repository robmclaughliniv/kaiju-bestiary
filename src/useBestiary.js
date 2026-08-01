import { useEffect, useMemo, useState } from "react";
import {
  fetchBestiarySummaries,
  summaryToRecord,
  buildSlots,
  recordedCountFrom,
} from "./bestiary-api.js";

export function useBestiary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBestiarySummaries()
      .then((items) => {
        if (cancelled) return;
        setEntries(items.map(summaryToRecord));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Could not load bestiary");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const slots = useMemo(() => buildSlots(entries), [entries]);
  const recordedCount = useMemo(() => recordedCountFrom(entries), [entries]);

  return { entries, slots, loading, error, recordedCount };
}
