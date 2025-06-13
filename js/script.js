let taskCount = 0;
let terminadas = 0;
let enProceso = 0;
let pendientes = 0;

function agregarTarea() {
  const input = document.getElementById("nuevaTarea");
  const prioridad = document.getElementById("prioridadTarea").value;
  const nuevaTareaTexto = input.value.trim();

  if (nuevaTareaTexto === "") {
    input.classList.add("ring-2", "ring-red-400");
    setTimeout(() => input.classList.remove("ring-2", "ring-red-400"), 1000);
    return;
  }

  const emptyState = document.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
    document.getElementById("taskCounter").classList.remove("hidden");
    document.getElementById("estadoTareas").classList.remove("hidden");
  }

  const nuevaTarea = document.createElement("li");
  nuevaTarea.className =
    "group bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 animate-slide-in flex items-center justify-between";
  nuevaTarea.setAttribute("draggable", "true");

  nuevaTarea.addEventListener("dragstart", () =>
    nuevaTarea.classList.add("dragging")
  );
  nuevaTarea.addEventListener("dragend", () =>
    nuevaTarea.classList.remove("dragging")
  );

  const textoTarea = document.createElement("span");
  textoTarea.className = "text-white flex-1 pr-4 transition-all duration-300";
  textoTarea.textContent = nuevaTareaTexto;

  const etiquetaPrioridad = document.createElement("span");
  etiquetaPrioridad.className =
    "ml-2 px-2 py-0.5 text-xs rounded-full font-semibold";

  if (prioridad === "alta") {
    etiquetaPrioridad.textContent = "🔥 Alta";
    etiquetaPrioridad.classList.add("bg-red-500/30", "text-red-200");
  } else if (prioridad === "baja") {
    etiquetaPrioridad.textContent = "🧊 Baja";
    etiquetaPrioridad.classList.add("bg-blue-500/30", "text-blue-200");
  } else {
    etiquetaPrioridad.textContent = "📌 Normal";
    etiquetaPrioridad.classList.add("bg-white/20", "text-white/70");
  }

  textoTarea.appendChild(etiquetaPrioridad);

  const accionesTarea = document.createElement("div");
  accionesTarea.className =
    "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200";

  const botonCompletar = document.createElement("button");
  botonCompletar.className =
    "px-3 py-1 bg-green-500/20 hover:bg-green-500/40 text-green-300 text-sm rounded-lg border border-green-400/30 hover:border-green-400/50 transition-all duration-200 hover:scale-105 active:scale-95";
  botonCompletar.textContent = "✓";
  botonCompletar.title = "Completar tarea";
  botonCompletar.onclick = () => {
    const isCompleted = textoTarea.classList.contains("line-through");
    if (isCompleted) {
      textoTarea.classList.remove(
        "line-through",
        "opacity-60",
        "text-white/50"
      );
      textoTarea.classList.add("text-white");
      botonCompletar.textContent = "✓";
      botonCompletar.title = "Completar tarea";
      enProceso++;
      terminadas--;
    } else {
      textoTarea.classList.add("line-through", "opacity-60", "text-white/50");
      textoTarea.classList.remove("text-white");
      botonCompletar.textContent = "↶";
      botonCompletar.title = "Desmarcar tarea";
      enProceso--;
      terminadas++;
    }
    actualizarEstado();
  };

  const botonEliminar = document.createElement("button");
  botonEliminar.className =
    "px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 text-sm rounded-lg border border-red-400/30 hover:border-red-400/50 transition-all duration-200 hover:scale-105 active:scale-95";
  botonEliminar.textContent = "✕";
  botonEliminar.title = "Eliminar tarea";
  botonEliminar.onclick = () => {
    nuevaTarea.classList.add("task-removing");
    if (!textoTarea.classList.contains("line-through")) enProceso--;
    else terminadas--;
    taskCount--;
    setTimeout(() => {
      nuevaTarea.remove();
      actualizarContador();
      actualizarEstado();
      verificarEstadoVacio();
    }, 300);
  };

  accionesTarea.appendChild(botonCompletar);
  accionesTarea.appendChild(botonEliminar);
  nuevaTarea.appendChild(textoTarea);
  nuevaTarea.appendChild(accionesTarea);

  document.getElementById("listaTareas").appendChild(nuevaTarea);
  input.value = "";
  taskCount++;
  enProceso++;
  actualizarContador();
  actualizarEstado();
}

function actualizarContador() {
  const contador = document.getElementById("taskCount");
  contador.textContent = taskCount;
  contador.parentElement.classList.add("scale-110");
  setTimeout(() => {
    contador.parentElement.classList.remove("scale-110");
  }, 200);
}

function actualizarEstado() {
  pendientes = taskCount - terminadas - enProceso;
  document.getElementById("terminadas").textContent = terminadas;
  document.getElementById("enProceso").textContent = enProceso;
  document.getElementById("pendientes").textContent = pendientes;
}

function verificarEstadoVacio() {
  const lista = document.getElementById("listaTareas");
  if (lista.children.length === 0) {
    const estadoVacio = document.createElement("div");
    estadoVacio.className =
      "empty-state text-center py-12 text-white/60 animate-fade-in";
    estadoVacio.innerHTML = `
          <div class="text-6xl mb-4">📝</div>
          <p class="text-lg font-light">No hay tareas aún</p>
          <p class="text-sm">¡Agrega una para comenzar!</p>
        `;
    lista.appendChild(estadoVacio);
    document.getElementById("taskCounter").classList.add("hidden");
    document.getElementById("estadoTareas").classList.add("hidden");
    taskCount = 0;
    terminadas = 0;
    enProceso = 0;
    pendientes = 0;
    actualizarEstado();
  }
}

document
  .getElementById("nuevaTarea")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") agregarTarea();
  });

const listaTareas = document.getElementById("listaTareas");
listaTareas.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(listaTareas, e.clientY);
  if (afterElement == null) {
    listaTareas.appendChild(dragging);
  } else {
    listaTareas.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll("li:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
