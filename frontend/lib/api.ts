const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const res = await fetch(`${API_URL}/comunicados?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar informativos");
  }

  return res.json();
}

export async function deleteInformativo(id: number) {
  const res = await fetch(`${API_URL}/comunicados/${id}/delete`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar");
  }
}

export async function createInformativo(data: {
  titulo: string;
  descricao: string;
  data: string;
}) {
  const res = await fetch(`${API_URL}/comunicados`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao criar");

  return res.json();
}

export async function updateInformativo(
  id: number,
  data: {
    titulo: string;
    descricao: string;
    data: string;
  },
) {
  const res = await fetch(`${API_URL}/comunicados/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao atualizar");

  return res.json();
}
