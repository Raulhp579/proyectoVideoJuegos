export default function Pagination({ page, setPage, canPrev, canNext }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        className="rounded-xl border border-zinc-800 px-3 py-2 text-sm disabled:opacity-40 hover:border-zinc-600 transition"
        onClick={() => setPage(page - 1)}
        disabled={!canPrev}
      >
        ← Anterior
      </button>

      <span className="text-sm text-zinc-300">Página {page}</span>

      <button
        className="rounded-xl border border-zinc-800 px-3 py-2 text-sm disabled:opacity-40 hover:border-zinc-600 transition"
        onClick={() => setPage(page + 1)}
        disabled={!canNext}
      >
        Siguiente →
      </button>
    </div>
  );
}
