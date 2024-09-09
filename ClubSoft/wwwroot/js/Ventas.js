function NuevaVenta(){
    $("#ModalTitulo").text("Nueva Venta");
}

//FUNCION DEL COMBO PRODUCTOS
$(document).ready(function () {
    $('#TipoProductoID').change(function () {
        var tipoProductoID = $(this).val();
        // Limpiar el Combo
        $("#ProductoID").empty(); 

        $.ajax({
            url: '/Ventas/ComboProducto', 
            data: { TipoProductoID: tipoProductoID },
            type: 'POST',
            dataType: 'json',
            success: function (productos) {
                if (tipoProductoID == 0) {
                    $("#ProductoID").append('<option value="0">[SELECCIONE UN TIPO DE PRODUCTO]</option>');
                } else {
                    if (productos.length == 0) {
                        $("#ProductoID").append('<option value="0">[NO EXISTEN PRODUCTOS]</option>');
                    } else {
                        $.each(productos, function (i, producto) {
                            $("#ProductoID").append('<option value="' + producto.value + '">' + producto.text + '</option>');
                        });
                    }
                }
            },
            error: function () {
                alert('Ocurrió un error al cargar los productos.');
            }
        });
    });
});

function AgregarProducto() {
    let productoID = document.getElementById("ProductoID").value;
    let productoNombre = document.getElementById("ProductoID").options[document.getElementById("ProductoID").selectedIndex].text;
    let cantidad = parseInt(document.getElementById("Cantidad").value);
    let cliente = document.getElementById("Cliente").value;

    // Verificar que los campos necesarios estén llenos
    if (productoID == "0" || cantidad <= 0 || cliente.trim() === "") {
        Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Por favor, complete todos los campos.",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    // Solicitar el precio del producto al servidor
    fetch(`/Ventas/PrecioProducto?productoID=${productoID}`)
        .then(response => response.json())
        .then(precioProducto => {
            if (precioProducto !== null) {
                let totalProducto = precioProducto * cantidad;

                // Agregar una nueva fila a la tabla
                let tablaDetalle = document.getElementById("Tabla-Detalle");
                let nuevaFila = tablaDetalle.insertRow();

                let celdaProducto = nuevaFila.insertCell(0);
                celdaProducto.innerHTML = productoNombre;

                let celdaPrecio = nuevaFila.insertCell(1);
                celdaPrecio.innerHTML = `$${precioProducto.toFixed(2)}`;

                let celdaCantidad = nuevaFila.insertCell(2);
                celdaCantidad.innerHTML = cantidad;

                let celdaTotal = nuevaFila.insertCell(3);
                celdaTotal.innerHTML = `$${totalProducto.toFixed(2)}`;

                let celdaEliminar = nuevaFila.insertCell(4);
                celdaEliminar.innerHTML = `<button type="button" class="btn btn-danger btn-sm" onclick="eliminarFila(this)">Eliminar</button>`;

                // Actualizar el total general
                let totalActual = parseFloat(document.getElementById("total-price").innerText.replace("$", ""));
                let nuevoTotal = totalActual + totalProducto;
                document.getElementById("total-price").innerText = `$${nuevoTotal.toFixed(2)}`;

                // Limpiar los campos del formulario
                document.getElementById("ProductoID").selectedIndex = 0;
                document.getElementById("Cantidad").value = "";
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "No se pudo obtener el precio del producto.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener el precio del producto:', error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Hubo un problema al obtener el precio del producto.",
                showConfirmButton: false,
                timer: 1500
            });
        });
        
}

// Función para eliminar una fila
function eliminarFila(button) {
    let fila = button.parentNode.parentNode;
    let totalProducto = parseFloat(fila.cells[3].innerText.replace("$", ""));
    let totalActual = parseFloat(document.getElementById("total-price").innerText.replace("$", ""));
    let nuevoTotal = totalActual - totalProducto;

    // Actualizar el total general
    document.getElementById("total-price").innerText = `$${nuevoTotal.toFixed(2)}`;

    // Eliminar la fila
    fila.remove();
    
}


