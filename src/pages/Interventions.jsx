import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch, apiPost } from "../api";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { Loading, ErrorMessage } from "../components/Message";
import Pagination from "../components/Pagination";
import { formatDateTime } from "../format";

const OUTCOME_LABELS = {
  back_online: "Volvió en línea",
  replaced: "Reemplazado",
  reconfigured: "Reconfigurado",
  no_fault_found: "Sin falla",
};

// Opening an intervention is the only write this app is allowed:
// the dashboard user has the read scope, closing needs the field
// scope of the technician in the mobile app.
function NewInterventionForm({ sites, sensors, onCreated }) {
  const { token } = useAuth();
  const [siteId, setSiteId] = useState("");
  const [sensorId, setSensorId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const siteSensors = sensors.filter((s) => String(s.site_id) === siteId);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await apiPost(
        "/interventions",
        {
          site_id: Number(siteId),
          sensor_id: sensorId ? Number(sensorId) : null,
          reason,
        },
        token,
      );
      setSiteId("");
      setSensorId("");
      setReason("");
      onCreated();
    } catch (err) {
      setError(err.message);
    }
    setSending(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 border-2 border-black bg-white p-4 shadow-brutal"
    >
      <h2 className="mb-3 font-black uppercase">Abrir intervención</h2>
      <div className="flex flex-wrap gap-2">
        <select
          value={siteId}
          onChange={(e) => {
            setSiteId(e.target.value);
            setSensorId("");
          }}
          required
          className="border-2 border-black bg-white px-2 py-1.5 text-sm font-bold"
        >
          <option value="">Sitio...</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
        <select
          value={sensorId}
          onChange={(e) => setSensorId(e.target.value)}
          className="border-2 border-black bg-white px-2 py-1.5 text-sm font-bold"
        >
          <option value="">Todo el sitio</option>
          {siteSensors.map((sensor) => (
            <option key={sensor.id} value={sensor.id}>
              {sensor.sensor_name}
            </option>
          ))}
        </select>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo..."
          required
          className="min-w-64 flex-1 border-2 border-black bg-white px-3 py-1.5 text-sm font-medium focus:bg-pink-100 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending}
          className="border-2 border-black bg-pink-300 px-4 py-1.5 text-sm font-bold shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
        >
          {sending ? "Abriendo..." : "Abrir"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}
    </form>
  );
}

export default function Interventions() {
  const { token } = useAuth();
  const [status, setStatus] = useState("open");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Site and sensor names for the table and the form.
  const sites = useApi("/sites?page_size=100");
  const sensors = useApi("/sensors?page_size=100");

  // Fetched by hand instead of useApi so the list reloads (via
  // refreshKey) after the form opens a new intervention.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page, page_size: 10 });
    if (status) params.set("status", status);
    apiFetch(`/interventions?${params}`, token)
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
  }, [token, status, page, refreshKey]);

  function handleCreated() {
    setStatus("open");
    setPage(1);
    setRefreshKey(refreshKey + 1);
  }

  const siteNames = {};
  for (const site of sites.data?.data ?? []) {
    siteNames[site.id] = site.name;
  }
  const sensorNames = {};
  for (const sensor of sensors.data?.data ?? []) {
    sensorNames[sensor.id] = sensor.sensor_name;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-black uppercase">Intervenciones</h1>

      {sites.data && sensors.data && (
        <NewInterventionForm
          sites={sites.data.data}
          sensors={sensors.data.data}
          onCreated={handleCreated}
        />
      )}

      <div className="mb-4 flex gap-2">
        {[
          ["open", "Abiertas"],
          ["closed", "Cerradas"],
          ["", "Todas"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
            className={`border-2 border-black px-3 py-1.5 text-sm font-bold shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              status === value ? "bg-black text-white" : "bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <>
          <table className="mb-4 w-full border-2 border-black bg-white shadow-brutal">
            <thead>
              <tr className="border-b-2 border-black bg-pink-200 text-left text-sm font-bold uppercase">
                <th className="px-4 py-2">Sitio</th>
                <th className="px-4 py-2">Sensor</th>
                <th className="px-4 py-2">Motivo</th>
                <th className="px-4 py-2">Abierta el</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item) => (
                <tr key={item.id} className="border-b border-black">
                  <td className="px-4 py-2">
                    <Link
                      to={`/sites/${item.site_id}`}
                      className="font-bold text-blue-700 underline decoration-2 hover:bg-pink-200"
                    >
                      {siteNames[item.site_id] ?? item.site_id}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {item.sensor_id
                      ? (sensorNames[item.sensor_id] ?? item.sensor_id)
                      : "—"}
                  </td>
                  <td className="px-4 py-2">{item.reason}</td>
                  <td className="px-4 py-2 text-sm">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td className="px-4 py-2">
                    {item.status === "open" ? (
                      <span className="inline-block border-2 border-black bg-pink-200 px-2 py-0.5 text-xs font-bold shadow-brutal-sm">
                        Abierta
                      </span>
                    ) : (
                      <span className="inline-block border-2 border-black bg-gray-200 px-2 py-0.5 text-xs font-bold shadow-brutal-sm">
                        Cerrada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {item.outcome
                      ? `${OUTCOME_LABELS[item.outcome]} · ${item.closed_by}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.data.length === 0 && (
            <p className="mb-4 font-bold text-gray-500">
              No hay intervenciones.
            </p>
          )}
          <Pagination meta={data.meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
