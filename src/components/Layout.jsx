import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/sites", label: "Sitios" },
  { to: "/interventions", label: "Intervenciones" },
];

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-blush text-black">
      <header className="border-b-4 border-black bg-pink-300">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <span className="font-black uppercase">ULA Monitors</span>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                isActive
                  ? "border-2 border-black bg-black px-2 py-0.5 font-bold text-pink-300"
                  : "border-2 border-black bg-pink-300 px-2 py-0.5 font-bold hover:bg-white"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="ml-auto border-2 border-black bg-red-300 px-3 py-1 text-sm font-bold text-black shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Salir
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
