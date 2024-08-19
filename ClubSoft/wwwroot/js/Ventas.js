window.onload = ListadoVentas();

function ListadoVentas(){
    $.ajax({
        url: '../../Ventas/ListadoVentas',
        data: { 
         },
        type: 'POST',
        dataType: 'json',
        success: function (MostrarVentas) {
            // $("#ModalPersonas").modal("hide");
            //  LimpiarModal();
            let contenidoTabla = ``;

            $.each(MostrarVentas, function (index, MostrarVentas) {                  
                contenidoTabla += `
                <tr>
                <td>${MostrarVentas.nombrePersona}, ${MostrarVentas.apellidoPersona}</td>
                    <td>${MostrarVentas.fecha}</td>
                    <td>${MostrarVentas.Total}</td>
                    <td>${MostrarVentas.estado}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${MostrarVentas.ventaID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarPersona(${MostrarVentas.ventaID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;           
            });

            document.getElementById("tbody-Ventas").innerHTML = contenidoTabla;
        },  
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}
