export default function Footer() {
  return (
    <footer className="border-t border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-400 flex flex-col gap-2">
        <p>Hecho con React + Tailwind + RAWG API.</p>
        <p className="text-xs">
          Datos de videojuegos proporcionados por RAWG. Esta web es un proyecto educativo.
        </p>
      </div>
    </footer>
  );
}
