
import { API_URL } from "../config/api";

/**
 * Verifica la cabecera de la respuesta y si es JSON, la parsea y devuelve los datos. Si no es JSON o hay un error, lanza un error con el mensaje correspondiente
 */
async function procesarRespuesta(respuesta) {
  const tipo = respuesta.headers.get("content-type") || "";

  if (!tipo.includes("application/json")) {
    throw new Error(
      `Respuesta inesperada del servidor: HTTP ${respuesta.status}`
    );
  }

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const error = new Error(
      datos.mensaje ||
      datos.error ||
      `Error HTTP ${respuesta.status}`
    );

    error.status = respuesta.status;
    error.codigo = datos.codigo;

    throw error;
  }

  return datos;
}
//metodo para iniciar sesión, obtener perfil y cambiar contraseña
export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ email, password }),
  });

  return procesarRespuesta(respuesta);
}

//Solo se utiliza para restaurar la sesión al recargar la página, no para iniciar sesión
export async function obtenerPerfil(token) {
  const respuesta = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return procesarRespuesta(respuesta);
}

export async function cambiarPassword(
  token,
  passwordActual,
  passwordNueva
) {
  const respuesta = await fetch(
    `${API_URL}/api/auth/cambiar-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        passwordActual,
        passwordNueva,
      }),
    }
  );

  return procesarRespuesta(respuesta);
}
