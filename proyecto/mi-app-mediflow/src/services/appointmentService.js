const API = "http://localhost:8080/api/citas";

export const createAppointment = async (data) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.error || "Error al crear cita");
  }

  return response;
};

export const getAppointmentsByUser = async (userId) => {
  const res = await fetch(`http://localhost:8080/api/citas/usuario/${userId}`);

  if (!res.ok) {
    throw new Error("Error al obtener citas");
  }

  return res.json();
};