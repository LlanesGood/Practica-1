document.getElementById('formularioTareas').addEventListener('submit', agregarTarea);
document.getElementById('terminoBusqueda').addEventListener('input', buscarTareas);

function agregarTarea(evento) {
    evento.preventDefault();
    
    const nombreTarea = document.getElementById('NombreTarea').value;
    const fechaInicio = document.getElementById('FechaAsignacion').value;
    const fechaFin = document.getElementById('FechaEntrega').value;
    const responsable = document.getElementById('Responsable').value;

    const mensajeError = validarFechas(fechaInicio, fechaFin);
    if (mensajeError) {
        document.getElementById('mensaje-error').textContent = mensajeError;
        return;
    }

    const tarea = {
        nombreTarea,
        fechaInicio,
        fechaFin,
        responsable,
        completada: false
    };

    let tareas = JSON.parse(localStorage.getItem('tareas'));
    if (!Array.isArray(tareas)) {
        tareas = [];
    }

    tareas.push(tarea);
    localStorage.setItem('tareas', JSON.stringify(tareas));

    document.getElementById('formularioTareas').reset();
    document.getElementById('mensaje-error').textContent = '';
    mostrarTareas();
}

function validarFechas(fechaInicio, fechaFin) {
    if (new Date(fechaFin) < new Date(fechaInicio)) {
        return 'La fecha de entrega no puede ser antes de la fecha de asignación.';
    }
    return '';
}

function mostrarTareas() {
    const listaTareas = document.getElementById('listaTareas');
    listaTareas.innerHTML = '';

    let tareas = JSON.parse(localStorage.getItem('tareas'));
    if (!Array.isArray(tareas)) {
        tareas = [];
    }

    const terminoBusqueda = document.getElementById('terminoBusqueda').value.toLowerCase();

    tareas = tareas.filter(tarea => {
        return tarea.nombreTarea.toLowerCase().includes(terminoBusqueda) || tarea.responsable.toLowerCase().includes(terminoBusqueda);
    });

    tareas.forEach((tarea, indice) => {
        const elementoTarea = document.createElement('li');
        elementoTarea.classList.add('list-group-item');

        const fechaActual = new Date().toISOString().split('T')[0];

        if (tarea.completada) {
            elementoTarea.classList.add('tarea-completada');
        } else if (fechaActual > tarea.fechaFin) {
            elementoTarea.classList.add('tarea-expirada');
        } else {
            elementoTarea.classList.add('tarea-pendiente');
        }

        elementoTarea.innerHTML = `
            <span>Tarea: ${tarea.nombreTarea} - Asignado el: ${tarea.fechaInicio} - Hasta el: ${tarea.fechaFin} - Responsable: ${tarea.responsable}</span>
            ${tarea.completada ? `<button class="btn btn-warning btn-sm float-right" onclick="desmarcarComoCompletada(${indice})">Desmarcar</button>` : ''}
            ${!tarea.completada && fechaActual <= tarea.fechaFin ? `<button class="btn btn-success btn-sm float-right ml-2" onclick="marcarComoCompletada(${indice})">Resolver</button>` : ''}
            <button class="btn btn-danger btn-sm float-right mr-2" onclick="eliminarTarea(${indice})">Eliminar</button>
        `;

        listaTareas.appendChild(elementoTarea);
    });
}

function marcarComoCompletada(indice) {
    let tareas = JSON.parse(localStorage.getItem('tareas'));
    if (!Array.isArray(tareas)) {
        tareas = [];
    }

    if (new Date(tareas[indice].fechaFin) >= new Date()) {
        tareas[indice].completada = true;
        localStorage.setItem('tareas', JSON.stringify(tareas));
        mostrarTareas();
    } else {
        alert('No se puede marcar como completada. La fecha de entrega ha expirado.');
    }
}

function desmarcarComoCompletada(indice) {
    let tareas = JSON.parse(localStorage.getItem('tareas'));
    if (!Array.isArray(tareas)) {
        tareas = [];
    }

    tareas[indice].completada = false;
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
}

function eliminarTarea(indice) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        let tareas = JSON.parse(localStorage.getItem('tareas'));
        if (!Array.isArray(tareas)) {
            tareas = [];
        }

        tareas.splice(indice, 1);
        localStorage.setItem('tareas', JSON.stringify(tareas));
        mostrarTareas();
    }
}

function buscarTareas() {
    mostrarTareas();
}

document.addEventListener('DOMContentLoaded', mostrarTareas);

