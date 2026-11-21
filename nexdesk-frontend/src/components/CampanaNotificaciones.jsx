
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import {
  listarNotificaciones,
  contarPendientes,
  marcarNotificacionLeida,
} from "../services/notificaciones.service";

export default function CampanaNotificaciones() {
  const { token, usuario } = useAuth();
  const navigate = useNavigate();

  const [abierto, setAbierto] = useState(false);
  const [avisos, setAvisos] = useState([]);
  const [pendientes, setPendientes] = useState(0);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const actualizar = useCallback(
    async (signal) => {
      if (!token) return;

      try {
        const [lista, cuenta] = await Promise.all([
          listarNotificaciones(token, signal),
          contarPendientes(token, signal),
        ]);

        if (signal?.aborted) return;

        setAvisos(lista);
        setPendientes(cuenta.pendientes);
        setError("");
      } catch (e) {
        if (!signal?.aborted) {
          setError(e.message);
        }
      }
    },
    [token]
  );

  // Consultar cada 30 segundos
  useEffect(() => {
    if (
      !token ||
      usuario?.debe_cambiar_password ||
      usuario?.debeCambiarPassword
    ) {
      return;
    }

    const controller = new AbortController();

    Promise.resolve().then(() =>
      actualizar(controller.signal)
    );

    const intervalo = setInterval(() => {
      actualizar(controller.signal);
    }, 30000);

    return () => {
      controller.abort();
      clearInterval(intervalo);
    };
  }, [
    token,
    usuario?.debe_cambiar_password,
    usuario?.debeCambiarPassword,
    actualizar,
  ]);

  useEffect(() => {
    if (!abierto) return;

    const anterior = document.body.style.overflow;
    const cerrarConEscape = (evento) => {
      if (evento.key === "Escape") setAbierto(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto]);

  async function leer(aviso) {
    if (cargando) return;

    setCargando(true);

    try {
      if (!aviso.leida) {
        await marcarNotificacionLeida(token, aviso.id);
      }

      await actualizar();
      setAbierto(false);

      if (aviso.ticket_id) {
        navigate("/tickets");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="position-relative">
      <button
        type="button"
        className="btn btn-light position-relative nexdesk-notification-toggle"
        aria-label={`Notificaciones: ${pendientes} sin leer`}
        aria-expanded={abierto}
        onClick={() => {
          setAbierto(!abierto);

          if (!abierto) {
            void actualizar();
          }
        }}
      >
        <span aria-hidden="true">🔔</span>

        {pendientes > 0 && (
          <span
            className={
              "position-absolute top-0 start-100 " +
              "translate-middle badge rounded-pill bg-danger"
            }
          >
            {pendientes > 99 ? "99+" : pendientes}
          </span>
        )}
      </button>

      {abierto && (
        <>
          <div className="modal-backdrop show nexdesk-notification-backdrop" />
          <div
            className="modal d-block nexdesk-notification-modal"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-notificaciones"
            style={{ zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 rounded-4 shadow">
                <div className="modal-header px-4 pt-4">
                  <div>
                    <h2
                      id="titulo-notificaciones"
                      className="modal-title h5 fw-bold"
                    >
                      Notificaciones
                    </h2>
                    <p className="text-secondary small mb-0 mt-1">
                      {pendientes
                        ? `Tienes ${pendientes} notificación${pendientes === 1 ? "" : "es"} sin leer.`
                        : "Estás al día con tus notificaciones."}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar notificaciones"
                    onClick={() => setAbierto(false)}
                  />
                </div>

                <div className="modal-body px-4 pt-3">
                  {error && (
                    <div className="alert alert-warning small" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="list-group list-group-flush nexdesk-notification-list">
                    {avisos.length === 0 && (
                      <div className="py-4 text-center text-secondary small">
                        No tienes notificaciones.
                      </div>
                    )}

                    {avisos.map((aviso) => (
                      <button
                        key={aviso.id}
                        type="button"
                        disabled={cargando}
                        onClick={() => leer(aviso)}
                        className={
                          "list-group-item list-group-item-action text-start " +
                          (!aviso.leida ? "nexdesk-notification-unread" : "")
                        }
                      >
                        <div className="d-flex justify-content-between gap-2">
                          <strong className="small">{aviso.titulo}</strong>
                          {!aviso.leida && (
                            <span className="badge bg-primary">Nueva</span>
                          )}
                        </div>

                        <div className="small mt-1">{aviso.mensaje}</div>
                        <small className="text-secondary d-block mt-2">
                          {new Date(aviso.fecha_creacion).toLocaleString("es-CO")}
                        </small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-footer px-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setAbierto(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => void actualizar()}
                    disabled={cargando}
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
