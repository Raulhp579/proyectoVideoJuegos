import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsThunk, toggleJoinEvent } from "../store/slices/eventsSlice";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";

export default function MyEvents() {
  const dispatch = useDispatch();
  const {
    data: events,
    loading,
    error,
  } = useSelector((state) => state.events.list);
  const joinedEvents = useSelector((state) => state.events.joinedEvents);

  useEffect(() => {
    // We need all events to map them to the joined IDs
    if (events.length === 0) {
      dispatch(fetchEventsThunk());
    }
  }, [dispatch, events.length]);

  const joinedEventsData = useMemo(() => {
    return events.filter((e) => joinedEvents.includes(e.id));
  }, [events, joinedEvents]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Mis Eventos</h1>
        <p className="text-zinc-300">
          Los eventos en los que estás participando.
        </p>
      </div>

      {error && <ErrorBox message={error} />}

      {loading ? (
        <Loader label="Cargando tus eventos…" />
      ) : joinedEvents.length === 0 ? (
        <p className="text-center text-zinc-500 py-10">
          No te has apuntado a ningún evento todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedEventsData.map((event) => {
            return (
              <div
                key={event.id}
                className="rounded-3xl border border-zinc-900 bg-zinc-950 overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-zinc-900">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300/18181b/ffffff?text=Evento";
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 gap-2">
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {event.title}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-auto flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                    {event.location}
                  </p>
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => dispatch(toggleJoinEvent(event.id))}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      Cancelar participación
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
