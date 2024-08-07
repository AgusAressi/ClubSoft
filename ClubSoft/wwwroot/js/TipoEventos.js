window.onload = ListadoTipoEventos();


function ListadoTipoEventos(){
    $.ajax({
        url: '../../TipoEventos/ListadoTipoEventos',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (traerTodosLosTiposDeEventos) {
            LimpiarInput();
            let contenidoTabla = ``;
            
            $.each(traerTodosLosTiposDeEventos, function (index, traerTodosLosTiposDeEventos) {  
                
                contenidoTabla += `
                <tr>
                    <td>${traerTodosLosTiposDeEventos.nombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${traerTodosLosTiposDeEventos.tipoEventoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarTipoEvento(${traerTodosLosTiposDeEventos.tipoEventoID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;

            });

            document.getElementById("tbody-TipoEventos").innerHTML = contenidoTabla;

        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function GuardarRegistro(){
    const tipoEventoID = document.getElementById("TipoEventoID").value;
    const nombre = document.getElementById("TipoEventoNombre").value.trim();
    const errorMensaje = document.getElementById("errorMensaje");

    // Validar si el campo está vacío
    if(nombre === "") {
        errorMensaje.style.display = "block";
        return;
    } else {
        errorMensaje.style.display = "none";
    }

    $.ajax({
        url: '../../TipoEventos/GuardarTipoEvento',
        data: { tipoEventoID, nombre },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Registro guardado correctamente!",
                showConfirmButton: false,
                timer: 1000
            });
            ListadoTipoEventos();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}

function AbrirEditar(tipoEventoID){
    
    $.ajax({
        url: '../../TipoEventos/TraerTipoEvento',
        data: { 
            tipoEventoID: tipoEventoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (tipoEventoPorID) { 
            let tipoevento = tipoEventoPorID[0];

            document.getElementById("TipoEventoID").value = tipoEventoID;
            document.getElementById("TipoEventoNombre").value = tipoevento.nombre
            
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarTipoEvento(tipoEventoID){
                
    $.ajax({
        url: '../../TipoEventos/EliminarTipoEvento',
        data: {
            tipoEventoID: tipoEventoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoTipoEventos();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}

function LimpiarInput() {
     document.getElementById("TipoEventoID").value = 0;
     document.getElementById("TipoEventoNombre").value = "";
}