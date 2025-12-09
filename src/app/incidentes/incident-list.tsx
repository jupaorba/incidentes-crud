"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { updateIncidentStatus, deleteIncident } from "./actions";

interface Incident {
  id: number;
  title: string;
  description: string;
  status: string;
  severity: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IncidentListProps {
  incidents: Incident[];
}

export default function IncidentList({ incidents }: IncidentListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const [dateFilter, setDateFilter] = useState("");

  // Modal states
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [incidentToDelete, setIncidentToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateIncidentStatus(id, newStatus);
      setToast({ show: true, message: "Estado actualizado correctamente" });

      if (selectedIncident && selectedIncident.id === id) {
        setSelectedIncident({ ...selectedIncident, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setToast({ show: true, message: "Error al actualizar el estado" });
    }
  };

  const handleDeleteClick = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIncidentToDelete(id);
  };

  const confirmDelete = async () => {
    if (incidentToDelete === null) return;

    try {
      await deleteIncident(incidentToDelete);
      setToast({ show: true, message: "Incidente eliminado correctamente" });
      setIncidentToDelete(null);
      setSelectedIncident(null); // Close details modal if open
    } catch (error) {
      console.error("Error deleting incident:", error);
      setToast({ show: true, message: "Error al eliminar el incidente" });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Abierto":
        return "#3b82f6";
      case "En progreso":
        return "#eab308";
      case "Cerrado":
        return "#22c55e";
      default:
        return "#9ca3af";
    }
  };

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      // Search filter (title or description)
      const matchesSearch =
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Priority filter
      const matchesPriority =
        priorityFilter === "Todas" || incident.severity === priorityFilter;

      // Date filter
      let matchesDate = true;
      if (dateFilter) {
        const incidentDate = new Date(incident.createdAt)
          .toISOString()
          .split("T")[0];
        matchesDate = incidentDate === dateFilter;
      }

      return matchesSearch && matchesPriority && matchesDate;
    });
  }, [incidents, searchTerm, priorityFilter, dateFilter]);

  return (
    <div
      className="container"
      style={{
        padding: "4rem 1.5rem",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Toast Notification */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          padding: "1rem 1.5rem",
          borderRadius: "var(--radius)",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          border: "1px solid hsl(var(--border))",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          transform: toast.show ? "translateY(0)" : "translateY(150%)",
          opacity: toast.show ? 1 : 0,
          transition: "transform 0.3s ease, opacity 0.3s ease",
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p style={{ fontWeight: 500 }}>{toast.message}</p>
      </div>

      {/* Delete Confirmation Modal */}
      {incidentToDelete !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 110, // Higher than details modal
            padding: "1rem",
          }}
          onClick={() => setIncidentToDelete(null)}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "2rem",
              borderRadius: "var(--radius)",
              border: "1px solid #f87171",
              background: "hsla(var(--background) / 0.95)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              ¿Eliminar incidente?
            </h3>
            <p
              style={{
                marginBottom: "2rem",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              ¿Estás seguro de que deseas eliminar este incidente? Esta acción
              no se puede deshacer.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setIncidentToDelete(null)}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--radius)",
                  border: "1px solid hsla(var(--foreground) / 0.1)",
                  background: "transparent",
                  color: "hsl(var(--foreground))",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--radius)",
                  border: "none",
                  background: "#f87171",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
          onClick={() => setSelectedIncident(null)}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "2rem",
              borderRadius: "var(--radius)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedIncident(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "99px",
                  border: "1px solid",
                  display: "inline-block",
                  marginBottom: "0.5rem",
                  ...(selectedIncident.severity === "Alta"
                    ? {
                        color: "#f87171",
                        borderColor: "rgba(248, 113, 113, 0.3)",
                        backgroundColor: "rgba(248, 113, 113, 0.1)",
                      }
                    : selectedIncident.severity === "Media"
                    ? {
                        color: "#facc15",
                        borderColor: "rgba(250, 204, 21, 0.3)",
                        backgroundColor: "rgba(250, 204, 21, 0.1)",
                      }
                    : {
                        color: "#4ade80",
                        borderColor: "rgba(74, 222, 128, 0.3)",
                        backgroundColor: "rgba(74, 222, 128, 0.1)",
                      }),
                }}
              >
                {selectedIncident.severity}
              </span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                {selectedIncident.title}
              </h2>
              <p
                style={{
                  color: "hsl(var(--muted-foreground))",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                Creado el {formatDate(selectedIncident.createdAt)}
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Descripción
              </h3>
              <p style={{ lineHeight: "1.6", color: "hsl(var(--foreground))" }}>
                {selectedIncident.description}
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                background: "hsla(var(--foreground) / 0.05)",
                borderRadius: "var(--radius)",
                border: "1px solid hsla(var(--foreground) / 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Gestión del Estado
              </h3>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getStatusColor(selectedIncident.status),
                  }}
                />
                <select
                  value={selectedIncident.status}
                  onChange={(e) =>
                    handleStatusChange(selectedIncident.id, e.target.value)
                  }
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "calc(var(--radius) - 4px)",
                    background: "hsla(var(--background) / 1)",
                    border: "1px solid hsla(var(--foreground) / 0.15)",
                    color: "inherit",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="Abierto">Abierto</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid hsla(var(--foreground) / 0.1)",
                paddingTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={(e) => handleDeleteClick(selectedIncident.id, e)}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--radius)",
                  border: "1px solid #f87171",
                  background: "rgba(248, 113, 113, 0.1)",
                  color: "#f87171",
                  cursor: "pointer",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Eliminar Incidente
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        style={{
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Tablero de Incidentes
            </h1>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>
              Gestiona y monitorea los incidentes reportados.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              className="glass"
              style={{
                display: "flex",
                padding: "0.25rem",
                borderRadius: "var(--radius)",
                gap: "0.25rem",
              }}
            >
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "0.5rem",
                  borderRadius: "calc(var(--radius) - 2px)",
                  background:
                    viewMode === "grid"
                      ? "hsla(var(--foreground) / 0.1)"
                      : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                }}
                title="Vista Cuadrícula"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("table")}
                style={{
                  padding: "0.5rem",
                  borderRadius: "calc(var(--radius) - 2px)",
                  background:
                    viewMode === "table"
                      ? "hsla(var(--foreground) / 0.1)"
                      : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                }}
                title="Vista Tabla"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3h18v18H3z" />
                  <path d="M21 9H3" />
                  <path d="M21 15H3" />
                  <path d="M12 3v18" />
                </svg>
              </button>
            </div>
            <Link href="/incidentes/nuevo" className="btn btn-primary">
              + Nuevo Incidente
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className="glass"
          style={{
            padding: "1rem",
            borderRadius: "var(--radius)",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid hsla(var(--foreground) / 0.1)",
              }}
            />
          </div>
          <div style={{ minWidth: "150px" }}>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="select"
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid hsla(var(--foreground) / 0.1)",
              }}
            >
              <option value="Todas">Todas las prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input"
              style={{
                background: "transparent",
                border: "1px solid hsla(var(--foreground) / 0.1)",
                color: "var(--foreground)",
              }}
            />
          </div>
          {(searchTerm || priorityFilter !== "Todas" || dateFilter) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setPriorityFilter("Todas");
                setDateFilter("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "hsl(var(--muted-foreground))",
                cursor: "pointer",
                fontSize: "0.875rem",
                textDecoration: "underline",
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </header>

      {filteredIncidents.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 2rem",
            textAlign: "center",
            background: "hsla(var(--foreground) / 0.02)",
            borderRadius: "var(--radius)",
            border: "2px dashed hsla(var(--foreground) / 0.1)",
          }}
        >
          <div
            style={{
              background: "hsla(var(--foreground) / 0.05)",
              padding: "1.5rem",
              borderRadius: "50%",
              marginBottom: "1.5rem",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
              <line x1="9" y1="14" x2="15" y2="14" />
              <line x1="9" y1="18" x2="15" y2="18" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            {incidents.length === 0
              ? "No hay incidentes registrados"
              : "No se encontraron resultados"}
          </h2>
          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              maxWidth: "400px",
              marginBottom: "2rem",
            }}
          >
            {incidents.length === 0
              ? "Actualmente no hay incidentes en el sistema. Puedes crear uno nuevo para comenzar el seguimiento."
              : "Intenta ajustar tus filtros de búsqueda para encontrar lo que buscas."}
          </p>
          {incidents.length === 0 && (
            <Link href="/incidentes/nuevo" className="btn btn-primary">
              Registrar Primer Incidente
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              className="glass"
              style={{
                padding: "1.5rem",
                borderRadius: "var(--radius)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "99px",
                    border: "1px solid",
                    ...(incident.severity === "Alta"
                      ? {
                          color: "#f87171",
                          borderColor: "rgba(248, 113, 113, 0.3)",
                          backgroundColor: "rgba(248, 113, 113, 0.1)",
                        }
                      : incident.severity === "Media"
                      ? {
                          color: "#facc15",
                          borderColor: "rgba(250, 204, 21, 0.3)",
                          backgroundColor: "rgba(250, 204, 21, 0.1)",
                        }
                      : {
                          color: "#4ade80",
                          borderColor: "rgba(74, 222, 128, 0.3)",
                          backgroundColor: "rgba(74, 222, 128, 0.1)",
                        }),
                  }}
                >
                  {incident.severity}
                </span>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: getStatusColor(incident.status),
                  }}
                  title={incident.status}
                />
              </div>

              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  lineHeight: "1.4",
                }}
              >
                {incident.title}
              </h3>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  color: "hsl(var(--muted-foreground))",
                  paddingTop: "1rem",
                  borderTop: "1px solid hsla(var(--foreground) / 0.1)",
                }}
              >
                <span>{formatDate(incident.createdAt)}</span>
                <span>{incident.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="glass"
          style={{ borderRadius: "var(--radius)", overflow: "hidden" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid hsla(var(--foreground) / 0.1)",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  Título
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  Estado
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  Prioridad
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  Fecha
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "hsl(var(--muted-foreground))",
                    textAlign: "right",
                  }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  style={{
                    borderBottom: "1px solid hsla(var(--foreground) / 0.05)",
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                  }}
                  className="hover:bg-white/5"
                >
                  <td style={{ padding: "1rem" }}>#{incident.id}</td>
                  <td style={{ padding: "1rem", fontWeight: "500" }}>
                    {incident.title}
                  </td>
                  <td
                    style={{ padding: "1rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.25rem 0.5rem",
                          background: "hsla(var(--foreground) / 0.05)",
                          borderRadius: "4px",
                          border: "1px solid hsla(var(--foreground) / 0.1)",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: getStatusColor(incident.status),
                            flexShrink: 0,
                          }}
                        />
                        <select
                          value={incident.status}
                          onChange={(e) =>
                            handleStatusChange(incident.id, e.target.value)
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            margin: 0,
                            color: "inherit",
                            fontSize: "inherit",
                            cursor: "pointer",
                            outline: "none",
                            paddingRight: "1rem",
                            paddingBlock: "0.25rem",
                            appearance: "none",
                            width: "100%",
                          }}
                        >
                          <option value="Abierto">Abierto</option>
                          <option value="En progreso">En progreso</option>
                          <option value="Cerrado">Cerrado</option>
                        </select>
                        <div
                          style={{
                            position: "absolute",
                            right: "0.5rem",
                            pointerEvents: "none",
                            opacity: 0.5,
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "99px",
                        border: "1px solid",
                        ...(incident.severity === "Alta"
                          ? {
                              color: "#f87171",
                              borderColor: "rgba(248, 113, 113, 0.3)",
                              backgroundColor: "rgba(248, 113, 113, 0.1)",
                            }
                          : incident.severity === "Media"
                          ? {
                              color: "#facc15",
                              borderColor: "rgba(250, 204, 21, 0.3)",
                              backgroundColor: "rgba(250, 204, 21, 0.1)",
                            }
                          : {
                              color: "#4ade80",
                              borderColor: "rgba(74, 222, 128, 0.3)",
                              backgroundColor: "rgba(74, 222, 128, 0.1)",
                            }),
                      }}
                    >
                      {incident.severity}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    {formatDate(incident.createdAt)}
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                    }}
                  >
                    <button
                      onClick={(e) => handleDeleteClick(incident.id, e)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "hsl(var(--muted-foreground))",
                        cursor: "pointer",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        transition: "color 0.2s, background-color 0.2s",
                      }}
                      className="hover:text-red-500 hover:bg-red-500/10"
                      title="Eliminar incidente"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
