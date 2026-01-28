import { useEffect, useMemo, useState } from "react";
import { searchGames } from "../services/rawg.js";
import SearchBar from "../components/SearchBar.jsx";
import Loader from "../components/loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import GameCard from "../components/GameCard.jsx";
import Pagination from "../components/pagination.jsx";

export default function Games() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const pageSize = 20;

  const canPrev = page > 1;
  const canNext = useMemo(() => {
    const total = data?.count || 0;
    return page * pageSize < total;
  }, [data, page]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await searchGames({ query: submitted, page, pageSize });
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
  }, [submitted, page]);

  function doSearch() {
    setPage(1);
    setSubmitted(query.trim());
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Videojuegos</h1>
        <p className="text-zinc-300">
          Busca juegos por nombre y abre el detalle para ver más información.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} onSubmit={doSearch} />

      {err && <ErrorBox message={err} />}

      {loading ? (
        <Loader label="Buscando juegos…" />
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>
              Resultados: <span className="text-zinc-200">{data.count}</span>
            </span>
            {submitted ? (
              <span>
                Filtro: <span className="text-zinc-200">"{submitted}"</span>
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

          <Pagination page={page} setPage={setPage} canPrev={canPrev} canNext={canNext} />
        </>
      )}
    </div>
  );
}
