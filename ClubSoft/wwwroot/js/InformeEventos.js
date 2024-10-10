window.onload = InformePorEventos;

function InformePorEventos() {

    $.ajax({
        url: '../../Eventos/InformePorEventos',
        data: {

        },
        type: 'POST',
        dataType: 'json',
        success: function (EventosMostar) {
            let contenidoTabla = ``;
            let agrupadoPorTipo = {};

            $.each(EventosMostar, function (index, InformeEventos) {
                if (!agrupadoPorTipo[InformeEventos.nombreTipoEvento]) {
                    agrupadoPorTipo[InformeEventos.nombreTipoEvento] = [];
                }
                agrupadoPorTipo[InformeEventos.nombreTipoEvento].push(InformeEventos);
            });

            for (let nombreTipoEvento in agrupadoPorTipo) {

                contenidoTabla += `
                    <tr>
                    
                        <td colspan="3"><strong>${nombreTipoEvento}</strong></td>
                        
                    </tr>
                `;

                $.each(agrupadoPorTipo[nombreTipoEvento], function (index, InformeEventos) {
                    contenidoTabla += `
                        <tr>
                        <td></td>
                            <td>${InformeEventos.descripcion}</td>
                            
                            
                        </tr>
                    `;
                });
            }

            document.getElementById("tbody-InformeEventos").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}