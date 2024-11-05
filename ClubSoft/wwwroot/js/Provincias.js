window.onload = ListadoProvincias();

let currentPage = 1;
const itemsPerPage = 5;
let totalPages = 1;

function ListadoProvincias(pagina = 1) {
    $.ajax({
        url: '../../Provincias/ListadoProvincias',
        type: 'POST',
        dataType: 'json',
        success: function (traerTodasLasProvincias) {
            LimpiarInput();

            // Calcular el total de páginas
            totalPages = Math.ceil(traerTodasLasProvincias.length / itemsPerPage);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const datosPagina = traerTodasLasProvincias.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            // Recorrer las provincias de la página actual
            $.each(datosPagina, function (index, provincia) {
                contenidoTabla += `
                <tr>
                    <td>${provincia.nombre}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${provincia.provinciaID})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger boton-color2" onclick="EliminarProvnicia(${provincia.provinciaID})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });

            document.getElementById("tbody-Provincias").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacion(totalPages, pagina);
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar las provincias');
        }
    });
}

function generarPaginacion(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoProvincias(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoProvincias(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoProvincias(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
}


function GuardarRegistro() {
    let provinciaID = document.getElementById("ProvinciaID").value;
    let nombre = document.getElementById("ProvinciaNombre").value.trim(); // Elimina espacios en blanco
    let errorMensaje = document.getElementById("errorMensaje");

    // Validar si el campo está vacío
    if (nombre === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'El nombre de la provincia no puede estar vacío',
        });
        return;
    }

    $.ajax({
        url: '../../Provincias/GuardarProvincia',
        data: { 
            ProvinciaID: provinciaID,
            Nombre: nombre           
        },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: response.message,
                    showConfirmButton: false,
                    timer: 1000
                });
                ListadoProvincias();
            } else {
                // Mostrar mensaje con SweetAlert si la provincia ya existe
                Swal.fire({
                    icon: 'error',
                    title: 'Provincia existente',
                    text: response.message, // "LA PROVINCIA YA EXISTE"
                });
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}


function AbrirEditar(ProvinciaID){
    
    $.ajax({
        url: '../../Provincias/TraerProvincia',
        data: { 
            provinciaID: ProvinciaID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (provinciaPorID) { 
            let provincia = provinciaPorID[0];

            document.getElementById("ProvinciaID").value = ProvinciaID;
            document.getElementById("ProvinciaNombre").value = provincia.nombre
            
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarProvnicia(ProvinciaID) {
    Swal.fire({
        title: "¿Está seguro que quiere eliminar a la persona?",
        text: "¡No podrás recuperarla!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../../Provincias/EliminarProvincia',
                data: {
                    ProvinciaID: ProvinciaID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        // Si se eliminó correctamente, mostrar éxito
                        Swal.fire({
                            title: "Eliminado!",
                            text: "La provincia se eliminó correctamente",
                            icon: "success",
                            confirmButtonColor: "#3085d6"
                        });
                        ListadoProvincias();
                    } else {
                        // Si no se puede eliminar, mostrar el mensaje con la razón
                        Swal.fire({
                            title: "Ups!",
                            text: resultado.message, 
                            icon: "error",
                            confirmButtonColor: "#3085d6"
                        });
                    }
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}

function LimpiarInput() {
     document.getElementById("ProvinciaID").value = 0;
     document.getElementById("ProvinciaNombre").value = "";
}