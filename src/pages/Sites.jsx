import { useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { Loading, ErrorMessage } from "../components/Message";
import Pagination from "../components/Pagination";

// The API has no endpoint to list the existing areas, so the filter
// options are hardcoded from the seed data.
const AREAS = ["Zona Norte", "Zona Centro", "Zona Sur"];

export default function Sites() {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({ page, page_size: 10 });
  if (q) params.set("q", q);
  if (area) params.set("area", area);
  if (active) params.set("active", active);

  const { data, loading, error } = useApi(`/sites?${params}`);

  function handleSearch(e) {
    e.preventDefault();
    setQ(search);
    setPage(1);
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-black uppercase">Sitios</h1>

      <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          className="border-2 border-black bg-white px-3 py-1.5 text-sm font-medium focus:bg-pink-100 focus:outline-none"
        />
        <button
          type="submit"
          className="border-2 border-black bg-pink-300 px-3 py-1.5 text-sm font-bold shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Buscar
        </button>
        <select
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            setPage(1);
          }}
          className="border-2 border-black bg-white px-2 py-1.5 text-sm font-bold"
        >
          <option value="">Todas las áreas</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={active}
          onChange={(e) => {
            setActive(e.target.value);
            setPage(1);
          }}
          className="border-2 border-black bg-white px-2 py-1.5 text-sm font-bold"
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </form>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <>
          <table className="mb-4 w-full border-2 border-black bg-white shadow-brutal">
            <thead>
              <tr className="border-b-2 border-black bg-pink-200 text-left text-sm font-bold uppercase">
                <th className="px-4 py-2">Código</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Área</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((site) => (
                <tr key={site.id} className="border-b border-black">
                  <td className="px-4 py-2 font-mono text-sm">{site.code}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/sites/${site.id}`}
                      className="font-bold text-blue-700 underline decoration-2 hover:bg-pink-200"
                    >
                      {site.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{site.area}</td>
                  <td className="px-4 py-2 text-sm">
                    {site.active ? "Activo" : "Inactivo"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.data.length === 0 && (
            <p className="mb-4 font-bold text-gray-500">
              No hay sitios que coincidan.
            </p>
          )}
          <Pagination meta={data.meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
