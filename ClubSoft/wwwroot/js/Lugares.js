window.onload = ListadoLugaresEventos();


let itemsPerPageLugares = 6;  // Número de lugares por página
let totalPagesLugares = 0;  // Total de páginas (se calculará dinámicamente)

function ListadoLugaresEventos(pagina = 1) {
    $.ajax({
        url: '../../TipoEventos/ListadoLugaresEventos',
        type: 'POST',
        dataType: 'json',
        success: function (traerLugaresEventos) {
            LimpiarInputLugares();

            // Calcular el total de páginas
            totalPagesLugares = Math.ceil(traerLugaresEventos.length / itemsPerPageLugares);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPageLugares;
            const endIndex = startIndex + itemsPerPageLugares;
            const datosPagina = traerLugaresEventos.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            // Recorrer los lugares de la página actual
            $.each(datosPagina, function (index, lugarEvento) {
                contenidoTabla += `
                <tr>
                    <td>${lugarEvento.nombre}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditarLugar(${lugarEvento.lugarID})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger" onclick="EliminarLugarEvento(${lugarEvento.lugarID})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });

            document.getElementById("tbody-Lugares").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacionLugares(totalPagesLugares, pagina);
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los lugares');
        }
    });
}

function generarPaginacionLugares(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoLugaresEventos(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoLugaresEventos(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoLugaresEventos(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion-lugares").innerHTML = paginacion;
}

function LimpiarInputLugares() {
    document.getElementById("LugarID").value = 0;
    document.getElementById("LugarNombre").value = "";
}

function GuardarRegistroLugar() {
    const lugarID = document.getElementById("LugarID").value;
    const nombre = document.getElementById("LugarNombre").value.trim();
    const errorMensajeLugar = document.getElementById("errorMensajeLugar");

    if (nombre === "") {
        errorMensajeLugar.style.display = "block";
        return;
    } else {
        errorMensajeLugar.style.display = "none";
    }

    $.ajax({
        url: '../../TipoEventos/GuardarLugarEvento',
        data: { lugarID, nombre },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado.success) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Registro guardado correctamente!",
                    showConfirmButton: false,
                    timer: 1000
                });
                ListadoLugaresEventos();
            } else {
                // Mostrar alerta si el lugar ya existe
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultado.message, // Mensaje de error devuelto por el servidor
                });
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}



function AbrirEditarLugar(lugarID){
    
    $.ajax({
        url: '../../TipoEventos/TraerLugarEvento',
        data: { 
            lugarID: lugarID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (tipoLugarPorID) { 
            let lugar = tipoLugarPorID[0];

            document.getElementById("LugarID").value = lugarID;
            document.getElementById("LugarNombre").value = lugar.nombre
            
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}


function EliminarLugarEvento(lugarID){
                
    $.ajax({
        url: '../../TipoEventos/EliminarLugarEvento',
        data: {
            lugarID: lugarID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoLugaresEventos();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}