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

// Revisar localStorage
if(localStorage.getItem("jugadores")){
  let guardados = JSON.parse(localStorage.getItem("jugadores"));

  // Verificar si los nombres cambiaron
  let mismosNombres = guardados.length === jugadoresDefault.length &&
    guardados.every((j, i) => j.nombre === jugadoresDefault[i].nombre);

  if(mismosNombres){
    jugadores = guardados; // usar datos guardados
  } else {
    jugadores = [...jugadoresDefault]; // sobrescribir si los nombres cambiaron
    guardarDatos();
  }
} else {
  jugadores = [...jugadoresDefault]; // primera vez
  guardarDatos();
}

let isAdmin = false;

renderRanking();
  
  
  
  // Recuperar datos
  if(localStorage.getItem("jugadores")){
    jugadores = JSON.parse(localStorage.getItem("jugadores"));
  }
  renderRanking();
  
  // Mostrar login modal
  function mostrarLogin(){
    document.getElementById("login-container").classList.remove("hidden");
  }
  
  // Cerrar login
  function cerrarLogin(){
    document.getElementById("login-container").classList.add("hidden");
  }
  
  // Login
  function login(){
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const error = document.getElementById("login-error");
  
    if(user === "admin" && pass === "1234"){
      isAdmin = true;
      cerrarLogin();
      document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
      renderRanking();
    } else {
      error.textContent = "Usuario o clave incorrectos";
    }
  }
  
  // Render ranking
  function renderRanking(){
    jugadores.sort((a,b) => b.puntos - a.puntos);
    let body = document.getElementById("ranking-body");
    body.innerHTML = "";
  
    jugadores.forEach((j, index) => {
      let card = document.createElement("div");
      card.classList.add("ranking-card");
  
      card.innerHTML = `
        <span>${index+1}</span>
        <span>${j.nombre}</span>
        <span>${j.puntos}</span>
        <span class="admin-only ${isAdmin ? "" : "hidden"}">
          <button onclick="sumarPuntos(${index})">+3</button>
        </span>
      `;
  
      body.appendChild(card);
    });
  }
  
  // Sumar puntos
  function sumarPuntos(i){
    jugadores[i].puntos += 3;
    guardarDatos();
    renderRanking();
  }
  
  // Guardar en localStorage
  function guardarDatos(){
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
  }
  
  // Reiniciar mes
  function reiniciarMes(){
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.push({ fecha: new Date().toLocaleDateString(), datos: jugadores });
    localStorage.setItem("historial", JSON.stringify(historial));
  
    jugadores.forEach(j => j.puntos = 0);
    guardarDatos();
    renderRanking();
  }
  