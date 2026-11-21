
import { AuthProvider } from "./context/AuthContext.jsx";
import AppRouter from "./routes/AppRouter";
/*<AuthContext.Provider
  value={{
    usuario,
    token,
    cargandoSesion,
    login,
    logout,
    cambiarPassword,
  }}
>
  {children}
</AuthContext.Provider>
*/
export default function App() {
  //Contiene token y usuario, además de funciones para iniciar sesión, cerrar sesión y cambiar contraseña
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
