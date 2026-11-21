
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { menuPorRol } from "../config/menu";

export default function Sidebar({ abierto, cerrar, colapsado }) {
  const { usuario } = useAuth();
  const opciones = menuPorRol(usuario?.rol);

  return (
    <>
      {abierto && (
        <button
          type="button"
          className="nexdesk-overlay"
          onClick={cerrar}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        id="nexdesk-sidebar"
        className={`nexdesk-sidebar ${abierto ? "abierto" : ""} ${colapsado ? "colapsado" : ""}`}
        aria-label="Navegación principal"
      >
        <div className="nexdesk-sidebar-brand">
          <span className="nexdesk-brand-icon">D</span>
          <div>
            <strong className="delta-wordmark">DELTA</strong>
            <small>Sistema de soporte</small>
          </div>
        </div>

        <div className="nexdesk-sidebar-label">
          MENÚ PRINCIPAL
        </div>

        <nav className="nexdesk-sidebar-nav">
          {opciones.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              onClick={cerrar}
              title={colapsado ? opcion.titulo : undefined}
              className={({ isActive }) =>
                `nexdesk-nav-link ${isActive ? "activo" : ""}`
              }
            >
              <span className="nexdesk-nav-icon">
                {opcion.icono}
              </span>
              <span>{opcion.titulo}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nexdesk-sidebar-footer">
          <span className="nexdesk-online-dot" />
          Sistema de soporte
          <small>Helpdesk Organizacional para empresas</small>
        </div>
      </aside>
    </>
  );
}
