const BASE_URL = "https://api.rawg.io/api";

function getKey() {
  const key = import.meta.env.VITE_RAWG_KEY;
  if (!key) {
    throw new Error("Falta VITE_RAWG_KEY. Crea un .env con tu clave de RAWG.");
  }
  return key;
}

async function request(path, params = {}) {
  const key = getKey();
  const url = new URL(BASE_URL + path);
  url.searchParams.set("key", key);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "")
      url.searchParams.set(k, String(v));
  });

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status} al llamar RAWG. ${text}`.trim());
  }
  return res.json();
}

// Juegos populares (para carrusel)
export function getPopularGames({ page = 1, pageSize = 12 } = {}) {
  return request("/games", {
    ordering: "-rating",
    page,
    page_size: pageSize,
  });
}

// Listado + buscador
export function searchGames({
  query = "",
  page = 1,
  pageSize = 20,
  genres = null,
  tags = null,
  publishers = null,
  ids = null,
} = {}) {
  const params = {
    search: query,
    page,
    page_size: pageSize,
    ordering: "-added", // o lo que prefieras
    genres,
    tags,
    publishers,
    ids,
  };
  return request("/games", params);
}

// Detalle
export function getGameDetails(id) {
  return request(`/games/${id}`);
}

// Publishers
export function getPublishers({ page = 1, pageSize = 20, search = "" } = {}) {
  return request("/publishers", {
    page,
    page_size: pageSize,
    search,
  });
}

export function getPublisherDetails(id) {
  return request(`/publishers/${id}`);
}

export function getPublisherGames(
  publisherId,
  { page = 1, pageSize = 20 } = {},
) {
  return request("/games", {
    publishers: publisherId,
    page,
    page_size: pageSize,
    ordering: "-added",
  });
}
