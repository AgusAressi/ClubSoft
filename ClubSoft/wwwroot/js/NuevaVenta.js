$(document).ready(function () {
    // Cargar productos según el tipo de producto
    $('#TipoProductoID').change(function () {
        var tipoProductoID = $(this).val();
        $("#ProductoID").empty();

        $.ajax({
            url: '/Ventas/ComboProducto',
            data: { TipoProductoID: tipoProductoID },
            type: 'POST',
            dataType: 'json',
            success: function (productos) {
                if (productos.length === 0) {
                    $("#ProductoID").append('<option value="0">[NO EXISTEN PRODUCTOS]</option>');
                } else {
                    productos.forEach(function (producto) {
                        $("#ProductoID").append('<option value="' + producto.value + '">' + producto.text + '</option>');
                    });
                }
            },
            error: function () {
                alert('Ocurrió un error al cargar los productos.');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var fechaInput = document.getElementById('fecha');
    fechaInput.valueAsDate = new Date();
});


function AgregarProducto() {
    let productoID = $("#ProductoID").val();
    let cantidad = parseInt($("#Cantidad").val());
    let ventaID = $("#VentaID").val(); // Debe existir un ventaID antes de agregar productos.
    let personaID = $("#PersonaID").val(); // ID del cliente

    if (productoID == "0" || cantidad <= 0) {
        Swal.fire("Completa todos los campos.", "", "warning");
        return;
    }

    // Verificar si ya se ha creado la venta
    if (ventaID == "0" || ventaID == "") {
        // Crear la venta temporal si no existe
        $.ajax({
            url: '/Ventas/GuardarVentaTemporal',
            type: 'POST',
            data: {
                PersonaID: personaID, // Pasamos el cliente
                productos: [] // Inicialmente vacío
            },
            success: function (response) {
                if (response.success) {
                    // Asignar el nuevo ventaID generado
                    $("#VentaID").val(response.ventaID);
                    ventaID = response.ventaID;

                    // Llamar nuevamente a AgregarProducto con el ventaID creado
                    agregarProductoConVentaID(ventaID, productoID, cantidad);
                } else {
                    Swal.fire(response.message, "", "error");
                }
            },
            error: function () {
                Swal.fire("Error al crear la venta temporal.", "", "error");
            }
        });
    } else {
        // Si la venta ya existe, agregar el producto directamente
        agregarProductoConVentaID(ventaID, productoID, cantidad);
    }
}

function agregarProductoConVentaID(ventaID, productoID, cantidad) {
    $.ajax({
        url: '/Ventas/AgregarProducto',
        type: 'POST',
        data: {
            productoID: productoID,
            cantidad: cantidad,
            ventaID: ventaID
        },
        success: function (response) {
            if (response.success) {
                // Actualizar la tabla con el nuevo producto
                let productoNombre = $("#ProductoID option:selected").text();
                let precio = response.precio;
                let totalProducto = precio * cantidad;
                let nuevaFila = `
                    <tr>
                        <td>${productoNombre}</td>
                        <td>$${precio.toFixed(2)}</td>
                        <td>${cantidad}</td>
                        <td>$${totalProducto.toFixed(2)}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="EliminarProducto(this)">Eliminar</button></td>
                    </tr>
                `;
                $("#Tabla-Detalle").append(nuevaFila);
                LimpiarFormularioProducto();
            } else {
                Swal.fire(response.message, "", "error");
            }
        },
        error: function () {
            Swal.fire("Ocurrió un error al agregar el producto.", "", "error");
        }
    });
}


function EliminarProducto(button) {
    $(button).closest("tr").remove();
}

function LimpiarFormularioProducto() {
    $("#TipoProductoID").val("0");
    $("#ProductoID").empty();
    $("#Cantidad").val("");
    $("#ProductoID").append('<option value="0">[SELECCIONE UN PRODUCTO]</option>');
}


function ConfirmarVenta() {
    let filasProductos = $("#tablaProductos tbody tr").length;
    
    if (filasProductos === 0) {
        Swal.fire("No se han agregado productos a la venta.", "", "warning");
        return;
    }

    let ventaID = $("#VentaID").val();

    $.ajax({
        url: '/Ventas/ConfirmarVenta',
        type: 'POST',
        data: { ventaID: ventaID },
        success: function (response) {
            if (response.success) {
                window.location.href = response.redirectUrl;
            } else {
                Swal.fire(response.message, "", "error");
            }
        },
        error: function () {
            Swal.fire("Ocurrió un error al confirmar la venta.", "", "error");
        }
    });
}

function CancelarVenta() {
    Swal.fire({
        title: "¿Cancelar venta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            // Resetear los input
            $("#Tabla-Detalle").empty();
            $("#total-price").text("$0.00");
        }
    });
}

function obtenerProductos() {
    let productos = [];
    $("#Tabla-Detalle tr").each(function () {
        let producto = {
            Nombre: $(this).find("td:nth-child(1)").text(),
            Precio: parseFloat($(this).find("td:nth-child(2)").text().replace("$", "")),
            Cantidad: parseInt($(this).find("td:nth-child(3)").text()),
            Total: parseFloat($(this).find("td:nth-child(4)").text().replace("$", "")),
        };
        productos.push(producto);
    });
    return productos;
}