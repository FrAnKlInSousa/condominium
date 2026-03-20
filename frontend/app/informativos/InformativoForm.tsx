"use client";

import { useEffect, useState } from "react";
import { createInformativo, updateInformativo } from "@/lib/api";

type Informativo = {
  id?: number;
  titulo: string;
  descricao: string;
  data: string;
};

type Props = {
  informativo?: Informativo | null;
  onSuccess: () => void;
};

export default function InformativoForm({ informativo, onSuccess }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (informativo) {
      setTitulo(informativo.titulo);
      setDescricao(informativo.descricao);
      setData(informativo.data?.split("T")[0]);
    } else {
      setTitulo("");
      setDescricao("");
      setData("");
    }
  }, [informativo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      if (informativo?.id) {
        await updateInformativo(informativo.id, {
          titulo,
          descricao,
          data,
        });
      } else {
        await createInformativo({
          titulo,
          descricao,
          data,
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Salvando..." : informativo ? "Atualizar" : "Criar"}
      </button>
    </form>
  );
}
