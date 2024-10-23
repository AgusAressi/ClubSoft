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


document.addEventListener('DOMContentLoaded', function () {
    var fechaInput = document.getElementById('fecha');
    fechaInput.valueAsDate = new Date();
});


// Función para agregar un producto
function AgregarProducto() {
    let productoID = $("#ProductoID").val();
    let cantidad = parseInt($("#Cantidad").val());
    let ventaID = $("#VentaID").val();

    if (productoID === "0" || cantidad <= 0 || ventaID === "0" || ventaID === "") {
        Swal.fire("Por favor, selecciona un producto, cantidad y asegúrate de que la venta temporal esté creada.", "", "warning");
        return;
    }

    $.ajax({
        url: '/Ventas/AgregarProducto',
        type: 'POST',
        data: {
            productoID: productoID,
            cantidad: cantidad,
            ventaID: ventaID
        },
        success: function (result) {
            if (result.success) {
                // Actualizar la tabla con el nuevo producto
                let productoNombre = $("#ProductoID option:selected").text();
                let precio = result.precio;
                let totalProducto = precio * cantidad;
                let nuevaFila = `
                    <tr>
                        <td>${productoNombre}</td>
                        <td>$${precio.toFixed(2)}</td>
                        <td>${cantidad}</td>
                        <td>$${totalProducto.toFixed(2)}</td>
                        <td><button class="btn btn-danger btn-sm" onclick="EliminarProducto(this)">
                        <i class="fa-solid fa-trash"></i>
                        </button>
                        </td>
                    </tr>
                `;
                $("#Tabla-Detalle").append(nuevaFila);

                // Actualizar el total de la venta
                actualizarTotalVenta();

                // Limpiar el formulario
                LimpiarFormularioProducto();
            } else {
                Swal.fire("Error", result.message, "error");
            }
        },
        error: function () {
            Swal.fire("Error", "No se pudo agregar el producto.", "error");
        }
    });
}


// Función para actualizar el total de la venta
function actualizarTotalVenta() {
    let total = 0;

    // Sumar los totales de los productos en la tabla
    $("#Tabla-Detalle tr").each(function () {
        let totalProducto = parseFloat($(this).find("td:nth-child(4)").text().replace("$", ""));
        total += totalProducto;
    });

    // Actualizar el total en el DOM
    $("#total-price").text(`$${total.toFixed(2)}`);
}


// Función para eliminar un producto y actualizar el total
function EliminarProducto(button) {
    $(button).closest("tr").remove();
    actualizarTotalVenta();
}


function LimpiarFormularioProducto() {
    $("#TipoProductoID").val("0");
    $("#ProductoID").empty();
    $("#Cantidad").val("");
    $("#ProductoID").append('<option value="0">[SELECCIONE UN PRODUCTO]</option>');
}

// Ejecutar función al cambiar cliente
$('#PersonaID').change(function () {
    let personaID = $(this).val();

    // Llamada para crear o actualizar la venta temporal del usuario
    GuardarVentaTemporal();
});


// Función para guardar o actualizar venta temporal
function GuardarVentaTemporal() {
    let personaID = $("#PersonaID").val(); // Cliente
    let fecha = $("#fecha").val(); // Fecha

    if (personaID === "" || fecha === "") {
        Swal.fire("Completa los campos de Cliente y Fecha.", "", "warning");
        return;
    }

    $.ajax({
        url: '/Ventas/GuardarVentaTemporal',
        type: 'POST',
        data: {
            PersonaID: personaID,
            Fecha: fecha
        },
        success: function (response) {
            if (response.success) {
                // Asignar el nuevo ventaID generado
                $("#VentaID").val(response.ventaID); // Asegúrate de que aquí se guarda el ID de la venta temporal
                // Mostrar la segunda sección del formulario
                document.getElementById("form-section-2").style.display = "block";
            } else {
                Swal.fire(response.message, "", "error");
            }
        },
        error: function () {
            Swal.fire("Error al crear la venta temporal.", "", "error");
        }
    });
}


// Función para confirmar la venta
function ConfirmarVenta() {
    let ventaID = $('#VentaID').val(); // Asegúrate de que el ID se obtiene correctamente

    if (!ventaID || ventaID === "0") {
        Swal.fire("No hay venta temporal para confirmar.", "", "warning");
        return;
    }

    $.ajax({
        url: '/Ventas/ConfirmarVenta',
        type: 'POST',
        data: { ventaID: ventaID },
        success: function (result) {
            if (result.success) {
                Swal.fire({
                    title: "Venta confirmada",
                    text: "La venta ha sido confirmada exitosamente.",
                    icon: "success",
                    timer: 2500, 
                    showConfirmButton: false 
                }).then(() => {
                    window.location.href = result.redirectUrl;
                });
            } else {
                Swal.fire("Error", result.message, "error");
            }
        },
        error: function () {
            Swal.fire("Error", "No se pudo confirmar la venta.", "error");
        }
    });
}

// Función para cancelar la venta
function CancelarVenta() {
    let ventaID = $("#VentaID").val(); // ID de la venta temporal

    $.ajax({
        url: '/Ventas/CancelarVenta',
        type: 'POST',
        data: { ventaID: ventaID },
        success: function (result) {
            if (result.success) {
                Swal.fire("Venta cancelada", "", "warning").then(() => {
                    // Aquí vacías los campos de los inputs
                    $('#VentaID').val('0');
                    $('#fecha').val(''); // Reemplaza con el ID correcto de tu input de fecha
                    $('#PersonaID').val('0'); // Reemplaza con el ID correcto de tu input de cliente
                    // Vaciar la tabla de productos
                    $('#Tabla-Detalle').empty();

                    // Reiniciar el total
                    $('#total-price').text('$0.00');
                });
            } else {
                Swal.fire("Error", result.message, "error");
            }
        },
        error: function () {
            Swal.fire("Error", "No se pudo cancelar la venta.", "error");
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

//SECCIONES DE CARGA DE DATOS

document.getElementById("next-step-btn").addEventListener("click", function () {
    var cliente = document.getElementById("PersonaID").value;
    var fecha = document.getElementById("fecha").value;

    if (cliente !== "" && fecha !== "") {
        document.getElementById("form-section-2").style.display = "block"; // Mostrar la segunda sección
    } else {
        alert("Por favor, complete el cliente y la fecha.");
    }
});