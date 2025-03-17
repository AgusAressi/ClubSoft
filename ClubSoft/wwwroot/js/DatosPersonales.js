function ListadoDatosPersonales() {
    $.ajax({
        url: '../../Personas/ListadoDatosPersonales',
        type: 'POST',
        dataType: 'json',
        success: function (MostrarDatosPersonales) {
            let contenidoTabla = ``;

            $.each(MostrarDatosPersonales, function (index, persona) {
                contenidoTabla += `
                <tr>
                    <td>${persona.apellido}, ${persona.nombre}</td>
                    <td class="ocultar-en-768px">${persona.dni}</td>
                    <td class="ocultar-en-768px">${persona.direccion}</td>
                    <td class="ocultar-en-768px">${persona.telefono}</td>
                    <td class="ocultar-en-768px">${persona.email}</td>
                    <td class="ocultar-en-768px">${persona.rolNombre}</td>
                </tr>`;
            });

            document.getElementById("tbody-DatosPersonales").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los datos');
        }
    });
}

// Ejecutar la función al cargar la página
$(document).ready(function () {
    ListadoDatosPersonales();
});