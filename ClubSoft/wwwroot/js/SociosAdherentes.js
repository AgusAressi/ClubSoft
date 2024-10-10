function ListadoSociosAdherentes(){
    $.ajax({
        url: '../../SocioAdherentes/ListadoSociosAdherentes',
        data: { 
         },
        type: 'POST',
        dataType: 'json',
        success: function (MostrarSocios) {
            $("#ModalSocioAdherente").modal("hide");
            LimpiarModalSocioAdherente();
            let contenidoTabla = ``;

            $.each(MostrarSocios, function (index, MostrarSociosAdherentes) {                  
                contenidoTabla += `
                <tr>
                    <td>${MostrarSociosAdherentes.personaApellido}, ${MostrarSociosAdherentes.personaNombre}</td>
                    <td>${MostrarSociosAdherentes.socioTitularNombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${MostrarSociosAdherentes.socioAdherenteID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarSocioAdherente(${MostrarSociosAdherentes.socioAdherenteID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;           
            });

            document.getElementById("tbody-sociosadherentes").innerHTML = contenidoTabla;

            // Filtro de búsqueda
            document.getElementById('searchInput').addEventListener('input', function () {
                var filter = this.value.toLowerCase();
                var rows = document.querySelectorAll('#tbody-sociosadherentes tr');

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

function NuevoSocioAdherente(){
    $("#ModalSocioAdherenteTitulo").text("Nuevo Socio Adherente");
}

function LimpiarModalSocioAdherente(){
    document.getElementById("SocioAdherenteID").value = 0;
    document.getElementById("PersonaID").value = 0;
    document.getElementById("errorMensajePersona").style.display = "none";
    document.getElementById("SocioTitularID").value = 0;
    document.getElementById("errorMensajeSocioTitular").style.display = "none";
}

function GuardarSocioAdherente(){
    let socioAdherenteID = document.getElementById("SocioAdherenteID").value;
    let personaID = document.getElementById("PersonaID").value;
    let errorMensajePersona = document.getElementById("errorMensajePersona");
    let socioTitularID = document.getElementById("SocioTitularID").value;
    let errorMensajeSocioTitular = document.getElementById("errorMensajeSocioTitular");
    
    if(personaID == "0") {
        errorMensajePersona.style.display = "block";
        return;
    } else {
        errorMensajePersona.style.display = "none";
    }
    if(socioTitularID == "0") {
        errorMensajeSocioTitular.style.display = "block";
        return;
    } else {
        errorMensajeSocioTitular.style.display = "none";
    }
    
    $.ajax({
        url: '../../SocioAdherentes/GuardarSocioAdherente',
        data: { 
            socioAdherenteID: socioAdherenteID,
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
            ListadoSociosAdherentes();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}

function AbrirEditar(SocioAdherenteID){
    
    $.ajax({
        url: '../../SocioAdherentes/TraerSocioAdherente',
        data: { 
            socioAdherenteID: SocioAdherenteID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (socioAdherenteporID) { 
            let socioAdherente = socioAdherenteporID[0];

            document.getElementById("SocioAdherenteID").value = SocioAdherenteID;
            document.getElementById("SocioTitularID").value = socioAdherente.socioTitularID,
            document.getElementById("PersonaID").value = socioAdherente.personaID

            $("#ModalSocioAdherente").modal("show");
            $("#ModalSocioAdherenteTitulo").text("Editar Socio Adherente");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarSocioAdherente(SocioAdherenteID){
    
    Swal.fire({
        title: "¿Esta seguro que quiere eliminar este socio adherente?",
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
                url: '../../SocioAdherentes/EliminarSocioAdherente',
                data: {
                    SocioAdherenteID: SocioAdherenteID,
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
                    ListadoSociosAdherentes();
                },
                error: function (xhr, status) {
                console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}