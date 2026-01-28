export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="flex gap-2"
    >
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Buscar videojuegos… (ej: Zelda, FIFA, Elden Ring)"
        className="w-full rounded-2xl border border-zinc-900 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-zinc-700"
      />
      <button
        type="submit"
        className="rounded-2xl bg-zinc-100 text-zinc-950 px-4 py-3 text-sm font-semibold hover:bg-white transition"
      >
        Buscar
      </button>
    </form>
  );
}
