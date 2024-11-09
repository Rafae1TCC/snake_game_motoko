// Selección de elementos del DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoresList = document.getElementById('highScoresList');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const loginBtn = document.getElementById('loginBtn');

// Variables del juego
let score = 0;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
let backend, userPrincipal;

// ID del canister de Internet Identity y del backend
const internetIdentityCanisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai";  // Usar el ID local de II en desarrollo
const backendCanisterId = "bd3sg-teaaa-aaaaa-qaaba-cai";  // ID del canister de Motoko

// Función para autenticar al usuario
async function login() {
    try {
        // Autenticación con Internet Identity
        const authClient = await window.ic.authClient.create();
        await authClient.login({
            identityProvider: `http://${internetIdentityCanisterId}.localhost:4943`,  // URL completa de II en desarrollo
            onSuccess: async () => {
                userPrincipal = authClient.getIdentity().getPrincipal();
                backend = await importCanister();

                // Habilitar el botón de guardar puntuación
                saveScoreBtn.disabled = false;
                alert("Inicio de sesión exitoso, bienvenido " + userPrincipal.toText());
            }
        });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
    }
}

// Función para importar el canister del backend
async function importCanister() {
    return await window.ic.canisters[backendCanisterId];
}

// Función para guardar la puntuación en el backend
async function saveScore() {
    if (!backend) {
        alert("Inicia sesión primero.");
        return;
    }
    try {
        const result = await backend.saveScore(userPrincipal, BigInt(score));
        if (result) {
            alert("Puntuación guardada exitosamente.");
            fetchHighScores(); // Actualizar la lista de high scores
        } else {
            alert("No fue posible guardar la puntuación.");
        }
    } catch (error) {
        console.error("Error al guardar la puntuación:", error);
    }
}

// Función para obtener y mostrar los high scores
async function fetchHighScores() {
    try {
        const highScores = await backend.getHighScores();
        highScoresList.innerHTML = ""; // Limpiar la lista actual
        highScores.forEach(record => {
            const listItem = document.createElement("li");
            listItem.textContent = `Usuario: ${record.userId.toText()}, Puntuación: ${record.score}`;
            highScoresList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error al obtener high scores:", error);
    }
}

// Configuración del juego Snake (sin cambios en la lógica principal del juego)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.innerText = score;
        food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } else {
        snake.pop();
    }
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreDisplay.innerText = score;
}

// Control de dirección
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp': direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': direction = { x: 1, y: 0 }; break;
    }
});

// Eventos para los botones de inicio de sesión y guardar puntuación
loginBtn.addEventListener("click", login);
saveScoreBtn.addEventListener("click", saveScore);

// Ejecutar el juego
setInterval(() => {
    update();
    draw();
}, 100);
