"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../services/api";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Erro:", err));
  }, []);

  return (
    <div>
      <h1>Usuários</h1>

      {users.map((u: any) => (
        <p key={u.id}>{u.name}</p>
      ))}
    </div>
  );
}
