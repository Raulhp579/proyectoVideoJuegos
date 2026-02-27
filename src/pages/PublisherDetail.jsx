import { useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublisherDetailsThunk,
  fetchGamesThunk,
} from "../store/slices/gamesSlice";
import Loader from "../components/Loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import GameCard from "../components/GameCard.jsx";
import Pagination from "../components/Pagination.jsx";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function PublisherDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const dispatch = useDispatch();

  const {
    data: publisher,
    loading: loadingPub,
    error: err,
  } = useSelector((state) => state.games.publisherDetail);
  const {
    data: gamesResults,
    count,
    loading: loadingGames,
  } = useSelector((state) => state.games.list);

  const pageSize = 20;

  useEffect(() => {
    dispatch(fetchPublisherDetailsThunk(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Para simplificar, usamos fetchGamesThunk con el publishers filter
    dispatch(fetchGamesThunk({ publishers: id, page, pageSize }));
  }, [dispatch, id, page, pageSize]);

  const canPrev = page > 1;
  const canNext = useMemo(() => {
    const total = count || 0;
    return page * pageSize < total;
  }, [count, page]);

  function handlePageChange(newPage) {
    setSearchParams({ page: newPage });
  }

  if (loadingPub) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Loader label="Cargando publisher…" />
      </div>
    );
  }

  if (err || !publisher) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-4">
        <ErrorBox message={err || "Publisher no encontrado"} />
        <Link
          to="/publishers"
          className="text-sm text-zinc-300 hover:text-white"
        >
          ← Volver a Publishers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-8">
      <Link to="/publishers" className="text-sm text-zinc-300 hover:text-white">
        ← Volver a Publishers
      </Link>

      {/* Cabecera Publisher */}
      <section className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 min-h-[300px] flex items-end">
        {publisher.image_background && (
          <img
            src={publisher.image_background}
            alt={publisher.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none" />

        <div className="relative p-8 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {publisher.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-300">
            <span>Juegos: {publisher.games_count}</span>
          </div>
          <div className="mt-4 max-w-3xl text-zinc-200 text-sm md:text-base leading-relaxed">
            {stripHtml(publisher.description) || "Sin descripción disponible."}
          </div>
        </div>
      </section>

      {/* Lista de juegos */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Juegos de {publisher.name}</h2>

        {loadingGames ? (
          <div className="py-10">
            <Loader label="Cargando juegos…" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(gamesResults || []).map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
            {(gamesResults || []).length === 0 && (
              <p className="text-zinc-400">No se encontraron juegos.</p>
            )}
            <div className="mt-6">
              <Pagination
                page={page}
                setPage={handlePageChange}
                total={count}
                pageSize={pageSize}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
