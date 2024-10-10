window.onload = InformeListadoProductos;

function InformeListadoProductos() {

    $.ajax({
        url: '../../Productos/InformeListadoProductos',
        data: {

        },
        type: 'POST',
        dataType: 'json',
        success: function (MostrarProductos) {
            let contenidoTabla = ``;
            let agrupadoPorTipo = {};

            $.each(MostrarProductos, function (index, InformeProductos) {
                if (!agrupadoPorTipo[InformeProductos.nombreTipoProducto]) {
                    agrupadoPorTipo[InformeProductos.nombreTipoProducto] = [];
                }
                agrupadoPorTipo[InformeProductos.nombreTipoProducto].push(InformeProductos);
            });

            for (let nombreTipoProducto in agrupadoPorTipo) {

                contenidoTabla += `
                    <tr>
                    
                        <td colspan="3"><strong>${nombreTipoProducto}</strong></td>
                        
                    </tr>
                `;

                $.each(agrupadoPorTipo[nombreTipoProducto], function (index, InformeProductos) {
                    contenidoTabla += `
                        <tr>
                        <td></td>
                            <td>${InformeProductos.nombre}</td>
                            
                            
                        </tr>
                    `;
                });
            }

            document.getElementById("tbody-InformeProductos").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}