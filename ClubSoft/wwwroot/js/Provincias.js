window.onload = ListadoProvincias();


function ListadoProvincias(){
    $.ajax({
        url: '../../Provincias/ListadoProvincias',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (traerTodasLasProvincias) {
            LimpiarInput();
            let contenidoTabla = ``;
            
            $.each(traerTodasLasProvincias, function (index, traerTodasLasProvincias) {  
                
                contenidoTabla += `
                <tr>
                    <td>${traerTodasLasProvincias.nombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success" onclick="AbrirEditar(${traerTodasLasProvincias.provinciaID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarProvnicia(${traerTodasLasProvincias.provinciaID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
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

function GuardarRegistro(){

    let provinciaID = document.getElementById("ProvinciaID").value;
    let nombre = document.getElementById("ProvinciaNombre").value;
    
    $.ajax({
        url: '../../Provincias/GuardarProvincia',
        data: { 
            ProvinciaID: provinciaID,
            Nombre: nombre           
            },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            ListadoProvincias();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}

function AbrirEditar(ProvinciaID){
    
    $.ajax({
        url: '../../Provincias/TraerProvincia',
        data: { 
            provinciaID: ProvinciaID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (provinciaPorID) { 
            let provincia = provinciaPorID[0];

            document.getElementById("ProvinciaID").value = ProvinciaID;
            document.getElementById("ProvinciaNombre").value = provincia.nombre
            
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarProvnicia(ProvinciaID){
                
    $.ajax({
        url: '../../Provincias/EliminarProvincia',
        data: {
            provinciaID: ProvinciaID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoProvincias();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}

function LimpiarInput() {
     document.getElementById("ProvinciaID").value = 0;
     document.getElementById("ProvinciaNombre").value = "";
}