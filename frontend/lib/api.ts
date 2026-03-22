const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔥 wrapper central
async function apiFetch(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    // 🔥 opcional: limpar token automaticamente
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    throw new Error("Erro na requisição");
  }

  return res.json();
}

// =========================
// INFORMativos
// =========================

export async function getInformativos(params: {
  search?: string;
  data?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  if (params.data) query.append("data", params.data);
  query.append("page", String(params.page ?? 1));
  query.append("limit", String(params.limit ?? 5));

  return apiFetch(`/comunicados?${query.toString()}`, {
    cache: "no-store",
  });
}

export async function deleteInformativo(id: number) {
  return apiFetch(`/comunicados/${id}/delete`, {
    method: "PATCH",
  });
}

export async function createInformativo(data: {
  titulo: string;
  descricao: string;
  data: string;
}) {
  return apiFetch(`/comunicados`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateInformativo(
  id: number,
  data: {
    titulo: string;
    descricao: string;
    data: string;
  },
) {
  return apiFetch(`/comunicados/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// =========================
// AUTH
// =========================

export async function login(email: string, password: string) {
  return apiFetch(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
