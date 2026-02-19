import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchGames } from "../services/rawg.js";
import SearchBar from "../components/SearchBar.jsx";
import Loader from "../components/Loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import GameCard from "../components/GameCard.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Games() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const submitted = searchParams.get("search") || "";
  const genres = searchParams.get("genres");
  const tags = searchParams.get("tags");
  const publishers = searchParams.get("publishers");
  // Check if favorites filters is active
  const isFavorites = searchParams.get("favorites") === "true";

  // Input local para el buscador
  const [inputValue, setInputValue] = useState(submitted);

  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const pageSize = 20;

  const canPrev = page > 1;
  const canNext = useMemo(() => {
    const total = data?.count || 0;
    return page * pageSize < total;
  }, [data, page]);

  // Sincronizar input si cambia la URL (por ejemplo navegando atrás)
  useEffect(() => {
    setInputValue(submitted);
  }, [submitted]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");

      let idsToFetch = null;
      if (isFavorites) {
        try {
          const raw = localStorage.getItem("fav_games_v1");
          const ids = raw ? JSON.parse(raw) : [];
          if (!ids.length) {
            // Si no hay favoritos, no llamamos a la API o devolvemos vacío directamente
            if (alive) {
              setData({ results: [], count: 0 });
              setLoading(false);
            }
            return;
          }
          idsToFetch = ids.join(",");
        } catch {
          // error parsing
        }
      }

      try {
        const res = await searchGames({
          query: submitted,
          page,
          pageSize,
          genres,
          tags,
          publishers,
          ids: idsToFetch,
        });
        if (!alive) return;
        setData({ results: res.results || [], count: res.count || 0 });
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
  }, [submitted, page, genres, tags, publishers, isFavorites]);

  function doSearch() {
    // Al buscar, reseteamos a página 1 y mantenemos filtros si quisieramos,
    // pero lo habitual es limpiar filtros o mantenerlos. Aquí limpiaré filtros para búsqueda nueva simple.
    // Si quieres mantener filtros: ...searchParams, search: inputValue.trim(), page: 1
    const newParams = { search: inputValue.trim(), page: 1 };

    // Si queremos mantener los filtros al buscar, descomenta estas líneas:
    // if (genres) newParams.genres = genres;
    // if (tags) newParams.tags = tags;
    // if (publishers) newParams.publishers = publishers;

    setSearchParams(newParams);
  }

  function handlePageChange(newPage) {
    const newParams = { page: newPage };
    if (submitted) newParams.search = submitted;
    if (genres) newParams.genres = genres;
    if (tags) newParams.tags = tags;
    if (publishers) newParams.publishers = publishers;

    setSearchParams(newParams);
  }

  // Helper para mostrar qué filtros están activos
  const activeFilters = [
    submitted && `"${submitted}"`,
    isFavorites && "Mis Favoritos",
    genres && `Género: ${genres}`,
    tags && `Tag: ${tags}`,
    publishers && `Publisher: ${publishers}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Videojuegos</h1>
        <p className="text-zinc-300">
          Busca juegos por nombre y abre el detalle para ver más información.
        </p>
      </div>

      <SearchBar
        value={inputValue}
        onChange={setInputValue}
        onSubmit={doSearch}
      />

      {err && <ErrorBox message={err} />}

      {loading ? (
        <Loader label="Buscando juegos…" />
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>
              Resultados: <span className="text-zinc-200">{data.count}</span>
            </span>
            {activeFilters ? (
              <span>
                Filtros: <span className="text-zinc-200">{activeFilters}</span>
              </span>
            ) : (
              <span>Mostrando tendencias</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data.results || []).map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>

          {data.results.length === 0 && (
            <p className="text-center text-zinc-500 py-10">
              No se encontraron resultados.
            </p>
          )}

          <Pagination
            page={page}
            setPage={handlePageChange}
            total={data.count}
            pageSize={pageSize}
          />
        </>
      )}
    </div>
  );
}
