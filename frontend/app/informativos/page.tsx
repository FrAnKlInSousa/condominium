"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InformativoForm from "./InformativoForm";
import { getMe } from "@/lib/api";

import { getInformativos, deleteInformativo } from "@/lib/api";
import { logout } from "@/lib/api";

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

  const [mensagem, setMensagem] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);
  const [informativoSelecionado, setInformativoSelecionado] =
    useState<Informativo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔁 debounce (substitui RxJS)
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadInformativos();
    }, 700);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadInformativos();
  }, [paginaAtual, refreshKey]);

  useEffect(() => {
    async function checkAuth() {
      try {
        await getMe();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

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

  function mostrarMensagemTemp(texto: string) {
    setMensagem(texto);
    setMostrarToast(true);

    setTimeout(() => {
      setMostrarToast(false);
    }, 1500);
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

      mostrarMensagemTemp("Informativo deletado");
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
    loadInformativos();
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
      mostrarMensagemTemp("Informativo atualizado");
    } else {
      mostrarMensagemTemp("Informativo criado");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-8">
      <div style={{ marginBottom: "16px" }}>
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => router.push("/login")}>Login</button>
        )}
      </div>
      {mostrarToast && <div>{mensagem}</div>}

      <div className="bg-white p-4 rounded shadow flex flex-col gap-3 md:flex-row">
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
          <h2>
            {informativoSelecionado
              ? "Editando Informativo"
              : "Novo Informativo"}
          </h2>

          <InformativoForm
            key={informativoSelecionado?.id ?? `novo-${refreshKey}`}
            informativo={informativoSelecionado}
            onSuccess={onSuccess}
          />

          {informativoSelecionado && (
            <button onClick={() => setInformativoSelecionado(null)}>
              Cancelar edição
            </button>
          )}
        </>
      )}

      {informativoSelecionado && (
        <button onClick={() => setInformativoSelecionado(null)}>
          Cancelar edição
        </button>
      )}

      <hr />
      <h2>Informativos</h2>

      {informativos.map((c) => (
        <div
          key={c.id}
          className="bg-white p-5 rounded shadow space-y-3 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800">{c.titulo}</h3>
          <p className="text-gray-600">{c.descricao}</p>
          <small className="text-gray-400">
            {new Date(c.data).toLocaleDateString("pt-BR")}
          </small>

          {isAuthenticated && (
            <div>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => editar(c)}
              >
                Editar
              </button>

              {confirmandoDeleteId === c.id ? (
                <>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deletandoIds.has(c.id)}
                  >
                    {deletandoIds.has(c.id) ? "Deletando..." : "Confirmar"}
                  </button>

                  <button onClick={() => setConfirmandoDeleteId(null)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(c.id)}
                >
                  Deletar
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <div>
        <button
          onClick={() => setPaginaAtual((p) => p - 1)}
          disabled={paginaAtual === 1}
        >
          ⬅
        </button>

        {getPaginas().map((p) => (
          <button
            key={p}
            onClick={() => setPaginaAtual(p)}
            style={{ fontWeight: p === paginaAtual ? "bold" : "normal" }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => setPaginaAtual((p) => p + 1)}
          disabled={paginaAtual === totalPaginas}
        >
          ➡
        </button>
      </div>
    </div>
  );
}
