import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getPublisherDetails, getPublisherGames } from "../services/rawg.js";
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

  const [publisher, setPublisher] = useState(null);
  const [gamesData, setGamesData] = useState({ results: [], count: 0 });

  const [loadingPub, setLoadingPub] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [err, setErr] = useState("");

  const pageSize = 20;

  useEffect(() => {
    let alive = true;
    async function loadPub() {
      setLoadingPub(true);
      setErr("");
      try {
        const res = await getPublisherDetails(id);
        if (!alive) return;
        setPublisher(res);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Error al cargar publisher");
      } finally {
        if (alive) setLoadingPub(false);
      }
    }
    loadPub();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    let alive = true;
    async function loadGames() {
      setLoadingGames(true);
      try {
        const res = await getPublisherGames(id, { page, pageSize });
        if (!alive) return;
        setGamesData({ results: res.results || [], count: res.count || 0 });
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoadingGames(false);
      }
    }
    loadGames();
    return () => {
      alive = false;
    };
  }, [id, page]);

  const canPrev = page > 1;
  const canNext = useMemo(() => {
    const total = gamesData?.count || 0;
    return page * pageSize < total;
  }, [gamesData, page]);

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
              {gamesData.results.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
            {gamesData.results.length === 0 && (
              <p className="text-zinc-400">No se encontraron juegos.</p>
            )}
            <div className="mt-6">
              <Pagination
                page={page}
                setPage={handlePageChange}
                total={gamesData.count}
                pageSize={pageSize}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
