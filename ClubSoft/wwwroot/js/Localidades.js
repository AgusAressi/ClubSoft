window.onload = ListadoLocalidades();


function ListadoLocalidades(){
    $.ajax({
        url: '../../Localidades/ListadoLocalidades',
        data: { 
         },
        type: 'POST',
        dataType: 'json',
        success: function (LocalidadesMostar) {
            LimpiarInput();
            let contenidoTabla = ``;

            $.each(LocalidadesMostar, function (index, LocalidadesMostar) {  
                
                contenidoTabla += `
                <tr>
                    <td>${LocalidadesMostar.nombre}</td>
                    <td>${LocalidadesMostar.nombreProvincia}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success" onclick="AbrirEditar(${LocalidadesMostar.localidadID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarLocalidad(${LocalidadesMostar.localidadID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;

               
            });

            document.getElementById("tbody-Localidades").innerHTML = contenidoTabla;

        },

       
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function GuardarRegistro(){

    let localidadID = document.getElementById("LocalidadID").value;
    let nombre = document.getElementById("LocalidadNombre").value;
    let provinciaID = document.getElementById("ProvinciaID").value;
    
    $.ajax({
        url: '../../Localidades/GuardarLocalidad',
        data: { 
            localidadID: localidadID,
            nombre: nombre,
            provinciaID: provinciaID
            
            },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            ListadoLocalidades();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}

function AbrirEditar(LocalidadID){
    
    $.ajax({
        url: '../../Localidades/TraerLocalidad',
        data: { 
            localidadID: LocalidadID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (localidadporID) { 
            let localidad = localidadporID[0];

            document.getElementById("LocalidadID").value = LocalidadID;
            document.getElementById("LocalidadNombre").value = localidad.nombre,
            document.getElementById("ProvinciaID").value = localidad.provinciaID
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarLocalidad(LocalidadID){
                
    $.ajax({
        url: '../../Localidades/EliminarLocalidad',
        data: {
            localidadID: LocalidadID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoLocalidades();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}

function LimpiarInput() {
     document.getElementById("LocalidadID").value = 0;
     document.getElementById("LocalidadNombre").value = "";
     document.getElementById("ProvinciaID").value = 0;
}
