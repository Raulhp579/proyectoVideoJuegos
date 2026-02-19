export default function Pagination({ page, setPage, total, pageSize }) {
  const totalPages = Math.ceil(total / pageSize);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (totalPages <= 1) return null;

  // Simple logic to show a window of pages
  // e.g., 1 ... 4 5 6 ... 10
  const pages = [];
  const radius = 2; // how many pages around current

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // first
      i === totalPages || // last
      (i >= page - radius && i <= page + radius) // window
    ) {
      pages.push(i);
    }
  }

  // Insert nulls for ellipsis
  const visiblePages = [];
  let last = 0;
  for (const p of pages) {
    if (last > 0 && p - last > 1) {
      visiblePages.push(-1); // -1 indicates gap
    }
    visiblePages.push(p);
    last = p;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      <button
        className="rounded-xl border border-zinc-800 px-3 py-2 text-sm disabled:opacity-40 hover:border-zinc-600 transition disabled:hover:border-zinc-800 bg-zinc-900 text-zinc-300"
        onClick={() => setPage(page - 1)}
        disabled={!canPrev}
      >
        ← Anterior
      </button>

      <div className="hidden sm:flex items-center gap-1">
        {visiblePages.map((p, i) => {
          if (p === -1) {
            return (
              <span key={`gap-${i}`} className="px-2 text-zinc-500">
                …
              </span>
            );
          }
          const isCurrent = p === page;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={[
                "h-8 w-8 rounded-lg text-sm font-medium transition",
                isCurrent
                  ? "bg-zinc-200 text-zinc-950"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white",
              ].join(" ")}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Mobile view: simpler */}
      <span className="sm:hidden text-sm text-zinc-400">
        Pág {page} de {totalPages}
      </span>

      <button
        className="rounded-xl border border-zinc-800 px-3 py-2 text-sm disabled:opacity-40 hover:border-zinc-600 transition disabled:hover:border-zinc-800 bg-zinc-900 text-zinc-300"
        onClick={() => setPage(page + 1)}
        disabled={!canNext}
      >
        Siguiente →
      </button>
    </div>
  );
}
