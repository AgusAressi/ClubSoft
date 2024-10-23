window.onload = ListadoVentas;

function ListadoVentas() {
    $.ajax({
        url: '../../Ventas/ListadoVentas',
        data: {
        },
        type: 'GET',
        dataType: 'json',
        success: function (VentasMostrar) {
            let contenidoTabla = ``;

            $.each(VentasMostrar, function (index, VentaMostrar) {

                contenidoTabla += `
                <tr>
                    <td>${VentaMostrar.ventaID}</td>
                    <td>${VentaMostrar.nombrePersona}, ${VentaMostrar.apellidoPersona}</td>
                    <td>${VentaMostrar.fecha}</td>
                    <td>${VentaMostrar.total}</td>
                    <td>${VentaMostrar.estado}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary boton-color" onclick="AbrirDetalleVenta(${VentaMostrar.ventaID})">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </td>
                </tr>`;

            });

            document.getElementById("tbody-Ventas").innerHTML = contenidoTabla;

        },


        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function AbrirDetalleVenta(ventaID) {
    $.ajax({
        url: '../../Ventas/ObtenerDetalleVenta', 
        data: { id: ventaID },
        type: 'GET',
        dataType: 'json',
        success: function (detalleVenta) {
            let contenidoDetalle = ``;

            $.each(detalleVenta, function (index, detalle) {
                contenidoDetalle += `
                <tr>
                    <td>${detalle.nombre}</td>
                    <td>${detalle.precio}</td>
                    <td>${detalle.cantidad}</td>
                    <td>${detalle.subTotal}</td>
                </tr>`;
            });

            $('#detalleVentaTabla').html(contenidoDetalle);
            $('#detalleVentaModal').modal('show'); 
        },
        error: function (xhr, status) {
            alert('Error al cargar los detalles de la venta');
        }
    });
}
