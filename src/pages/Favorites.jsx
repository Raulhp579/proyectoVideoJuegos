import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesThunk } from "../store/slices/gamesSlice";
import GameCard from "../components/GameCard";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";

export default function Favorites() {
  const dispatch = useDispatch();
  const {
    data: games,
    loading,
    error,
  } = useSelector((state) => state.games.list);
  const favorites = useSelector((state) => state.games.favorites);

  useEffect(() => {
    if (favorites.length > 0) {
      dispatch(fetchGamesThunk({ ids: favorites.join(",") }));
    }
  }, [dispatch, favorites]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Mis Favoritos</h1>
        <p className="text-zinc-300">
          Aquí están los juegos que has marcado como favoritos.
        </p>
      </div>

      {error && <ErrorBox message={error} />}

      {loading ? (
        <Loader label="Cargando favoritos…" />
      ) : favorites.length === 0 ? (
        <p className="text-center text-zinc-500 py-10">
          No tienes juegos favoritos guardados aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
