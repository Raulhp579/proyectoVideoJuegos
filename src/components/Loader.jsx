export default function Loader({ label = "Cargando..." }) {
  return (
    <div className="flex items-center gap-3 text-zinc-300">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
