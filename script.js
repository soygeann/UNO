// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBeMePGMGkhtlHmukEcEea59gF4_yFneXI",
  authDomain: "unno-e8408.firebaseapp.com",
  projectId: "unno-e8408",
  storageBucket: "unno-e8408.firebasestorage.app",
  messagingSenderId: "184959352885",
  appId: "1:184959352885:web:5e1ce12b1918e231db317c",
  measurementId: "G-8KPW9NMMTR"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos iniciales
const jugadoresDefault = [
  { nombre: "Jean", puntos: 0 },
  { nombre: "Josué", puntos: 0 },
  { nombre: "Ana", puntos: 0 },
  { nombre: "Adri", puntos: 0 },
  { nombre: "Enne", puntos: 0 },
  { nombre: "Álvaro", puntos: 0 },
  { nombre: "Henry", puntos: 0 }
];

let jugadores = [];
let isAdmin = false;

// ==========================
// 🔹 Cargar datos en vivo
// ==========================
onSnapshot(doc(db, "ranking", "jugadores"), (docSnap) => {
  if (docSnap.exists()) {
    jugadores = docSnap.data().lista;
    console.log("🔥 Jugadores cargados:", jugadores);
    renderRanking();
  } else {
    console.warn("No existe el doc jugadores, creando por defecto...");
    guardarDatos(jugadoresDefault);
  }
});

// ==========================
// 🔹 Guardar en Firestore
// ==========================
async function guardarDatos(lista) {
  await setDoc(doc(db, "ranking", "jugadores"), { lista });
}

// 🔹 Sumar puntos
async function sumarPuntos(i) {
  if (!isAdmin) return;
  jugadores[i].puntos += 0;
  await guardarDatos(jugadores);
}

// 🔹 Restar puntos (NUEVA FUNCIÓN)
async function restarPuntos(i) {
  if (!isAdmin) return;
  
  const jugadorNombre = jugadores[i].nombre;
  jugadores[i].puntos -= 3;
  
  // Asegurar que no queden puntos negativos
  if (jugadores[i].puntos < 0) {
    jugadores[i].puntos = 0;
  }
  
  await guardarDatos(jugadores);
}


// 🔹 Reiniciar mes
async function reiniciarMes() {
  if (!isAdmin) return;
  let confirmar = confirm("¿Seguro que quieres reiniciar el mes?");
  if (confirmar) {
    jugadores.forEach(j => j.puntos = 0);
    await guardarDatos(jugadores);
  }
}

// 🔹 Login
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (user === "admin" && pass === "2775") {
    isAdmin = true;
    cerrarLogin();
    document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
    renderRanking();
  } else {
    error.textContent = "Usuario o clave incorrectos";
  }
}

// 🔹 Render ranking (VERSIÓN ALTERNATIVA)
function renderRanking() {
  if (!jugadores || jugadores.length === 0) {
    console.warn("⚠️ No hay jugadores para mostrar todavía");
    return;
  }

  jugadores.sort((a, b) => b.puntos - a.puntos);
  let body = document.getElementById("ranking-body");
  body.innerHTML = "";

  jugadores.forEach((j, index) => {
    let card = document.createElement("div");
    card.classList.add("ranking-card");

    let botonesHTML = '';
    if (isAdmin) {
      botonesHTML = `
        <span class="admin-only">
          <button onclick="sumarPuntos(${index})" class="btn-sumar">+3</button>
          <button onclick="restarPuntos(${index})" class="btn-restar">-3</button>
        </span>
      `;
    }

    card.innerHTML = `
      <span>${index + 1}</span>
      <span>${j.nombre}</span>
      <span>${j.puntos}</span>
      ${botonesHTML}
    `;

    body.appendChild(card);
  });
}

// 🔹 Modal
function mostrarLogin() {
  document.getElementById("login-container").classList.remove("hidden");
}
function cerrarLogin() {
  document.getElementById("login-container").classList.add("hidden");
}

// 🔹 Exponer funciones al DOM (ACTUALIZADO)
window.sumarPuntos = sumarPuntos;
window.restarPuntos = restarPuntos; // ← NUEVA
window.reiniciarMes = reiniciarMes;
window.login = login;
window.mostrarLogin = mostrarLogin;
window.cerrarLogin = cerrarLogin;
