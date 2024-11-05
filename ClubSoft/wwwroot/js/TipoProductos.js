window.onload = ListadoTipoProductos();

let itemsPerPageTipoProductos = 5;  // Número de productos por página
let totalPagesTipoProductos = 0;  // Total de páginas (se calculará dinámicamente)

function ListadoTipoProductos(pagina = 1) {
    $.ajax({
        url: '../../TipoProductos/ListadoTipoProductos',
        type: 'POST',
        dataType: 'json',
        success: function (traerTodosLosTiposDeProductos) {
            // Limpiar el input antes de mostrar nuevos datos
            LimpiarInput();

            // Calcular el total de páginas
            totalPagesTipoProductos = Math.ceil(traerTodosLosTiposDeProductos.length / itemsPerPageTipoProductos);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPageTipoProductos;
            const endIndex = startIndex + itemsPerPageTipoProductos;
            const datosPagina = traerTodosLosTiposDeProductos.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            // Recorrer los productos de la página actual
            $.each(datosPagina, function (index, tipoProducto) {
                contenidoTabla += `
                <tr>
                    <td>${tipoProducto.nombre}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${tipoProducto.tipoProductoID})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger" onclick="EliminarTipoProducto(${tipoProducto.tipoProductoID})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            });

            document.getElementById("tbody-TipoProductos").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacionTipoProductos(totalPagesTipoProductos, pagina);
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los tipos de productos');
        }
    });
}

function generarPaginacionTipoProductos(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoTipoProductos(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoTipoProductos(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoTipoProductos(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
}

function GuardarRegistro(){

    let tipoProductoID = document.getElementById("TipoProductoID").value;
    let nombre = document.getElementById("TipoProductoNombre").value;
    let errorMensaje = document.getElementById("errorMensaje");

    // Validar si el campo está vacío
    if(nombre === "") {
        errorMensaje.style.display = "block";
        return;
    } else {
        errorMensaje.style.display = "none";
    }
    
    $.ajax({
        url: '../../TipoProductos/GuardarTipoProducto',
        data: { 
            tipoProductoID: tipoProductoID,
            nombre: nombre           
            },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Registro guardado correctamente!",
                showConfirmButton: false,
                timer: 1000
            }); 
            ListadoTipoProductos();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}

function AbrirEditar(tipoProductoID){
    
    $.ajax({
        url: '../../TipoProductos/TraerTipoProducto',
        data: { 
            tipoProductoID: tipoProductoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (tipoProductoPorID) { 
            let tipoproducto = tipoProductoPorID[0];

            document.getElementById("TipoProductoID").value = tipoProductoID;
            document.getElementById("TipoProductoNombre").value = tipoproducto.nombre
            
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarTipoProducto(tipoProductoID) {
    Swal.fire({
        title: "¿Esta seguro que quiere eliminar el tipo de producto?",
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
                url: '../../TipoProductos/EliminarTipoProducto',
                data: {
                    tipoProductoID: tipoProductoID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El tipo de producto se elimino correctamente",
                        icon: "success",
                        confirmButtonColor: "#3085d6"
                    });
                    ListadoTipoProductos();
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}

function LimpiarInput() {
    document.getElementById("TipoProductoID").value = 0;
    document.getElementById("TipoProductoNombre").value = "";
}