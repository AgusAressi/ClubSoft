window.onload = ListadoLocalidades();


function ListadoLocalidades(){
    $.ajax({
        // la URL para la petición
        url: '../../Localidades/ListadoLocalidades',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { 
         },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (LocalidadesMostar) {
            
            let contenidoTabla = ``;

            $.each(LocalidadesMostar, function (index, LocalidadesMostar) {  
                
                contenidoTabla += `
                <tr>
                    <td>${LocalidadesMostar.nombre}</td>
                    <td>${LocalidadesMostar.nombreProvincia}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success" onclick="AbrirEditar(${LocalidadesMostar.localidadID})">
                    Editar
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarRegistro(${LocalidadesMostar.localidadID})">
                    Eliminar
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
    console.log(localidadID, nombre, provinciaID);
    
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