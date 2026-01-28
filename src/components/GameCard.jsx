import { Link } from "react-router-dom";

function badge(text) {
  return (
    <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-200">
      {text}
    </span>
  );
}

export default function GameCard({ game }) {
  const rating = game?.rating ? Number(game.rating).toFixed(1) : "—";
  const genres = (game?.genres || []).slice(0, 2).map(g => g.name);

  return (
    <Link
      to={`/games/${game.id}`}
      className="group rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950 hover:border-zinc-700 transition"
    >
      <div className="aspect-[16/9] bg-zinc-900 overflow-hidden">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-zinc-400">Sin imagen</div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold leading-snug">{game.name}</h3>

        <div className="flex items-center gap-2 flex-wrap">
          {badge(`⭐ ${rating}`)}
          {genres.map(g => (
            <span key={g} className="text-xs text-zinc-400">
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
