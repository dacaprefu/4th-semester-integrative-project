
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CampanaNotificaciones from "./CampanaNotificaciones";

export default function NavbarPrincipal({ abrirMenu, menuColapsado, modoOscuro, cambiarModo, vistaCompacta, cambiarVistaCompacta }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // 1. INFORMACIÓN DEL USUARIO
  // ==========================================

  const nombreCompleto = [
    usuario?.nombre,
    usuario?.apellido,
  ]
    .filter(Boolean)
    .join(" ");

  const inicial =
    usuario?.nombre?.charAt(0)?.toUpperCase() || "U";

  // ==========================================
  // 2. CERRAR SESIÓN
  // ==========================================

  function cerrarSesion() {
    sessionStorage.removeItem(
      "nexdesk_mostrar_bienvenida"
    );

    logout();

    navigate("/login", { replace: true });
  }

  // ==========================================
  // 3. BARRA DE NAVEGACIÓN
  // ==========================================

  return (
    <header className="nexdesk-topbar">

      {/* SECCIÓN IZQUIERDA */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-light nexdesk-menu-toggle"
          onClick={abrirMenu}
          aria-label="Alternar menú de navegación"
          aria-controls="nexdesk-sidebar"
          title={menuColapsado ? "Expandir menú" : "Contraer menú"}
        >
          <span className="nexdesk-menu-icon-mobile" aria-hidden="true">☰</span>
          <span className="nexdesk-menu-icon-desktop" aria-hidden="true">
            {menuColapsado ? "☰" : "◧"}
          </span>
        </button>

        <div className="nexdesk-page-heading">
          <span className="nexdesk-page-eyebrow">DELTA · CENTRO DE SOPORTE</span>
          <strong className="nexdesk-page-title">
            Gestión de soporte técnico
          </strong>

          <small className="nexdesk-page-subtitle">
            Sistema Integral de Gestión de Soporte Técnico
          </small>
        </div>

      </div>

      {/* SECCIÓN DERECHA */}
      <div className="d-flex align-items-center gap-3">

        <button
          type="button"
          className="btn btn-outline-secondary nexdesk-density-toggle"
          onClick={cambiarVistaCompacta}
          aria-label={vistaCompacta ? "Desactivar vista compacta" : "Activar vista compacta"}
          aria-pressed={vistaCompacta}
          title={vistaCompacta ? "Vista cómoda" : "Vista compacta"}
        >
          <span aria-hidden="true">▤</span>
          <span className="d-none d-lg-inline">
            {vistaCompacta ? "Vista cómoda" : "Vista compacta"}
          </span>
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary nexdesk-theme-toggle"
          onClick={cambiarModo}
          aria-label={modoOscuro ? "Activar modo claro" : "Activar modo nocturno"}
          aria-pressed={modoOscuro}
          title={modoOscuro ? "Activar modo claro" : "Activar modo nocturno"}
        >
          <span aria-hidden="true">{modoOscuro ? "☀️" : "🌙"}</span>
          <span className="d-none d-sm-inline">
            {modoOscuro ? "Modo claro" : "Modo nocturno"}
          </span>
        </button>

        {/* CAMPANA DE NOTIFICACIONES */}
        <CampanaNotificaciones />

        {/* MENÚ DEL USUARIO */}
        <div className="dropdown">

          <button
            className="btn d-flex align-items-center gap-2"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="nexdesk-avatar">
              {inicial}
            </span>

            <span className="text-start nexdesk-user-info">

              <strong className="d-block small">
                {nombreCompleto || "Usuario"}
              </strong>

              <small className="text-secondary">
                {usuario?.rol}
              </small>

            </span>

            <span aria-hidden="true">⌄</span>

          </button>

          {/* OPCIONES DEL USUARIO */}
          <ul className="dropdown-menu dropdown-menu-end shadow border-0">

            <li>
              <span className="dropdown-item-text small text-secondary">
                {usuario?.email}
              </span>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <Link
                className="dropdown-item"
                to="/cambiar-password"
              >
                Cambiar contraseña
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="dropdown-item text-danger"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </li>

          </ul>

        </div>

      </div>

    </header>
  );
}
