import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularGames } from "../services/rawg.js";
import Loader from "../components/loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import GameCarousel from "../components/GameCarrusel.jsx";

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const data = await getPopularGames({ page: 1, pageSize: 12 });
        if (!alive) return;
        setGames(data.results || []);
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
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-10">
      <section className="rounded-3xl border border-zinc-900 bg-gradient-to-b from-zinc-900/40 to-zinc-950 p-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Descubre tu próximo videojuego favorito
        </h1>
        <p className="mt-3 text-zinc-300 max-w-2xl">
          Explora títulos populares, busca entre miles de juegos y entra al detalle para ver géneros,
          plataformas, fechas y puntuación.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/games"
            className="rounded-2xl bg-zinc-100 text-zinc-950 px-5 py-3 font-semibold hover:bg-white transition"
          >
            Ir al buscador
          </Link>
          <a
            href="https://rawg.io/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-zinc-800 px-5 py-3 text-zinc-200 hover:border-zinc-600 transition"
          >
            Conoce RAWG
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">Más populares</h2>
          <Link to="/games" className="text-sm text-zinc-300 hover:text-white">
            Ver todos →
          </Link>
        </div>

        {err && <ErrorBox message={err} />}
        {loading ? (
          <Loader label="Cargando populares…" />
        ) : games.length ? (
          <GameCarousel games={games} />
        ) : (
          <p className="text-zinc-400">No se encontraron juegos.</p>
        )}
      </section>
    </div>
  );
}
