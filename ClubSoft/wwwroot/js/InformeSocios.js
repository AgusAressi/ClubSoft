window.onload = InformePorSocios;

function InformePorSocios() {
    $.ajax({
        url: '../../SocioAdherentes/InformePorSocios',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (MostrarSociosAdherentes) {
            let contenidoTabla = ``;
            let agrupadoPorTitular = {};

            // Agrupar los adherentes bajo el socio titular correspondiente
            $.each(MostrarSociosAdherentes, function (index, InformeSocios) {
                if (!agrupadoPorTitular[InformeSocios.socioTitularNombre]) {
                    agrupadoPorTitular[InformeSocios.socioTitularNombre] = [];
                }
                agrupadoPorTitular[InformeSocios.socioTitularNombre].push(InformeSocios);
            });

            // Construir el contenido de la tabla
            for (let socioTitularNombre in agrupadoPorTitular) {
                contenidoTabla += `
                    <tr>
                        <td colspan="3" style="background-color: #e0e0e0;"><strong>${socioTitularNombre}</strong></td>
                    </tr>
                `;

                // Iterar sobre los adherentes de cada socio titular
                $.each(agrupadoPorTitular[socioTitularNombre], function (index, InformeSocios) {
                    contenidoTabla += `
                        <tr>
                            <td style="padding-left: 20px;"</td>
                            <td>${InformeSocios.personaNombre}, ${InformeSocios.personaApellido}</td>
                        </tr>
                    `;
                });
            }

            // Inyectar el contenido en la tabla
            document.getElementById("tbody-InformeSocios").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los datos');
        }
    });
}
