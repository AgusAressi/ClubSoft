window.onload = ListadoSociosTitulares();
function ListadoSociosTitulares(){
    $.ajax({
        url: '../../SocioTitulares/ListadoSociosTitulares',
        data: { 
         },
        type: 'POST',
        dataType: 'json',
        success: function (MostrarSocios) {
            $("#ModalSocioTitular").modal("hide");
            LimpiarModalSocioTitular();
            let contenidoTabla = ``;

            $.each(MostrarSocios, function (index, MostrarSociosTitulares) {                  
                contenidoTabla += `
                <tr>
                    <td>${MostrarSociosTitulares.personaApellido}, ${MostrarSociosTitulares.personaNombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarSocioTitular(${MostrarSociosTitulares.socioTitularID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;           
            });

            document.getElementById("tbody-sociostitulares").innerHTML = contenidoTabla;

            // Filtro de búsqueda
            document.getElementById('searchInput').addEventListener('input', function () {
                var filter = this.value.toLowerCase();
                var rows = document.querySelectorAll('#tbody-sociostitulares tr');

                rows.forEach(function (row) {
                    var nombreCompleto = row.cells[0].textContent.toLowerCase();
                    if (nombreCompleto.includes(filter)) {
                        row.style.display = ''; // muestra la fila si coincide
                    } else {
                        row.style.display = 'none'; // ocultar la fila si no coincide
                    }
                });
            });

        },  
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function NuevoSocioTitular(){
    $("#ModalSocioTitularTitulo").text("Nuevo Socio Titular");
}

function LimpiarModalSocioTitular(){
    document.getElementById("SocioTitularID").value = 0;
    document.getElementById("PersonaID").value = 0;
    document.getElementById("errorMensajePersona").style.display = "none";
}

function GuardarSocioTitular(){
    let socioTitularID = document.getElementById("SocioTitularID").value;
    let personaID = document.getElementById("PersonaID").value;
    let errorMensajePersona = document.getElementById("errorMensajePersona");

    if(personaID == "0") {
        errorMensajePersona.style.display = "block";
        return;
    } else {
        errorMensajePersona.style.display = "none";
    }
    
    $.ajax({
        url: '../../SocioTitulares/GuardarSocioTitular',
        data: { 
            socioTitularID: socioTitularID,
            personaID: personaID,
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
            ListadoSociosTitulares();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}

function EliminarSocioTitular(SocioTitularID){
    Swal.fire({
        title: "¿Esta seguro que quiere eliminar este socio titular?",
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
                url: '../../SocioTitulares/EliminarSocioTitular',
                data: {
                    SocioTitularID: SocioTitularID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El socio se elimino correctamente",
                        icon: "success",
                        confirmButtonColor: "#3085d6"
                    });           
                    ListadoSociosTitulares();
                },
                error: function (xhr, status) {
                console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}
