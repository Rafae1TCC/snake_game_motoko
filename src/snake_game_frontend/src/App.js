import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "../../declarations/snake_game_backend";

const internetIdentityCanisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
const backendCanisterId = "b77ix-eeaaa-aaaaa-qaada-cai";

let authClient;
let backendActor;
let userPrincipal;

// Inicializa la autenticación con Internet Identity
export async function initAuth() {
  authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    login();
  }
}

// Inicia sesión con Internet Identity
export async function login() {
  await authClient.login({
    identityProvider: `http://${internetIdentityCanisterId}.localhost:4943`,
    onSuccess: () => handleAuthenticated(authClient),
  });
}

// Maneja el estado autenticado del usuario
async function handleAuthenticated(client) {
  userPrincipal = client.getIdentity().getPrincipal();
  backendActor = createActor(backendCanisterId, {
    agentOptions: { identity: client.getIdentity() },
  });

  document.getElementById("loginBtn").innerText = `Bienvenido ${userPrincipal.toText()}`;
  document.getElementById("saveScoreBtn").disabled = false;
  fetchHighScores();
}

// Guarda el puntaje en el backend
export async function saveScore(score) {
  if (!backendActor) {
    alert("Inicia sesión primero.");
    return;
  }
  try {
    const result = await backendActor.saveScore(userPrincipal, BigInt(score));
    alert(result ? "Puntuación guardada exitosamente." : "No fue posible guardar la puntuación.");
    fetchHighScores();
  } catch (error) {
    console.error("Error al guardar la puntuación:", error);
  }
}

// Obtiene y muestra los "high scores"
export async function fetchHighScores() {
  try {
    const highScores = await backendActor.getHighScores();
    const highScoresList = document.getElementById("highScoresList");
    highScoresList.innerHTML = "";
    highScores.forEach(record => {
      const listItem = document.createElement("li");
      listItem.textContent = `Usuario: ${record.userId.toText()}, Puntuación: ${record.score}`;
      highScoresList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error al obtener high scores:", error);
  }
}
