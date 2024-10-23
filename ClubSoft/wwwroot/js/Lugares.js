window.onload = ListadoLugaresEventos();


function ListadoLugaresEventos(){
    $.ajax({
        url: '../../TipoEventos/ListadoLugaresEventos',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (traerLugaresEventos) {
             LimpiarInput();
            let contenidoTabla = ``;
            
            $.each(traerLugaresEventos, function (index, traerLugaresEventos) {  
                
                contenidoTabla += `
                <tr>
                    <td>${traerLugaresEventos.nombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${traerLugaresEventos.lugarID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarLugarEvento(${traerLugaresEventos.lugarID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;

            });

            document.getElementById("tbody-Lugares").innerHTML = contenidoTabla;

        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function LimpiarInput() {
    document.getElementById("LugarID").value = 0;
    document.getElementById("LugarNombre").value = "";
}

function GuardarRegistroLugar() {
    const lugarID = document.getElementById("LugarID").value;
    const nombre = document.getElementById("LugarNombre").value.trim();
    const errorMensajeLugar = document.getElementById("errorMensajeLugar");

    if (nombre === "") {
        errorMensajeLugar.style.display = "block";
        return;
    } else {
        errorMensajeLugar.style.display = "none";
    }

    $.ajax({
        url: '../../TipoEventos/GuardarLugarEvento',
        data: { lugarID, nombre },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Registro guardado correctamente!",
                    showConfirmButton: false,
                    timer: 1000
                });
                ListadoLugaresEventos();
            } else {
                // Mostrar alerta si el lugar ya existe
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultado.message, // Mensaje de error devuelto por el servidor
                });
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}



function AbrirEditar(lugarID){
    
    $.ajax({
        url: '../../TipoEventos/TraerLugarEvento',
        data: { 
            lugarID: lugarID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (tipoLugarPorID) { 
            let lugar = tipoLugarPorID[0];

            document.getElementById("LugarID").value = lugarID;
            document.getElementById("LugarNombre").value = lugar.nombre
            
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}


function EliminarLugarEvento(lugarID){
                
    $.ajax({
        url: '../../TipoEventos/EliminarLugarEvento',
        data: {
            lugarID: lugarID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoLugaresEventos();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}