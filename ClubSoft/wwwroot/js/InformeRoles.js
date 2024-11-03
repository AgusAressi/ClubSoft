window.onload = InformePorRol;

function InformePorRol() {
    $.ajax({
        url: '../../Personas/InformePorRol', 
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (MostrarPersonas) {
            let contenidoTabla = ``;
            let agrupadoPorRol = {};

            // Agrupar las personas bajo el rol correspondiente
            $.each(MostrarPersonas, function (index, Persona) {
                if (!agrupadoPorRol[Persona.rolNombre]) {
                    agrupadoPorRol[Persona.rolNombre] = [];
                }
                agrupadoPorRol[Persona.rolNombre].push(Persona);
            });

            // Construir el contenido de la tabla
            for (let rolNombre in agrupadoPorRol) {
                contenidoTabla += `
                    <tr>
                        <td colspan="3" style="background-color: #e0e0e0;"><strong>${rolNombre}</strong></td>
                    </tr>
                `;

                // Iterar sobre las personas de cada rol
                $.each(agrupadoPorRol[rolNombre], function (index, Persona) {
                    contenidoTabla += `
                        <tr>
                            <td></td>
                            <td>${Persona.nombre} ${Persona.apellido}</td>
                            <td>${Persona.email}</td>
                        </tr>
                    `;
                });
            }

            document.getElementById("tbody-InformeRoles").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los datos');
        }
    });
}
