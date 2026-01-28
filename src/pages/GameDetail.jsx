import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGameDetails } from "../services/rawg.js";
import Loader from "../components/Loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const storageKey = "fav_games_v1";

  const [favIds, setFavIds] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const isFav = useMemo(() => favIds.includes(Number(id)), [favIds, id]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favIds));
    } catch {
      // si falla, no pasa nada (modo privado, etc)
    }
  }, [favIds]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await getGameDetails(id);
        if (!alive) return;
        setGame(res);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Error desconocido");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  function toggleFav() {
    const numeric = Number(id);
    setFavIds((prev) =>
      prev.includes(numeric) ? prev.filter((x) => x !== numeric) : [...prev, numeric]
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Loader label="Cargando detalle…" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-4">
        <ErrorBox message={err} />
        <Link to="/games" className="text-sm text-zinc-300 hover:text-white">
          ← Volver
        </Link>
      </div>
    );
  }

  if (!game) return null;

  const platforms =
    (game.platforms || []).map((p) => p.platform?.name).filter(Boolean) || [];
  const genres = (game.genres || []).map((g) => g.name);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-6">
      <Link to="/games" className="text-sm text-zinc-300 hover:text-white">
        ← Volver a la lista
      </Link>

      <section className="rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950">
        <div className="aspect-[21/9] bg-zinc-900">
          {game.background_image ? (
            <img
              src={game.background_image}
              alt={game.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-zinc-400">Sin imagen</div>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{game.name}</h1>
              <p className="text-zinc-300 mt-1">
                ⭐ {game.rating?.toFixed?.(1) ?? game.rating ?? "—"} · Lanzamiento:{" "}
                {game.released || "—"}
              </p>
            </div>

            <button
              onClick={toggleFav}
              className={[
                "rounded-2xl px-5 py-3 font-semibold transition w-fit",
                isFav
                  ? "bg-yellow-300 text-zinc-950 hover:bg-yellow-200"
                  : "border border-zinc-800 text-zinc-200 hover:border-zinc-600"
              ].join(" ")}
            >
              {isFav ? "★ En favoritos" : "☆ Marcar favorito"}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-900 p-4">
              <p className="text-xs text-zinc-400">Géneros</p>
              <p className="mt-1 text-sm">{genres.length ? genres.join(", ") : "—"}</p>
            </div>

            <div className="rounded-2xl border border-zinc-900 p-4">
              <p className="text-xs text-zinc-400">Plataformas</p>
              <p className="mt-1 text-sm">
                {platforms.length ? platforms.slice(0, 8).join(", ") : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-900 p-4">
              <p className="text-xs text-zinc-400">Metacritic</p>
              <p className="mt-1 text-sm">{game.metacritic ?? "—"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-900 p-4">
            <p className="text-xs text-zinc-400">Descripción</p>
            <p className="mt-2 text-sm text-zinc-200 leading-relaxed">
              {stripHtml(game.description) || "—"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
