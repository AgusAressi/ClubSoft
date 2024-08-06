window.onload = ListadoProductos();

function ListadoProductos(){
    $.ajax({
        url: '../../Productos/ListadoProductos',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (MostarProductos) {
            $("#ModalProductos").modal("hide");
             LimpiarModal();

            let contenidoTabla = ``;
            
            $.each(MostarProductos, function (index, producto) {  
                
                contenidoTabla += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.descripcion}</td>
                    <td>
                        <input type="checkbox" class="form-check-input" ${producto.estado ? 'checked' : ''} disabled />
                    </td>
                    <td>${producto.nombreTipoProducto}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-success" onclick="AbrirEditar(${producto.productoID})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger" onclick="EliminarProducto(${producto.productoID})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td> 
                </tr>
                `;
            });

            document.getElementById("tbody-Productos").innerHTML = contenidoTabla;

        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function LimpiarModal(){
    document.getElementById("ProductoID").value = 0;
    document.getElementById("ProductoNombre").value = "";
    document.getElementById("ProductoPrecio").value = "";
    document.getElementById("ProductoCantidad").value = "";
    document.getElementById("ProductoDescripcion").value = "";
    document.getElementById("ProductoEstado").checked = ""
    document.getElementById("TipoProductoID").value = "";
   
}

function NuevoProducto(){
    $("#ModalTitulo").text("Nuevo Producto");
}

function GuardarRegistro() {
    let productoID = document.getElementById("ProductoID").value;
    let nombre = document.getElementById("ProductoNombre").value;
    let precio = document.getElementById("ProductoPrecio").value;
    let cantidad = document.getElementById("ProductoCantidad").value;
    let descripcion = document.getElementById("ProductoDescripcion").value;  
    let estado = document.getElementById("ProductoEstado").checked;
    let tipoProductoID = document.getElementById("TipoProductoID").value;
    
    
    $.ajax({
        url: '../../Productos/GuardarRegistro',
        data: { 
            ProductoID: productoID,
            Nombre: nombre,
            Precio: precio,
            Cantidad: cantidad,
            Descripcion:descripcion,
            Estado: estado,
            TipoProductoID: tipoProductoID
        },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            console.log(resultado);
            ListadoProductos(); 
        },
        error: function (xhr, status, error) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}


function AbrirEditar(ProductoID){
    
    $.ajax({
        url: '../../Productos/TraerProducto',
        data: { 
            productoID: ProductoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (productoConId) { 
            let producto = productoConId[0];

            document.getElementById("ProductoID").value = ProductoID;
            document.getElementById("ProductoNombre").value = producto.nombre,
            document.getElementById("ProductoPrecio").value = producto.precio,
            document.getElementById("ProductoCantidad").value = producto.cantidad,
            document.getElementById("ProductoDescripcion").value = producto.descripcion,
            document.getElementById("ProductoEstado").value = producto.estado,
            document.getElementById("TipoProductoID").value = producto.tipoProductoID

            $("#ModalProductos").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarProducto(ProductoID){
                
    $.ajax({
        url: '../../Productos/EliminarProducto',
        data: {
            productoID: ProductoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoProductos();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}


