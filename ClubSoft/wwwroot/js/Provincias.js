window.onload = ListadoProvincias();


function ListadoProvincias(){
    $.ajax({
        url: '../../Provincias/ListadoProvincias',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (traerTodasLasProvincias) {
            let contenidoTabla = ``;

            $.each(traerTodasLasProvincias, function (index, traerTodasLasProvincias) {  
                
                contenidoTabla += `
                <tr>
                    <td>${traerTodasLasProvincias.nombre}</td>
                </tr>
             `;

            });

            document.getElementById("tbody-Provincias").innerHTML = contenidoTabla;

        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}