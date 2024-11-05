window.onload = ListadoProductos();

let currentPageProductos = 1;
const itemsPerPageProductos = 7;
let totalPagesProductos = 1;

function ListadoProductos(pagina = 1) {
    $.ajax({
        url: '../../Productos/ListadoProductos',
        type: 'POST',
        dataType: 'json',
        success: function (MostarProductos) {
            $("#ModalProductos").modal("hide");
            LimpiarModal();

            // Calcular el total de páginas
            totalPagesProductos = Math.ceil(MostarProductos.length / itemsPerPageProductos);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPageProductos;
            const endIndex = startIndex + itemsPerPageProductos;
            const datosPagina = MostarProductos.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            $.each(datosPagina, function (index, producto) {  
                
                // Formatear el precio como moneda
                let precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.precio);
            
                let botonOcultar = 
                    '<button type="button" class="btn btn-primary boton-color" onclick="OcultarActivarProducto(' + producto.productoID + ',1)"><i class="fa-solid fa-eye-slash"></i></button>';
            
                if (producto.estado) {
                    botonOcultar = '<button type="button" class="btn btn-primary boton-color" onclick="OcultarActivarProducto(' + producto.productoID + ',0)" ><i class="fa-solid fa-eye-slash"></i></button>';
                }
            
                // Usar la clase 'estado-inactivo' solo si el producto está inactivo (estado === 0)
                let claseEstado = producto.estado == 0 ? 'estado-inactivo' : '';
            
                contenidoTabla += `
                <tr class="${claseEstado}">
                    <td>${producto.nombre}</td>
                    <td class="ocultar-en-768px text-end">${precioFormateado}</td>
                    <td class="text-center">${producto.cantidad}</td>
                    <td class="text-center ocultar-en-768px">${producto.descripcion}</td>
                    <td class="text-center ocultar-en-768px">${producto.nombreTipoProducto}</td>
                    <td class="text-center ">
                        <input type="checkbox" class="form-check-input" ${producto.estado ? 'checked' : ''} disabled />
                    </td>
                    <td class="text-center">` +
                    botonOcultar +
                    `</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${producto.productoID})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger" onclick="EliminarProducto(${producto.productoID})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td> 
                </tr>
                `;
            });

            document.getElementById("tbody-Productos").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacionProductos(totalPagesProductos, pagina);
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los productos');
        }
    });
}

function generarPaginacionProductos(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoProductos(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoProductos(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoProductos(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
}

function LimpiarModal(){
    document.getElementById("ProductoID").value = 0;
    document.getElementById("ProductoNombre").value = "";
    document.getElementById("ProductoPrecio").value = "";
    document.getElementById("ProductoCantidad").value = "";
    document.getElementById("ProductoDescripcion").value = "";
    document.getElementById("TipoProductoID").value = 0;
    document.getElementById("errorMensajeNombre").style.display = "none";
    document.getElementById("errorMensajePrecio").style.display = "none";
    document.getElementById("errorMensajeCantidad").style.display = "none";
    document.getElementById("errorMensajeDescripcion").style.display = "none";
    document.getElementById("errorMensajeTipoProducto").style.display = "none";
}

function NuevoProducto(){
    $("#ModalTitulo").text("Nuevo Producto");
}
function GuardarRegistro() {
    let productoID = document.getElementById("ProductoID").value;
    let nombre = document.getElementById("ProductoNombre").value.trim();
    let precio = document.getElementById("ProductoPrecio").value;
    let cantidad = document.getElementById("ProductoCantidad").value;
    let descripcion = document.getElementById("ProductoDescripcion").value; 
    let estado = document.getElementById("ProductoEstado").value; 
    let tipoProductoID = document.getElementById("TipoProductoID").value;

    let isValid = true;

    if (nombre === "") {
        document.getElementById("errorMensajeNombre").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeNombre").style.display = "none";
    }
    if (precio === "") {
        document.getElementById("errorMensajePrecio").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajePrecio").style.display = "none";
    }
    if (cantidad === "") {
        document.getElementById("errorMensajeCantidad").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeCantidad").style.display = "none";
    }
    if (descripcion === "") {
        document.getElementById("errorMensajeDescripcion").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeDescripcion").style.display = "none";
    }
    if (tipoProductoID === "0") {
        document.getElementById("errorMensajeTipoProducto").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeTipoProducto").style.display = "none";
    }

    if (!isValid) {
        return;
    }
    
    $.ajax({
        url: '../../Productos/GuardarRegistro',
        data: { 
            ProductoID: productoID,
            Nombre: nombre,
            Precio: precio,
            Cantidad: cantidad,
            Descripcion: descripcion,
            Estado: estado,
            TipoProductoID: tipoProductoID
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
                ListadoProductos(); 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message, // Mensaje de error devuelto por el servidor
                });
            }
        },
        error: function (xhr, status, error) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}



function AbrirEditar(ProductoID){
    
    $.ajax({
        url: '../../Productos/TraerProducto',
        data: { 
            productoID: ProductoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (productoConId) { 
            let producto = productoConId[0];

            document.getElementById("ProductoID").value = ProductoID;
            document.getElementById("ProductoNombre").value = producto.nombre,
            document.getElementById("ProductoPrecio").value = producto.precio,
            document.getElementById("ProductoCantidad").value = producto.cantidad,
            document.getElementById("ProductoDescripcion").value = producto.descripcion,
            document.getElementById("ProductoEstado").value = producto.estado,
            document.getElementById("TipoProductoID").value = producto.tipoProductoID

            $("#ModalProductos").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarProducto(ProductoID) {
    Swal.fire({
        title: "¿Esta seguro que quiere eliminar el producto?",
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
                url: '../../Productos/EliminarProducto',
                data: {
                    productoID: ProductoID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El producto se elimino correctamente",
                        icon: "success",
                        confirmButtonColor: "#3085d6"
                    });
                    ListadoProductos();
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}

function OcultarActivarProducto(ProductoID, accion) {
    $.ajax({
        type: "POST",
        url: '../../Productos/OcultarActivarProducto',
        data: { ProductoID: ProductoID, Accion: accion },
        success: function (producto) {
            ListadoProductos();
        },
        error: function (data) {
        }
    });
}