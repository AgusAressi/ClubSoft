window.onload = InformeVentasPorCliente();

function InformeVentasPorCliente() {
    $.ajax({
        url: '../../Ventas/InformeVentasPorCliente', 
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (MostrarVentas) {
            let contenidoTabla = ``;
            let agrupadoPorCliente = {};

            // Agrupar las ventas bajo el cliente correspondiente
            $.each(MostrarVentas, function (index, Venta) {
                if (!agrupadoPorCliente[`${Venta.apellidoPersona}, ${Venta.nombrePersona}`]) {
                    agrupadoPorCliente[`${Venta.apellidoPersona}, ${Venta.nombrePersona}`] = [];
                }
                agrupadoPorCliente[`${Venta.apellidoPersona}, ${Venta.nombrePersona}`].push(Venta);
            });

            // Construir el contenido de la tabla
            for (let clienteNombre in agrupadoPorCliente) {
                contenidoTabla += `
                    <tr>
                        <td colspan="4" style="background-color: #e0e0e0;"><strong>${clienteNombre}</strong></td>
                    </tr>
                `;

                // Iterar sobre las ventas de cada cliente
                $.each(agrupadoPorCliente[clienteNombre], function (index, Venta) {
                    let totalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Venta.total);

                    contenidoTabla += `
                        <tr>
                            <td style="padding-left: 20px;"></td>
                            <td class="text-end">${Venta.fecha}</td>
                            <td class="text-end">${totalFormateado}</td>
                          
                        </tr>
                    `;
                });
            }

            document.getElementById("tbody-InformeVentas").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los datos');
        }
    });
}