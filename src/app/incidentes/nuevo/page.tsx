"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createIncident } from "../actions";

export default function NewIncidentPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      await createIncident(formData);
      router.push("/incidentes");
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Error al crear el incidente");
    }
  }

  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem 0",
      }}
    >
      <main
        className="glass"
        style={{
          padding: "3rem",
          borderRadius: "var(--radius)",
          maxWidth: "600px",
          width: "100%",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Registrar Nuevo Incidente
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="label">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="input"
              placeholder="Ej: Error en el servidor de pagos"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="label">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              className="textarea"
              placeholder="Describe los detalles del incidente..."
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div className="form-group">
              <label htmlFor="priority" className="label">
                Prioridad
              </label>
              <select id="priority" name="priority" className="select" required>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="label">
                Estado
              </label>
              <select
                id="status"
                name="status"
                className="select"
                defaultValue="Abierto"
                required
              >
                <option value="Abierto">Abierto</option>
                <option value="En progreso">En progreso</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn"
              style={{
                flex: 1,
                background: "hsl(var(--secondary))",
                color: "hsl(var(--secondary-foreground))",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Registrar Incidente"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
