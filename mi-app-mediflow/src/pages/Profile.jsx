import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
  return (
    <>
      <Header />

      <div style={{ padding: "20px" }}>
        <h2>Mi Perfil</h2>

        <p>Nombre: Usuario</p>
        <p>Email: usuario@email.com</p>
      </div>

      <Footer />
    </>
  );
}