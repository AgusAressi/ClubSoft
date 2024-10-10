window.onload = ListadoProductos();

function ListadoProductos(){
    $.ajax({
        url: '../../Productos/ListadoProductos',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (MostarProductos) {
            $("#ModalProductos").modal("hide");
            LimpiarModal();

            let contenidoTabla = ``;

            $.each(MostarProductos, function (index, producto) {  
                
                // Formatear el precio como moneda
                let precioFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(producto.precio);

                let botonOcultar = 
                    '<button type="button" class="btn btn-primary boton-color" onclick="OcultarActivarProducto(' + producto.productoID + ',1)"><i class="fa-solid fa-eye-slash"></i></button>';

                if (producto.estado) {
                    botonOcultar = '<button type="button" class="btn btn-primary boton-color" onclick="OcultarActivarProducto(' + producto.productoID + ',0)" ><i class="fa-solid fa-eye-slash"></i></button>';
                }

                contenidoTabla += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td class="ocultar-en-768px">${precioFormateado}</td>
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

        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
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
    let nombre = document.getElementById("ProductoNombre").value;
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
            Descripcion:descripcion,
            Estado: estado,
            TipoProductoID: tipoProductoID
        },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            console.log(resultado);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Registro guardado correctamente!",
                showConfirmButton: false,
                timer: 1000
            });
            ListadoProductos(); 
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