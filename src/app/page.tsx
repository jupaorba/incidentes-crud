import Link from "next/link";
export default function Home() {
  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: "2rem",
      }}
    >
      <main
        className="glass"
        style={{
          padding: "4rem",
          borderRadius: "var(--radius)",
          maxWidth: "600px",
          width: "100%",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            marginBottom: "1rem",
            letterSpacing: "-0.05em",
            background: "linear-gradient(135deg, hsl(var(--primary)), #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Incidentes
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "hsl(var(--muted-foreground))",
            marginBottom: "2.5rem",
            lineHeight: "1.6",
          }}
        >
          Panel de gestión de incidentes.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/incidentes/nuevo" className="btn btn-primary">
            Nuevo Incidente
          </Link>
          <Link
            href="/incidentes"
            className="btn"
            style={{
              background: "hsl(var(--secondary))",
              color: "hsl(var(--secondary-foreground))",
            }}
          >
            Ver Tablero
          </Link>
        </div>
      </main>

      <footer
        style={{
          padding: "2rem",
          color: "hsl(var(--muted-foreground))",
          fontSize: "0.875rem",
        }}
      >
        &copy; {new Date().getFullYear()} Incidentes. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
