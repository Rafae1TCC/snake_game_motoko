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
  console.log("Autenticación exitosa");
  userPrincipal = client.getIdentity().getPrincipal();

  // Crear el actor del backend con el usuario autenticado
  backendActor = createActor(backendCanisterId, {
    agentOptions: { identity: client.getIdentity() },
  });

  document.getElementById("loginBtn").innerText = `Bienvenido ${userPrincipal.toText()}`;
  document.getElementById("authMessage").style.display = "none";
  document.getElementById("usernameInput").disabled = false;

  // Agrega un evento para ingresar el nombre solo una vez
  document.getElementById("usernameInput").addEventListener("change", (event) => {
    username = event.target.value.slice(0, 5); // Limita el nombre a 5 caracteres
    event.target.value = username;
    event.target.disabled = true; // Deshabilita el campo después de ingresar el nombre
  });

  // Cargar high scores al iniciar sesión
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
