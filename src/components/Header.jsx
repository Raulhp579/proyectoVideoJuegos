import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-xl text-sm font-medium transition",
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
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
  }, [location.pathname]);

  // favoritos (localStorage) para mostrar contador
  const favCount = useMemo(() => {
    try {
      const raw = localStorage.getItem("fav_games_v1");
      const ids = raw ? JSON.parse(raw) : [];
      return Array.isArray(ids) ? ids.length : 0;
    } catch {
      return 0;
    }
  }, [location.pathname]); // se recalcula cuando navegas

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

          {/* Favoritos */}
          <NavLink
            to="/games"
            className="ml-1 inline-flex items-center gap-2 rounded-2xl border border-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-600 transition"
            title="Favoritos guardados"
          >
            <span className="text-base leading-none">★</span>
            <span className="hidden sm:inline">Favoritos</span>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">
              {favCount}
            </span>
          </NavLink>
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
