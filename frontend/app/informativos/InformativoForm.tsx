"use client";

import { useEffect, useState } from "react";
import { createInformativo, updateInformativo } from "@/lib/api";
import Button from "@/components/Button";
import Input from "@/components/Input";

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
      const payload = {
        titulo,
        descricao: descricao?.trim() || undefined,
        data,
      };
      if (informativo?.id) {
        await updateInformativo(informativo.id, payload);
      } else {
        await createInformativo(payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm border space-y-6"
    >
      <div className="flex flex-col gap-1 md:w-1/2">
        <label className="text-sm font-medium text-gray-700">Título</label>
        <Input
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Descrição <span className="text-gray-400">(opcional)</span>
        </label>
        <textarea
          className="border rounded px-3 py-2 w-full min-h-[100px] resize-none"
          placeholder="Descreva o ocorrido..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Data do ocorrido
          </label>
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="success"
          className="md:ml-auto"
        >
          {loading ? "Salvando..." : informativo ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
