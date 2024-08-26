// window.onload = ListadoVentas();

// function ListadoVentas(){
//     $.ajax({
//         url: '../../Ventas/ListadoVentas',
//         data: { 
//          },
//         type: 'POST',
//         dataType: 'json',
//         success: function (MostrarVentas) {
//              $("#ModalVentas").modal("hide");
//              LimpiarModal();
//             let contenidoTabla = ``;

//             $.each(MostrarVentas, function (index, MostrarVentas) {                  
//                 contenidoTabla += `
//                 <tr>
//                 <td>${MostrarVentas.nombrePersona}, ${MostrarVentas.apellidoPersona}</td>
//                     <td>${MostrarVentas.fecha}</td>
//                     <td>${MostrarVentas.Total}</td>
//                     <td>${MostrarVentas.estado}</td>
//                     <td class="text-center">
//                     <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${MostrarVentas.ventaID})">
//                     <i class="fa-solid fa-pen-to-square"></i>
//                     </button>
//                     </td>
//                     <td class="text-center">
//                     <button type="button" class="btn btn-danger" onclick="EliminarVenta(${MostrarVentas.ventaID})">
//                     <i class="fa-solid fa-trash"></i>
//                     </button>
//                     </td> 
//                 </tr>
//              `;           
//             });

//             document.getElementById("tbody-Ventas").innerHTML = contenidoTabla;
//         },  
//         error: function (xhr, status) {
//             alert('Disculpe, existió un problema al deshabilitar');
//         }
//     });
// }


// function LimpiarModal() {
//     document.getElementById("VentaID").value = 0;
//     document.getElementById("TipoProducto").value = "";
//     document.getElementById("ProductoID").value = "";
//     document.getElementById("Cantidad").value = "";
//     document.getElementById("Cliente").value = "";
//     document.getElementById("Tabla-Detalle").innerHTML = "";
//     document.getElementById("total-price").innerText = "$0.00";
// }


// function NuevaVenta(){
//     $("#ModalTitulo").text("Nueva Venta");
// }
// function GuardarRegistro() {
//     let ventaID = document.getElementById("VentaID").value;
//     let cuentaCorrienteID = document.getElementById("CuentaCorrienteID").value;; // Debes actualizar este valor según tu lógica para obtener la CuentaCorrienteID
//     let fecha = new Date().toISOString(); // Asigna la fecha actual
//     let estado = "Pendiente"; // O el estado correspondiente según tu lógica
//     let total = parseFloat(document.getElementById("total-price").innerText.replace("$", ""));

//     $.ajax({
//         url: '/Ventas/GuardarRegistro', 
//         data: { 
//             VentaID: ventaID,
//             CuentaCorrienteID: cuentaCorrienteID,
//             Fecha: fecha,
//             Estado: estado,
//             Total: total
//         },
//         type: 'POST',
//         dataType: 'json',   
//         success: function (resultado) {
//             console.log(resultado);
//             Swal.fire({
//                 position: "top-end",
//                 icon: "success",
//                 title: "Venta guardada correctamente!",
//                 showConfirmButton: false,
//                 timer: 1000
//             });
//             $("#ModalVentas").modal("hide");
//             cargarVentas(); // Actualiza la tabla de ventas
//         },
//         error: function (xhr, status, error) {
//             console.log('Disculpe, existió un problema al guardar la venta');
//         }
//     });
// }

// function AbrirEditar(VentaID) {
//     $.ajax({
//         url: '/Ventas/TraerVenta', 
//         data: { 
//             VentaID: VentaID,
//         },
//         type: 'POST',
//         dataType: 'json',
//         success: function (ventasConId) { 
//             let venta = ventasConId[0];

//             document.getElementById("VentaID").value = VentaID;
//             document.getElementById("TipoProducto").value = ""; // Suponiendo que el tipo de producto se seteará manualmente
//             document.getElementById("ProductoID").value = ""; // Este campo puede llenarse según la lógica que uses
//             document.getElementById("Cantidad").value = ""; // Este campo puede llenarse según la lógica que uses
//             document.getElementById("Cliente").value = venta.CuentaCorrienteID; // Si tienes el nombre del cliente relacionado, úsalo en lugar del ID
//             document.getElementById("total-price").innerText = "$" + venta.Total.toFixed(2);

//             // Aquí deberías cargar los detalles de la venta si los tienes
//             // document.getElementById("Tabla-Detalle").innerHTML = ""; // Lógica para cargar detalles de productos

//             $("#ModalVentas").modal("show");
//         },
//         error: function (xhr, status) {
//             console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
//         }
//     });
// }


// function EliminarVenta(VentaID){
                
//     $.ajax({
//         url: '../../Ventass/EliminarVenta',
//         data: {
//             ventaID: VentaID,
//         },
//         type: 'POST',
//         dataType: 'json',
//         success: function (resultado) {           
//             ListadoVentas();
//         },
//      error: function (xhr, status) {
//      console.log('Disculpe, existió un problema al eliminar el registro.');
//     }
// });
// }
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

