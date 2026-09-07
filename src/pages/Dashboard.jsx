import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useApi } from "../hooks/useApi";
import { Loading, ErrorMessage } from "../components/Message";
import { formatDateTime, formatTime } from "../format";

// Flat pastel colors for the chart series.
const SERIES_COLORS = [
  "#f472b6",
  "#a78bfa",
  "#2dd4bf",
  "#fbbf24",
  "#60a5fa",
  "#4ade80",
  "#fb7185",
  "#c084fc",
];

// There is no summary endpoint: each count comes from a separate list
// call, reading meta.totalCount with page_size=1.
function CountCard({ title, path, color }) {
  const { data, loading, error } = useApi(path);

  return (
    <div className={`border-2 border-black p-4 shadow-brutal ${color}`}>
      <p className="text-sm font-bold uppercase">{title}</p>
      {loading && <p className="text-2xl font-black">...</p>}
      {error && <p className="text-sm font-bold">{error}</p>}
      {data && <p className="text-3xl font-black">{data.meta.totalCount}</p>}
    </div>
  );
}

function OverviewChart({ siteId }) {
  const { data, loading, error } = useApi(
    siteId
      ? `/measurements/overview?site_id=${siteId}&bucket=hour&days=2`
      : null,
  );

  if (!siteId || loading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // The overview comes grouped per sensor, but Recharts wants one row
  // per bucket with one column per sensor, so we pivot it here.
  const rows = {};
  for (const sensor of data.data) {
    for (const point of sensor.points) {
      if (!rows[point.bucket]) {
        rows[point.bucket] = { bucket: point.bucket };
      }
      rows[point.bucket][sensor.sensor_name] = point.oxygen_avg;
    }
  }
  const chartData = Object.values(rows).sort((a, b) =>
    a.bucket.localeCompare(b.bucket),
  );

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData}>
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
        <Legend wrapperStyle={{ fontWeight: 700 }} />
        {data.data.map((sensor, i) => (
          <Line
            key={sensor.sensor_id}
            dataKey={sensor.sensor_name}
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const [siteId, setSiteId] = useState("");
  const sites = useApi("/sites?page_size=100");

  // Pick the first site once the list arrives.
  useEffect(() => {
    if (sites.data && sites.data.data.length > 0) {
      setSiteId(String(sites.data.data[0].id));
    }
  }, [sites.data]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-black uppercase">Dashboard</h1>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CountCard
          title="Sensores OK"
          path="/sensors?status=ok&page_size=1"
          color="bg-green-200 text-black"
        />
        <CountCard
          title="Fuera de rango"
          path="/sensors?status=out_of_range&page_size=1"
          color="bg-red-300 text-black"
        />
        <CountCard
          title="Sin datos"
          path="/sensors?status=no_data&page_size=1"
          color="bg-yellow-200 text-black"
        />
        <CountCard
          title="Intervenciones abiertas"
          path="/interventions?status=open&page_size=1"
          color="bg-pink-200 text-black"
        />
      </div>

      <div className="border-2 border-black bg-white p-4 shadow-brutal">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-black">
            Oxígeno promedio por sensor (últimas 48 horas)
          </h2>
          {sites.data && (
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="border-2 border-black bg-white px-2 py-1 text-sm font-bold"
            >
              {sites.data.data.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {sites.error && <ErrorMessage message={sites.error} />}
        <OverviewChart siteId={siteId} />
      </div>
    </div>
  );
}
