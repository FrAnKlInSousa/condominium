"use client";

import { useEffect, useState } from "react";
import InformativoForm from "./InformativoForm";

import { getInformativos, deleteInformativo } from "@/lib/api";
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

  async function loadInformativos() {
    try {
      const res = await getInformativos({
        search,
        data: dataFiltro,
        page: paginaAtual,
        limit: limite,
      });

      setInformativos(res.data);
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
    setInformativoSelecionado(null);

    setRefreshKey((prev) => prev + 1); // 👈 FORÇA RELOAD

    if (informativoSelecionado) {
      mostrarMensagemTemp("Informativo atualizado");
    } else {
      mostrarMensagemTemp("Informativo criado");
    }
  }

  return (
    <div>
      {mostrarToast && <div>{mensagem}</div>}

      <div>
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
        />

        <button onClick={limparFiltro}>Limpar</button>
      </div>

      <h2>
        {informativoSelecionado ? "Editando Informativo" : "Novo Informativo"}
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

      <hr />
      <h2>Informativos</h2>

      {informativos.map((c) => (
        <div key={c.id}>
          <h3>{c.titulo}</h3>
          <p>{c.descricao}</p>
          <small>{new Date(c.data).toLocaleDateString("pt-BR")}</small>

          <div>
            <button onClick={() => editar(c)}>Editar</button>
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
              <button onClick={() => handleDelete(c.id)}>Deletar</button>
            )}
          </div>
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
