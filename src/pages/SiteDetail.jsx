import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { Loading, ErrorMessage } from "../components/Message";
import StatusBadge from "../components/StatusBadge";
import { formatDateTime } from "../format";

export default function SiteDetail() {
  const { siteId } = useParams();
  const { data: site, loading, error } = useApi(`/sites/${siteId}`);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <p className="mb-2 text-sm">
        <Link
          to="/sites"
          className="font-bold text-blue-700 underline decoration-2 hover:bg-pink-200"
        >
          ← Sitios
        </Link>
      </p>
      <h1 className="mb-1 text-2xl font-black uppercase">{site.name}</h1>
      <p className="mb-4 text-sm font-bold text-gray-600">
        Código {site.code} · {site.area} · {site.latitude}, {site.longitude} ·{" "}
        {site.active ? "Activo" : "Inactivo"}
      </p>

      <h2 className="mb-2 font-black uppercase">Sensores</h2>
      <table className="w-full border-2 border-black bg-white shadow-brutal">
        <thead>
          <tr className="border-b-2 border-black bg-pink-200 text-left text-sm font-bold uppercase">
            <th className="px-4 py-2">Sensor</th>
            <th className="px-4 py-2">Posición</th>
            <th className="px-4 py-2">Profundidad</th>
            <th className="px-4 py-2">Rango (mg/L)</th>
            <th className="px-4 py-2">Última lectura</th>
            <th className="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {site.sensors.map((sensor) => (
            <tr key={sensor.id} className="border-b border-black">
              <td className="px-4 py-2">
                <Link
                  to={`/sensors/${sensor.id}`}
                  className="font-bold text-blue-700 underline decoration-2 hover:bg-pink-200"
                >
                  {sensor.sensor_name}
                </Link>
              </td>
              <td className="px-4 py-2">{sensor.position}</td>
              <td className="px-4 py-2">{sensor.depth} m</td>
              <td className="px-4 py-2">
                {sensor.oxygen_min} – {sensor.oxygen_max}
              </td>
              <td className="px-4 py-2 text-sm">
                {sensor.last_reading
                  ? `${sensor.last_reading.value} mg/L · ${formatDateTime(
                      sensor.last_reading.at,
                    )}`
                  : "Nunca"}
              </td>
              <td className="px-4 py-2">
                <StatusBadge status={sensor.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
