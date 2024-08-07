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

function GuardarRegistro(){
    let localidadID = document.getElementById("LocalidadID").value;
    let nombre = document.getElementById("LocalidadNombre").value.trim(); // Elimina espacios en blanco
    let provinciaID = document.getElementById("ProvinciaID").value;
    let errorMensajeLocalidad = document.getElementById("errorMensajeLocalidad");
    let errorMensajeProvincia = document.getElementById("errorMensajeProvincia");

    // Validar si el campo de localidad está vacío
    if(nombre == "") {
        errorMensajeLocalidad.style.display = "block";
        return;
    } else {
        errorMensajeLocalidad.style.display = "none";
    }

    // Validar si no se ha seleccionado una provincia
    if(provinciaID == "0") {
        errorMensajeProvincia.style.display = "block";
        return;
    } else {
        errorMensajeProvincia.style.display = "none";
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
        success: function (resultado) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Registro guardado correctamente!",
                showConfirmButton: false,
                timer: 1000
            }); 
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
    Swal.fire({
        title: "Esta seguro que quiere eliminar el registro?",
        text: "No podrás recuperarlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {            
            $.ajax({
                url: '../../Localidades/EliminarLocalidad',
                data: {
                    localidadID: LocalidadID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El registro se elimino correctamente",
                        icon: "success",
                        confirmButtonColor: "#3085d6"
                    });           
                    ListadoLocalidades();
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
