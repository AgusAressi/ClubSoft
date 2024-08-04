window.onload = ListadoTipoProductos();


function ListadoTipoProductos(){
    $.ajax({
        url: '../../TipoProductos/ListadoTipoProductos',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (traerTodosLosTiposDeProductos) {
             LimpiarInput();
            let contenidoTabla = ``;
            
            $.each(traerTodosLosTiposDeProductos, function (index, traerTodosLosTiposDeProductos) {  
                
                contenidoTabla += `
                <tr>
                    <td>${traerTodosLosTiposDeProductos.nombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success" onclick="AbrirEditar(${traerTodosLosTiposDeProductos.tipoProductoID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarTipoProducto(${traerTodosLosTiposDeProductos.tipoProductoID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;

            });

            document.getElementById("tbody-TipoProductos").innerHTML = contenidoTabla;

        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function GuardarRegistro(){

    let tipoProductoID = document.getElementById("TipoProductoID").value;
    let nombre = document.getElementById("TipoProductoNombre").value;
    
    $.ajax({
        url: '../../TipoProductos/GuardarTipoProducto',
        data: { 
            tipoProductoID: tipoProductoID,
            nombre: nombre           
            },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            ListadoTipoProductos();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}

function AbrirEditar(tipoProductoID){
    
    $.ajax({
        url: '../../TipoProductos/TraerTipoProducto',
        data: { 
            tipoProductoID: tipoProductoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (tipoProductoPorID) { 
            let tipoproducto = tipoProductoPorID[0];

            document.getElementById("TipoProductoID").value = tipoProductoID;
            document.getElementById("TipoProductoNombre").value = tipoproducto.nombre
            
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarTipoProducto(tipoProductoID){
                
    $.ajax({
        url: '../../TipoProductos/EliminarTipoProducto',
        data: {
            tipoProductoID: tipoProductoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoTipoProductos();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}

function LimpiarInput() {
    document.getElementById("TipoProductoID").value = 0;
    document.getElementById("TipoProductoNombre").value = "";
}