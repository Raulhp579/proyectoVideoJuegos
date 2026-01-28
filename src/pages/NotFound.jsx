import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-10">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-zinc-300 mt-2">No se ha encontrado la página.</p>
        <Link to="/" className="inline-block mt-6 text-sm text-zinc-300 hover:text-white">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
