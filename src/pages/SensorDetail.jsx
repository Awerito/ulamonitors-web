import { Link, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useApi } from "../hooks/useApi";
import { Loading, ErrorMessage } from "../components/Message";
import StatusBadge from "../components/StatusBadge";
import { formatDateTime, formatTime } from "../format";

function HistoryChart({ sensor }) {
  const { data, loading, error } = useApi(
    `/measurements/overview?site_id=${sensor.site_id}&bucket=hour&days=7`,
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  // The overview covers the whole site, so we keep only this sensor.
  const series = data.data.find((s) => s.sensor_id === sensor.id);
  if (!series) {
    return (
      <p className="py-8 text-center font-bold text-gray-500">
        Sin mediciones en los últimos 7 días.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={series.points}>
        <CartesianGrid stroke="#000" strokeWidth={1} vertical={false} />
        <XAxis
          dataKey="bucket"
          tickFormatter={formatTime}
          tick={{ fontSize: 12, fill: "#000", fontWeight: 700 }}
          axisLine={{ stroke: "#000", strokeWidth: 2 }}
          tickLine={{ stroke: "#000" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#000", fontWeight: 700 }}
          domain={[0, Math.ceil(sensor.oxygen_max) + 1]}
          axisLine={{ stroke: "#000", strokeWidth: 2 }}
          tickLine={{ stroke: "#000" }}
          label={{
            value: "mg/L",
            angle: -90,
            position: "insideLeft",
            fill: "#000",
            fontWeight: 700,
          }}
        />
        <Tooltip
          labelFormatter={formatDateTime}
          contentStyle={{
            border: "2px solid #000",
            borderRadius: 0,
            boxShadow: "4px 4px 0 0 #000",
            fontWeight: 700,
          }}
        />
        <ReferenceLine
          y={sensor.oxygen_min}
          stroke="#fb7185"
          strokeWidth={2}
          strokeDasharray="6 4"
          label={{
            value: "mín",
            fontSize: 12,
            position: "insideLeft",
            fill: "#fb7185",
            fontWeight: 700,
          }}
        />
        <ReferenceLine
          y={sensor.oxygen_max}
          stroke="#fb7185"
          strokeWidth={2}
          strokeDasharray="6 4"
          label={{
            value: "máx",
            fontSize: 12,
            position: "insideLeft",
            fill: "#fb7185",
            fontWeight: 700,
          }}
        />
        <Line
          dataKey="oxygen_avg"
          name="Oxígeno promedio"
          stroke="#f472b6"
          strokeWidth={3}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function SensorDetail() {
  const { sensorId } = useParams();
  const { data: sensor, loading, error } = useApi(`/sensors/${sensorId}`);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <p className="mb-2 text-sm">
        <Link
          to={`/sites/${sensor.site_id}`}
          className="font-bold text-blue-700 underline decoration-2 hover:bg-pink-200"
        >
          ← Volver al sitio
        </Link>
      </p>
      <div className="mb-1 flex items-center gap-3">
        <h1 className="text-2xl font-black uppercase">{sensor.sensor_name}</h1>
        <StatusBadge status={sensor.status} />
      </div>
      <p className="mb-4 text-sm font-bold text-gray-600">
        {sensor.position} · {sensor.depth} m · Rango {sensor.oxygen_min} –{" "}
        {sensor.oxygen_max} mg/L ·{" "}
        {sensor.transmitting ? "Transmitiendo" : "No transmite"} · Instalado el{" "}
        {formatDateTime(sensor.installed_at)}
      </p>
      <p className="mb-4 text-sm font-bold text-gray-600">
        Última lectura:{" "}
        {sensor.last_reading
          ? `${sensor.last_reading.value} mg/L · ${formatDateTime(
              sensor.last_reading.at,
            )}`
          : "Nunca"}
      </p>

      <div className="border-2 border-black bg-white p-4 shadow-brutal">
        <h2 className="mb-4 font-black">
          Oxígeno promedio por hora (últimos 7 días)
        </h2>
        <HistoryChart sensor={sensor} />
      </div>
    </div>
  );
}
