const API = "http://localhost:8080/api/usuarios";

export const registerUser = async (data) => {
  const res = await fetch("http://localhost:8080/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const response = await res.json();

  console.log("ERROR/RESPUESTA REGISTRO:", response);

  if (!res.ok) {
    throw new Error(response.error || "Error al registrar usuario");
  }

  return response;
};


export const loginUser = async (correo, password) => {
  console.log("ENVIANDO:", correo, password);

  const res = await fetch("http://localhost:8080/api/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo,
      password,
    }),
  });

  const data = await res.json();

  console.log("RESPUESTA BACKEND:", data);

  if (!res.ok) {
    throw new Error(data.error || "Error en login");
  }

  localStorage.setItem("user", JSON.stringify(data));

  return data;
};