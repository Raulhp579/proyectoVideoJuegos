import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-xl text-sm font-medium transition",
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // buscador rápido del header (navega a /games?q=...)
  const [q, setQ] = useState("");

  // si cambias de página, no arrastres texto raro
  useEffect(() => {
    setQ("");
    setMenuOpen(false); // also close menu on navigation
  }, [location.pathname]);

  const [menuOpen, setMenuOpen] = useState(false);

  // favoritos (Redux) para mostrar contador
  const favorites = useSelector((state) => state.games.favorites);
  const favCount = favorites.length;

  function onSubmit(e) {
    e.preventDefault();
    const value = q.trim();
    navigate(`/games${value ? `?q=${encodeURIComponent(value)}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        {/* Marca */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 grid place-items-center font-bold text-white">
            R
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-white group-hover:text-zinc-100">
              RAWG Explorer
            </p>
            <p className="text-xs text-zinc-400">
              Descubre y guarda videojuegos
            </p>
          </div>
        </NavLink>

        {/* Buscador (oculto en móvil) */}
        <form
          onSubmit={onSubmit}
          className="hidden md:flex flex-1 items-center justify-center"
        >
          <div className="w-full max-w-md relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar… (ej: GTA, Zelda, FIFA)"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-white transition"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Navegación */}
        <nav className="ml-auto flex items-center gap-2">
          <LinkItem to="/">Inicio</LinkItem>
          <LinkItem to="/games">Videojuegos</LinkItem>
          <LinkItem to="/publishers">Publishers</LinkItem>

          <LinkItem to="/events">Eventos</LinkItem>

          {/* Favoritos */}
          <NavLink
            to="/favorites"
            className="ml-1 hidden sm:inline-flex items-center gap-2 rounded-2xl border border-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-600 transition"
            title="Favoritos guardados"
          >
            <span className="text-base leading-none">★</span>
            <span className="hidden sm:inline">Favoritos</span>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">
              {favCount}
            </span>
          </NavLink>

          {/* Icono de Usuario con Menú Desplegable */}
          <div className="relative ml-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-zinc-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg py-1 flex flex-col z-50">
                <div className="px-4 py-2 border-b border-zinc-800">
                  <p className="text-sm font-semibold text-white">Usuario</p>
                  <p className="text-xs text-zinc-400">usuario@ejemplo.com</p>
                </div>
                <NavLink
                  to="/favorites"
                  className="px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                >
                  Mis Favoritos
                </NavLink>
                <NavLink
                  to="/my-events"
                  className="px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                >
                  Mis Eventos
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Buscador en móvil */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar juegos…"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
          />
          <button
            type="submit"
            className="rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-white transition"
          >
            Ir
          </button>
        </form>
      </div>
    </header>
  );
}
