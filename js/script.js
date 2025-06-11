function agregarTarea() {
    let nuevaTareaTexto = document.getElementById("nuevaTarea").value;
    if (nuevaTareaTexto === "") {
        alert("Por favor, Ingrese una tarea");
        return;
    }

    let nuevaTarea = document.createElement("li");
    nuevaTarea.textContent = nuevaTareaTexto + " ";
    nuevaTarea.setAttribute("draggable", "true");
    nuevaTarea.classList.add("tarea");

    // Evento de drag
    nuevaTarea.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", null); // Necesario para Firefox
        nuevaTarea.classList.add("dragging");
    });

    nuevaTarea.addEventListener("dragend", () => {
        nuevaTarea.classList.remove("dragging");
    });

    // Botón Eliminar
    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.onclick = function () {
        nuevaTarea.remove();
    };

    nuevaTarea.appendChild(botonEliminar);
    document.getElementById("listaTareas").appendChild(nuevaTarea);
    document.getElementById("nuevaTarea").value = "";
    
}
