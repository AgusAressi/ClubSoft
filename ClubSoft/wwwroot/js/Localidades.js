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
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${LocalidadesMostar.localidadID})">
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
function GuardarRegistro() {
    let localidadID = document.getElementById("LocalidadID").value;
    let nombre = document.getElementById("LocalidadNombre").value.trim(); // Elimina espacios en blanco
    let provinciaID = document.getElementById("ProvinciaID").value;

    // Validar si el campo de localidad está vacío
    if (nombre == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'El nombre de la localidad no puede estar vacío',
        });
        return;
    }

    // Validar si no se ha seleccionado una provincia
    if (provinciaID == "0") {
        Swal.fire({
            icon: 'warning',
            title: 'Provincia no seleccionada',
            text: 'Debe seleccionar una provincia',
        });
        return;
    }

    $.ajax({
        url: '../../Localidades/GuardarLocalidad',
        data: { 
            localidadID: localidadID,
            nombre: nombre,
            provinciaID: provinciaID
        },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    position: "bottom-end",
                    icon: "success",
                    title: response.message,
                    showConfirmButton: false,
                    timer: 1000
                });
                ListadoLocalidades();
            } else {
                // Si ya existe la localidad o está asociada a otra provincia
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar',
                    text: response.message,  // "LA LOCALIDAD YA EXISTE EN ESTA PROVINCIA" o "LA LOCALIDAD NO PUEDE ASOCIARSE A MÁS DE UNA PROVINCIA"
                });
            }
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

function EliminarLocalidad(LocalidadID) {
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
                url: '../../Localidades/EliminarLocalidad',
                data: {
                    LocalidadID: LocalidadID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        // Si se eliminó correctamente, mostrar éxito
                        Swal.fire({
                            title: "Eliminado!",
                            text: "La localidad se eliminó correctamente",
                            icon: "success",
                            confirmButtonColor: "#3085d6"
                        });
                        ListadoLocalidades();
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
     document.getElementById("LocalidadID").value = 0;
     document.getElementById("LocalidadNombre").value = "";
     document.getElementById("ProvinciaID").value = 0;
}
