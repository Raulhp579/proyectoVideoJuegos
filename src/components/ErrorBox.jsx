export default function ErrorBox({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">
      <p className="font-semibold">Ha ocurrido un error</p>
      <p className="text-red-200/90 mt-1">{message}</p>
    </div>
  );
}
