import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "../../declarations/snake_game_backend";

// Obtén los IDs de canisters automáticamente desde las variables de entorno
const internetIdentityCanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;
const backendCanisterId = process.env.CANISTER_ID_SNAKE_GAME_BACKEND;

let authClient;
let backendActor;
let userPrincipal;
let username = "";

// Inicializa la autenticación con Internet Identity
export async function initAuth() {
  authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    showAuthMessage();
  }
}

// Muestra un mensaje para usuarios no autenticados
function showAuthMessage() {
  document.getElementById("authMessage").style.display = "block";
  document.getElementById("usernameInput").disabled = true;
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

  // Mostrar el ID de Internet Identity del usuario
  const userIdDisplay = document.getElementById("userIdDisplay");
  userIdDisplay.innerText = `Tu ID de Internet Identity es: ${userPrincipal}`;

  // Obtener o asignar un nombre al usuario en el backend
  username = await backendActor.getOrSetUsername(userPrincipal, "Jugador_" + userPrincipal.toText().slice(-4));

  const usernameInput = document.getElementById("usernameInput");

  // Si ya tiene nombre asignado, lo carga y lo bloquea
  if (username) {
    usernameInput.value = username;
    usernameInput.disabled = true; // Bloquea el campo después de establecer el nombre
  } else {
    usernameInput.disabled = false;
    usernameInput.addEventListener("change", (event) => {
      username = event.target.value.slice(0, 5);
      event.target.value = username;
      event.target.disabled = true;
      localStorage.setItem("username", username); // Guarda el nombre en el localStorage
    });
  }

  fetchHighScores();
}


// Guarda el puntaje en el backend automáticamente al perder
export async function saveScore(score) {
  if (!backendActor || username === "") return;
  try {
    await backendActor.saveScore(userPrincipal, BigInt(score), username);
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
          listItem.className = "list-group-item bg-dark text-light";
          listItem.textContent = `Usuario: ${record.username}, Puntuación: ${record.score}`;
          highScoresList.appendChild(listItem);
      });
  } catch (error) {
      console.error("Error al obtener high scores:", error);
  }
}


// Inicializa la autenticación al cargar
window.onload = initAuth;
document.getElementById("loginBtn").addEventListener("click", login);
