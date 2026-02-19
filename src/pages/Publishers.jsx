import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPublishers } from "../services/rawg.js";
import SearchBar from "../components/SearchBar.jsx";
import Loader from "../components/Loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Publishers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(query);
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const pageSize = 20;

  const canPrev = page > 1;
  const canNext = useMemo(() => {
    const total = data?.count || 0;
    return page * pageSize < total;
  }, [data, page]);

  // Sincronizar input con URL si cambia externa (popstate)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await getPublishers({ page, search: query, pageSize });
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
  }, [page, query]);

  function handleSearch() {
    setSearchParams({ search: inputValue.trim(), page: 1 });
  }

  function handlePageChange(newPage) {
    setSearchParams({ search: query, page: newPage });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Publishers</h1>
        <p className="text-zinc-300">
          Encuentra a los creadores y distribuidores de tus juegos favoritos.
        </p>
      </div>

      <SearchBar
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSearch}
        placeholder="Buscar publisher..."
      />

      {err && <ErrorBox message={err} />}

      {loading ? (
        <Loader label="Cargando publishers…" />
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>
              Resultados: <span className="text-zinc-200">{data.count}</span>
            </span>
            {query && (
              <span>
                Filtro: <span className="text-zinc-200">"{query}"</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data.results || []).map((p) => (
              <Link
                to={`/publishers/${p.id}`}
                key={p.id}
                className="group block rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition relative aspect-[16/9]"
              >
                {p.image_background ? (
                  <img
                    src={p.image_background}
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-80 transition"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                <div className="absolute bottom-0 left-0 p-5">
                  <h2 className="text-xl font-bold text-white group-hover:text-yellow-300 transition">
                    {p.name}
                  </h2>
                  <p className="text-sm text-zinc-300 mt-1">
                    Juegos: {p.games_count}
                  </p>
                </div>
              </Link>
            ))}
          </div>

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
