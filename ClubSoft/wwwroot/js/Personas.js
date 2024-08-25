window.onload = ListadoPersonas();

function ListadoPersonas(){
    $.ajax({
        url: '../../Personas/ListadoPersonas',
        data: { 
         },
        type: 'POST',
        dataType: 'json',
        success: function (MostrarPersonas) {
            $("#ModalPersonas").modal("hide");
            LimpiarModal();
            let contenidoTabla = ``;

            $.each(MostrarPersonas, function (index, MostrarPersonas) {                  
                contenidoTabla += `
                <tr>
                    <td>${MostrarPersonas.apellido}, ${MostrarPersonas.nombre}</td>
                    <td>${MostrarPersonas.dni}</td>
                    <td>${MostrarPersonas.direccion}, ${MostrarPersonas.nombreLocalidad}, ${MostrarPersonas.nombreProvincia}</td>
                    <td>${MostrarPersonas.telefono}</td>
                    <td>${MostrarPersonas.email}</td>
                    <td>${MostrarPersonas.rolNombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${MostrarPersonas.personaID}, '${MostrarPersonas.usuarioID}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarPersona(${MostrarPersonas.personaID}, '${MostrarPersonas.usuarioID}')">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;           
            });

            document.getElementById("tbody-Personas").innerHTML = contenidoTabla;

            // Filtro de búsqueda
            document.getElementById('searchInput').addEventListener('input', function () {
                var filter = this.value.toLowerCase();
                var rows = document.querySelectorAll('#tbody-Personas tr');

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

function LimpiarModal(){
    document.getElementById("PersonaID").value = 0;
    document.getElementById("PersonaNombre").value = "";
    document.getElementById("PersonaApellido").value = "";
    document.getElementById("PersonaDireccion").value = "";
    document.getElementById("PersonaTelefono").value = "";
    document.getElementById("PersonaDni").value = "";
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("errorMensajeNombre").style.display = "none";
    document.getElementById("errorMensajeApellido").style.display = "none";
    document.getElementById("errorMensajeDireccion").style.display = "none";
    document.getElementById("errorMensajeTelefono").style.display = "none";
    document.getElementById("errorMensajeDNI").style.display = "none";
    document.getElementById("errorMensajeLocalidad").style.display = "none";
    document.getElementById("UsuarioID").value = 0;
    document.getElementById("PersonaEmail").value = "";
    document.getElementById("errorMensajeEmail").style.display = "none";
    document.getElementById("PersonaContraseña").value = "";
    document.getElementById("errorMensajeContraseña").style.display = "none";
    document.getElementById("PersonaUserName").value = "";
    document.getElementById("errorMensajeUserName").style.display = "none";
    document.getElementById("errorMensajeRol").style.display = "none";

}

function NuevaPersona(){
    $("#ModalTitulo").text("Nueva Persona");
}

function GuardarRegistro() {
    let personaID = document.getElementById("PersonaID").value;
    let nombre = document.getElementById("PersonaNombre").value;
    let apellido = document.getElementById("PersonaApellido").value;
    let direccion = document.getElementById("PersonaDireccion").value; 
    let telefono = document.getElementById("PersonaTelefono").value;
    let dni = document.getElementById("PersonaDni").value;
    let localidadID = document.getElementById("LocalidadID").value;
    let usuarioID = document.getElementById("UsuarioID").value;
    let userName = document.getElementById("PersonaUserName").value;
    let email = document.getElementById("PersonaEmail").value;
    let password = document.getElementById("PersonaContraseña").value;
    let rol = document.getElementById("RolID").value;

    let isValid = true;

    if (nombre === "") {
        document.getElementById("errorMensajeNombre").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeNombre").style.display = "none";
    }

    if (apellido === "") {
        document.getElementById("errorMensajeApellido").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeApellido").style.display = "none";
    }

    if (direccion === "") {
        document.getElementById("errorMensajeDireccion").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeDireccion").style.display = "none";
    }

    if (telefono === "") {
        document.getElementById("errorMensajeTelefono").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeTelefono").style.display = "none";
    }

    if (dni === "") {
        document.getElementById("errorMensajeDNI").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeDNI").style.display = "none";
    }

    if (localidadID === "0") {
        document.getElementById("errorMensajeLocalidad").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeLocalidad").style.display = "none";
    }

    if (!isValid) {
        return;
    }

    $.ajax({
        url: '../../Users/GuardarUsuario',
        data: {
            UserName: userName,
            Email: email,
            Password: password,
            Rol: rol
        },
        type: 'POST',
        dataType: 'json',
        success: function (usuarioResultado) {
            if (usuarioResultado.success) {
                let usuarioID = usuarioResultado.usuarioID;
                    // Guardar datos de Persona con el UsuarioID generado
                    $.ajax({
                        url: '../../Personas/GuardarRegistro',
                        data: { 
                            PersonaID: personaID,
                            Nombre: nombre,
                            Apellido: apellido,
                            Direccion: direccion, 
                            Telefono: telefono,
                            DNI: dni,
                            LocalidadID: localidadID,
                            UsuarioID: usuarioID // Asociamos el UsuarioID con la Persona
                        },
                    type: 'POST',
                    dataType: 'json',  
                    success: function (resultado) {
                        console.log(resultado);
                        Swal.fire({
                            position: "bottom-end",
                            icon: "success",
                            title: "Registro guardado correctamente!",
                            showConfirmButton: false,
                            timer: 1000
                        });
                        ListadoPersonas(); 
                    },
                    error: function (xhr, status, error) {
                        console.log('Disculpe, existió un problema al guardar la persona');
                    }
                });
            } else {
                console.log('Disculpe, existió un problema al guardar el usuario');
            }
        },
        error: function (xhr, status, error) {
            console.log('Disculpe, existió un problema al guardar el usuario');
        }
    });
}

function AbrirEditar(PersonaID, UsuarioID) {
    // Primer AJAX para obtener los datos de la persona
    $.ajax({
        url: '../../Personas/TraerPersona',
        data: { 
            personaID: PersonaID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (personasConId) { 
            let persona = personasConId[0];

            document.getElementById("PersonaID").value = PersonaID;
            document.getElementById("PersonaNombre").value = persona.nombre;
            document.getElementById("PersonaApellido").value = persona.apellido;
            document.getElementById("PersonaDireccion").value = persona.direccion;
            document.getElementById("PersonaTelefono").value = persona.telefono;
            document.getElementById("PersonaDni").value = persona.dni;
            document.getElementById("LocalidadID").value = persona.localidadID;

            // Segundo AJAX para obtener los datos del usuario
            $.ajax({
                url: '../../Users/EditarUsuario',
                data: { 
                    UsuarioID: UsuarioID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (usuarioporID) { 
                    let usuario = usuarioporID[0];
                    
                    document.getElementById("UsuarioID").value = UsuarioID;
                    document.getElementById("PersonaEmail").value = usuario.email;
                    document.getElementById("PersonaUserName").value = usuario.userName;
                    document.getElementById("PersonaContraseña").value = usuario.contraseña;
                    document.getElementById("RolID").value = usuario.rolID;
                
                    $("#ModalPersonas").modal("show");
                    $("#ModalTitulo").text("Editar Persona y Usuario");
                },

                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al consultar el registro del usuario.');
                }
            });
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarPersona(PersonaID, UsuarioID) {

    Swal.fire({
        title: "¿Está seguro que quiere eliminar a esta persona?",
        text: "No podrás recuperarlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Primero elimina la persona
            $.ajax({
                url: '../../Personas/EliminarPersona',
                data: { personaID: PersonaID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    // Si la persona se elimina correctamente, elimina el usuario
                    $.ajax({
                        url: '../../Users/EliminarUsuario',
                        data: { UsuarioID: UsuarioID },
                        type: 'POST',
                        dataType: 'json',
                        success: function (resultadoUsuario) {
                            Swal.fire({
                                title: "Eliminado!",
                                text: "La persona y su usuario se eliminaron correctamente",
                                icon: "success",
                                confirmButtonColor: "#3085d6"
                            });
                            ListadoPersonas();
                        },
                        error: function (xhr, status) {
                            console.log('Disculpe, existió un problema al eliminar el usuario.');
                        }
                    });
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar la persona.');
                }
            });
        }
    });
}
