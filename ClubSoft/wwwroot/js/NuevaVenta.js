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


// Función para agregar un producto
function AgregarProducto() {
    let productoID = $("#ProductoID").val();
    let cantidad = $("#Cantidad").val();
    let ventaID = $("#VentaID").val();

    if (productoID === "" || cantidad === "") {
        Swal.fire("Por favor, selecciona un producto y una cantidad.", "", "warning");
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
                console.log("Producto agregado con éxito.");
                // Actualizar el carrito o la lista de productos
            } else {
                Swal.fire("Error", result.message, "error");
            }
        },
        error: function () {
            Swal.fire("Error", "No se pudo agregar el producto.", "error");
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
    success: function (result) {
        if (result.success) {
            console.log("Venta temporal guardada con ID: " + result.ventaID);
        } else {
            console.log("Error al guardar la venta temporal.");
        }
    },
    error: function () {
        console.log("Error en la solicitud.");
    }
});
}


// Función para confirmar la venta
function ConfirmarVenta() {
    let ventaID = $('#ventaID').val(); // Asignar el ID de la venta temporal guardada

    $.ajax({
        url: '/Ventas/ConfirmarVenta',
        type: 'POST',
        data: { ventaID: ventaID },
        success: function (result) {
            if (result.success) {
                window.location.href = result.redirectUrl;
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
    let ventaID = $("#ventaID").val(); // ID de la venta temporal

    $.ajax({
        url: '/Ventas/CancelarVenta',
        type: 'POST',
        data: { ventaID: ventaID },
        success: function (result) {
            if (result.success) {
                Swal.fire("Venta cancelada", "", "success");
                // Vaciar los campos o redirigir a la vista de ventas
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

document.getElementById("next-step-btn").addEventListener("click", function() {
    var cliente = document.getElementById("PersonaID").value;
    var fecha = document.getElementById("fecha").value;

    if (cliente !== "" && fecha !== "") {
        document.getElementById("form-section-2").style.display = "block"; // Mostrar la segunda sección
    } else {
        alert("Por favor, complete el cliente y la fecha.");
    }
});