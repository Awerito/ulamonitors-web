import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useAuth } from "./useAuth";

// Loads a GET endpoint with the loading/error/data pattern.
// Pass null as path to wait (e.g. until a selector has a value).
export function useApi(path) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (path === null) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiFetch(path, token)
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path, token]);

  return { data, loading, error };
}
