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
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${traerTodasLasProvincias.provinciaID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger boton-color2" onclick="EliminarProvnicia(${traerTodasLasProvincias.provinciaID})">
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
    let nombre = document.getElementById("ProvinciaNombre").value.trim(); // Elimina espacios en blanco
    let errorMensaje = document.getElementById("errorMensaje");

    // Validar si el campo está vacío
    if(nombre === "") {
        errorMensaje.style.display = "block";
        return;
    } else {
        errorMensaje.style.display = "none";
    }
    
    $.ajax({
        url: '../../Provincias/GuardarProvincia',
        data: { 
            ProvinciaID: provinciaID,
            Nombre: nombre           
        },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            Swal.fire({
                position: "bottom-end",
                icon: "success",
                title: "Registro guardado correctamente!",
                showConfirmButton: false,
                timer: 1000
            }); 
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

function EliminarProvnicia(ProvinciaID) {
    Swal.fire({
        title: "¿Está seguro que quiere eliminar a la persona?",
        text: "¡No podrás recuperarla!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../../Provincias/EliminarProvincia',
                data: {
                    ProvinciaID: ProvinciaID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        // Si se eliminó correctamente, mostrar éxito
                        Swal.fire({
                            title: "Eliminado!",
                            text: "La provincia se eliminó correctamente",
                            icon: "success",
                            confirmButtonColor: "#3085d6"
                        });
                        ListadoProvincias();
                    } else {
                        // Si no se puede eliminar, mostrar el mensaje con la razón
                        Swal.fire({
                            title: "Ups!",
                            text: resultado.message, 
                            icon: "error",
                            confirmButtonColor: "#3085d6"
                        });
                    }
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}

function LimpiarInput() {
     document.getElementById("ProvinciaID").value = 0;
     document.getElementById("ProvinciaNombre").value = "";
}