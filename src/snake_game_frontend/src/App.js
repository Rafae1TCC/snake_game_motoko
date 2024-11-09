import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as snake_game_backend_idl } from "../../declarations/snake_game_backend";

const internetIdentityCanisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai"; // Cambia esto al ID correcto
const backendCanisterId = "bd3sg-teaaa-aaaaa-qaaba-cai"; // Cambia esto al ID de tu backend

let authClient;
let backendActor;
let userPrincipal;

async function initializeAuth() {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
    } else {
        document.getElementById("loginBtn").addEventListener("click", async () => {
            await authClient.login({
                identityProvider: `http://${internetIdentityCanisterId}.localhost:4943`,
                onSuccess: () => handleAuthenticated(authClient)
            });
        });
    }
}

async function handleAuthenticated(authClient) {
    const identity = authClient.getIdentity();
    userPrincipal = identity.getPrincipal();
    
    const agent = new HttpAgent({ identity });
    backendActor = Actor.createActor(snake_game_backend_idl, {
        agent,
        canisterId: backendCanisterId,
    });

    document.getElementById("saveScoreBtn").disabled = false;
    alert("Inicio de sesión exitoso, bienvenido " + userPrincipal.toText());
}

async function saveScore() {
    if (!backendActor) {
        alert("Inicia sesión primero.");
        return;
    }
    try {
        const score = BigInt(document.getElementById("score").innerText);
        const result = await backendActor.saveScore(userPrincipal, score);
        if (result) {
            alert("Puntuación guardada exitosamente.");
            fetchHighScores();
        } else {
            alert("No fue posible guardar la puntuación.");
        }
    } catch (error) {
        console.error("Error al guardar la puntuación:", error);
    }
}

async function fetchHighScores() {
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

initializeAuth();
