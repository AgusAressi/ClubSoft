window.onload = ListadoTipoEventos();

let itemsPerPageTipoEventos = 6;  // Número de eventos por página
let totalPagesTipoEventos = 0; 

function ListadoTipoEventos(pagina = 1) {
    $.ajax({
        url: '../../TipoEventos/ListadoTipoEventos',
        type: 'POST',
        dataType: 'json',
        success: function (traerTodosLosTiposDeEventos) {
            // Limpiar el input antes de mostrar nuevos datos
            LimpiarInput();

            // Calcular el total de páginas
            totalPagesTipoEventos = Math.ceil(traerTodosLosTiposDeEventos.length / itemsPerPageTipoEventos);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPageTipoEventos;
            const endIndex = startIndex + itemsPerPageTipoEventos;
            const datosPagina = traerTodosLosTiposDeEventos.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            // Recorrer los eventos de la página actual
            $.each(datosPagina, function (index, tipoEvento) {
                contenidoTabla += `
                <tr>
                    <td>${tipoEvento.nombre}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${tipoEvento.tipoEventoID})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger" onclick="EliminarTipoEvento(${tipoEvento.tipoEventoID})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });

            document.getElementById("tbody-TipoEventos").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacionTipoEventos(totalPagesTipoEventos, pagina);
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los tipos de eventos');
        }
    });
}

function generarPaginacionTipoEventos(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoTipoEventos(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoTipoEventos(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoTipoEventos(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
}

function GuardarRegistro() {
    const tipoEventoID = document.getElementById("TipoEventoID").value;
    const nombre = document.getElementById("TipoEventoNombre").value.trim();
    const errorMensaje = document.getElementById("errorMensaje");

    // Validar si el campo está vacío
    if (nombre === "") {
        errorMensaje.style.display = "block";
        return;
    } else {
        errorMensaje.style.display = "none";
    }

    $.ajax({
        url: '../../TipoEventos/GuardarTipoEvento',
        data: { tipoEventoID, nombre },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado.success) {
                Swal.fire({
                    position: "center", // Cambiado a "center"
                    icon: "success",
                    title: "Registro guardado correctamente!",
                    showConfirmButton: false,
                    timer: 1000
                });

                
                ListadoTipoEventos();
            } else {
                // Mostrar alerta si el tipo de evento ya existe
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultado.message, // Mensaje de error devuelto por el servidor
                    position: "center" // Cambiado a "center"
                });
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}


function AbrirEditar(tipoEventoID){
    
    $.ajax({
        url: '../../TipoEventos/TraerTipoEvento',
        data: { 
            tipoEventoID: tipoEventoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (tipoEventoPorID) { 
            let tipoevento = tipoEventoPorID[0];

            document.getElementById("TipoEventoID").value = tipoEventoID;
            document.getElementById("TipoEventoNombre").value = tipoevento.nombre
            
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarTipoEvento(tipoEventoID) {
    Swal.fire({
        title: "¿Esta seguro que quiere eliminar el tipo de evento?",
        text: "No podrás recuperarlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../../TipoEventos/EliminarTipoEvento',
                data: {
                    tipoEventoID: tipoEventoID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El tipo de evento se elimino correctamente",
                        icon: "success",
                        confirmButtonColor: "#3085d6"
                    });
                    ListadoTipoEventos();
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}

function LimpiarInput() {
     document.getElementById("TipoEventoID").value = 0;
     document.getElementById("TipoEventoNombre").value = "";
}