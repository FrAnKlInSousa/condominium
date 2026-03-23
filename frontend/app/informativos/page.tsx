"use client";

import { useEffect, useState } from "react";
import InformativoForm from "./InformativoForm";
import { getInformativos, deleteInformativo } from "@/lib/api";
import Button from "@/components/Button";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/date";

type Informativo = {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
};

export default function InformativosPage() {
  const [informativos, setInformativos] = useState<Informativo[]>([]);
  const [search, setSearch] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [limite] = useState(5);

  const [confirmandoDeleteId, setConfirmandoDeleteId] = useState<number | null>(
    null,
  );
  const [deletandoIds, setDeletandoIds] = useState<Set<number>>(new Set());

  const [informativoSelecionado, setInformativoSelecionado] =
    useState<Informativo | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const { isAuthenticated } = useAuth();

  const { showToast } = useToast();

  // 🔁 debounce busca
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadInformativos();
    }, 700);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadInformativos();
  }, [paginaAtual, refreshKey, dataFiltro]);

  async function loadInformativos() {
    try {
      const res = await getInformativos({
        search,
        data: dataFiltro,
        page: paginaAtual,
        limit: limite,
      });

      setInformativos([...res.data]);
      setTotalPaginas(Math.ceil(res.total / limite));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number) {
    if (confirmandoDeleteId !== id) {
      setConfirmandoDeleteId(id);
      return;
    }

    if (deletandoIds.has(id)) return;

    setDeletandoIds((prev) => new Set(prev).add(id));

    try {
      await deleteInformativo(id);

      showToast("Informativo deletado");
      setConfirmandoDeleteId(null);

      loadInformativos();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletandoIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  }

  function limparFiltro() {
    setSearch("");
    setDataFiltro("");
    setPaginaAtual(1);
    setRefreshKey((prev) => prev + 1);
  }

  function getPaginas() {
    const paginas: number[] = [];

    const inicio = Math.max(1, paginaAtual - 2);
    const fim = Math.min(totalPaginas, paginaAtual + 2);

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  function editar(inf: Informativo) {
    setInformativoSelecionado(inf);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function onSuccess() {
    const isEdit = !!informativoSelecionado;

    setInformativoSelecionado(null);
    setRefreshKey((prev) => prev + 1);

    if (isEdit) {
      showToast("Informativo atualizado");
    } else {
      showToast("Informativo criado");
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3 md:flex-row border">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          className="border rounded px-3 py-2"
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
        />

        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={limparFiltro}
        >
          Limpar
        </button>
      </div>

      {isAuthenticated && (
        <>
          <h2 className="text-xl font-semibold">
            {informativoSelecionado
              ? "Editando Informativo"
              : "Novo Informativo"}
          </h2>

          <div className="space-y-3">
            <InformativoForm
              key={informativoSelecionado?.id ?? `novo-${refreshKey}`}
              informativo={informativoSelecionado}
              onSuccess={onSuccess}
            />

            {informativoSelecionado && (
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setInformativoSelecionado(null)}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </>
      )}

      <hr />
      <h2 className="text-xl font-semibold mt-6">Informativos</h2>

      {informativos.map((c) => (
        <div
          key={c.id}
          className="bg-white p-5 rounded-lg shadow-sm space-y-3 border hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">{c.titulo}</h3>
          <p className="text-gray-600">{c.descricao}</p>
          <small className="text-gray-400">{formatDate(c.data)}</small>

          {isAuthenticated && (
            <div className="flex gap-2 mt-2">
              <Button variant="warning" onClick={() => editar(c)}>
                Editar
              </Button>

              {confirmandoDeleteId === c.id ? (
                <>
                  <Button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletandoIds.has(c.id)}
                  >
                    Confirmar
                  </Button>

                  <Button
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    onClick={() => setConfirmandoDeleteId(null)}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button variant="danger" onClick={() => handleDelete(c.id)}>
                  Deletar
                </Button>
              )}
            </div>
          )}
        </div>
      ))}

      {informativos.length === 0 && (
        <div className="text-center text-gray-500">
          Nenhum informativo encontrado!!
        </div>
      )}

      <div className="flex gap-2 items-center justify-center mt-4">
        <button
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPaginaAtual((p) => p - 1)}
          disabled={paginaAtual === 1}
        >
          Anterior
        </button>

        {getPaginas().map((p) => (
          <button
            key={p}
            className={`px-3 py-1 border rounded ${
              p === paginaAtual
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => setPaginaAtual(p)}
          >
            {p}
          </button>
        ))}

        <button
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPaginaAtual((p) => p + 1)}
          disabled={paginaAtual === totalPaginas || totalPaginas === 0}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
