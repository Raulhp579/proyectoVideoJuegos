import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGameDetailsThunk,
  toggleFavorite,
} from "../store/slices/gamesSlice";
import Loader from "../components/Loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function GameDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    data: game,
    loading,
    error: err,
  } = useSelector((state) => state.games.detail);
  const favorites = useSelector((state) => state.games.favorites);

  const isFav = useMemo(() => favorites.includes(Number(id)), [favorites, id]);

  useEffect(() => {
    dispatch(fetchGameDetailsThunk(id));
  }, [dispatch, id]);

  function toggleFav() {
    dispatch(toggleFavorite(id));
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

  const platforms = (game.platforms || [])
    .map((p) => p.platform?.name)
    .filter(Boolean);
  const genres = game.genres || [];
  const tags = game.tags || [];
  const publishers = game.publishers || [];

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
            <div className="h-full w-full grid place-items-center text-zinc-400">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{game.name}</h1>
              <p className="text-zinc-300 mt-1">
                ⭐ {game.rating?.toFixed?.(1) ?? game.rating ?? "—"} ·
                Lanzamiento: {game.released || "—"}
              </p>
            </div>

            <button
              onClick={toggleFav}
              className={[
                "rounded-2xl px-5 py-3 font-semibold transition w-fit",
                isFav
                  ? "bg-yellow-300 text-zinc-950 hover:bg-yellow-200"
                  : "border border-zinc-800 text-zinc-200 hover:border-zinc-600",
              ].join(" ")}
            >
              {isFav ? "★ En favoritos" : "☆ Marcar favorito"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-zinc-900 p-4">
              <p className="text-xs text-zinc-400 mb-2">Géneros</p>
              <div className="flex flex-wrap gap-2">
                {genres.length
                  ? genres.map((g) => (
                      <Link
                        to={`/games?genres=${g.id}`}
                        key={g.id}
                        className="text-sm text-zinc-200 hover:text-yellow-300 underline underline-offset-2 decoration-zinc-700"
                      >
                        {g.name}
                      </Link>
                    ))
                  : "—"}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-900 p-4">
              <p className="text-xs text-zinc-400 mb-2">Plataformas</p>
              <div className="flex flex-wrap gap-1 text-sm">
                {platforms.length ? platforms.join(", ") : "—"}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-900 p-4">
              <p className="text-xs text-zinc-400 mb-2">Publishers</p>
              <div className="flex flex-wrap gap-2">
                {publishers.length
                  ? publishers.map((p) => (
                      <Link
                        to={`/publishers/${p.id}`}
                        key={p.id}
                        className="text-sm text-zinc-200 hover:text-yellow-300 underline underline-offset-2 decoration-zinc-700"
                      >
                        {p.name}
                      </Link>
                    ))
                  : "—"}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-900 p-4">
              <p className="text-xs text-zinc-400">Metacritic</p>
              <p className="mt-1 text-sm">{game.metacritic ?? "—"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-900 p-4">
            <p className="text-xs text-zinc-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.length
                ? tags.map((t) => (
                    <Link
                      to={`/games?tags=${t.id}`}
                      key={t.id}
                      className="text-xs px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
                    >
                      #{t.name}
                    </Link>
                  ))
                : "—"}
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
