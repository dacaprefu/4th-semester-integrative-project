
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import NavbarPrincipal from "../components/NavbarPrincipal";

export default function MainLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuColapsado, setMenuColapsado] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(
    () => localStorage.getItem("nexdesk_modo_oscuro") === "true",
  );
  const [vistaCompacta, setVistaCompacta] = useState(
    () => localStorage.getItem("delta_vista_compacta") === "true",
  );

  function cambiarModo() {
    setModoOscuro((actual) => {
      const siguiente = !actual;
      localStorage.setItem("nexdesk_modo_oscuro", String(siguiente));
      return siguiente;
    });
  }

  function cambiarVistaCompacta() {
    setVistaCompacta((actual) => {
      const siguiente = !actual;
      localStorage.setItem("delta_vista_compacta", String(siguiente));
      return siguiente;
    });
  }

  function alternarMenu() {
    if (window.matchMedia("(max-width: 991px)").matches) {
      setMenuAbierto(true);
      return;
    }

    setMenuColapsado((actual) => !actual);
  }

  return (
    <div
      className="nexdesk-app"
      data-bs-theme={modoOscuro ? "dark" : "light"}
      data-density={vistaCompacta ? "compact" : "comfortable"}
      data-sidebar-collapsed={menuColapsado}
    >
      <Sidebar
        abierto={menuAbierto}
        cerrar={() => setMenuAbierto(false)}
        colapsado={menuColapsado}
      />

      <div className="nexdesk-main">
        <NavbarPrincipal
          abrirMenu={alternarMenu}
          menuColapsado={menuColapsado}
          modoOscuro={modoOscuro}
          cambiarModo={cambiarModo}
          vistaCompacta={vistaCompacta}
          cambiarVistaCompacta={cambiarVistaCompacta}
        />

        <main className="nexdesk-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
