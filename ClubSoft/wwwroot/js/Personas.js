window.onload = ListadoPersonas();

let currentPage = 1;
const itemsPerPage = 6;
let totalPages = 1;

function ListadoPersonas(pagina = 1) {
    $.ajax({
        url: '../../Personas/ListadoPersonas',
        type: 'POST',
        dataType: 'json',
        success: function (MostrarPersonas) {
            $("#ModalPersonas").modal("hide");
            LimpiarModal();
            // Calcular el total de páginas
            totalPages = Math.ceil(MostrarPersonas.length / itemsPerPage);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const datosPagina = MostrarPersonas.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            $.each(datosPagina, function (index, persona) {
                contenidoTabla += `
                <tr>
                    <td>${persona.apellido}, ${persona.nombre}</td>
                    <td>${persona.dni}</td>
                    <td>${persona.direccion}, ${persona.nombreLocalidad}, ${persona.nombreProvincia}</td>
                    <td>${persona.telefono}</td>
                    <td>${persona.email}</td>
                    <td>${persona.rolNombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${persona.personaID}, '${persona.usuarioID}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarPersona(${persona.personaID}, '${persona.usuarioID}')">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>`;
            });

            document.getElementById("tbody-Personas").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacion(totalPages, pagina);

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

function generarPaginacion(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoPersonas(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoPersonas(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoPersonas(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
}


function LimpiarModal() {
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
    document.getElementById("RolID").value = 0;
    document.getElementById("errorMensajeRol").style.display = "none";
    document.getElementById("TipoSocio").value = 0;
    document.getElementById("errorMensajeTipoSocio").style.display = "none";
    document.getElementById("SocioTitularID").value = 0;
    document.getElementById("errorMensajeSocioTitular").style.display = "none";
    document.getElementById("tipoSocioSection").style.display = "none";
}

function NuevaPersona() {
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
    let tipoSocio = document.getElementById("TipoSocio").value;
    let socioTitularID = document.getElementById("SocioTitularID").value;
    let socioAdherenteID = document.getElementById("SocioAdherenteID").value;


    console.log(personaID, nombre, apellido, direccion, telefono, dni, localidadID, usuarioID, userName, email, password, rol, tipoSocio, socioTitularID, socioAdherenteID);
    let isValid = true;

    // Validaciones de campos vacíos
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

    if (userName === "") {
        document.getElementById("errorMensajeUserName").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeUserName").style.display = "none";
    }

    if (email === "") {
        document.getElementById("errorMensajeEmail").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeEmail").style.display = "none";
    }

    if (password === "") {
        document.getElementById("errorMensajeContraseña").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeContraseña").style.display = "none";
    }

    if (rol === "0") {
        document.getElementById("errorMensajeRol").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeRol").style.display = "none";
    }

    if (tipoSocio === "0") {
        document.getElementById("errorMensajeTipoSocio").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeTipoSocio").style.display = "none";
    }

    if (tipoSocio == "2" && socioTitularID === "") {
        document.getElementById("errorMensajeSocioTitular").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeSocioTitular").style.display = "none";
    }

    // if (!isValid) {
    //     return;
    // }

     // Ajustar los datos enviados, omitiendo socioTitularID si no es necesario
     let data = {
        personaID: personaID,
        nombre: nombre,
        apellido: apellido,
        direccion: direccion,
        telefono: telefono,
        dni: dni,
        localidadID: localidadID,
        usuarioID: usuarioID,
        userName: userName,
        email: email,
        password: password,
        rol: rol,
        tipoSocio: tipoSocio,
        socioAdherenteID: socioAdherenteID
    };

    if (tipoSocio == "2") {
        data.socioTitularID = socioTitularID;
    }

    $.ajax({
        url: '../../Personas/GuardarRegistro',
        data: data,
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Registro guardado correctamente!",
                showConfirmButton: false,
                timer: 1000
            });
            ListadoPersonas();
        },
        error: function (xhr, status) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Hubo un problema al guardar el registro",
                showConfirmButton: true
            });
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}

function AbrirEditar(PersonaID) {
    $.ajax({
        url: '../../Personas/TraerPersona',
        data: {
            PersonaID: PersonaID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (personaporID) {
            let persona = personaporID;
            
            document.getElementById("PersonaID").value = persona.personaID;
            document.getElementById("PersonaNombre").value = persona.nombre;
            document.getElementById("PersonaApellido").value = persona.apellido;
            document.getElementById("PersonaDireccion").value = persona.direccion;
            document.getElementById("PersonaTelefono").value = persona.telefono;
            document.getElementById("PersonaDni").value = persona.dni;
            document.getElementById("LocalidadID").value = persona.localidadID;
            document.getElementById("UsuarioID").value = persona.usuario.id;
            document.getElementById("PersonaEmail").value = persona.usuario.email; 
            document.getElementById("PersonaUserName").value = persona.usuario.userName;
            document.getElementById("PersonaContraseña").value = persona.usuario.password; 
            $("#RolID").val(persona.usuario.rol);

            // Mostrar modal y cambiar título
            $("#ModalPersonas").modal("show");
            $("#ModalTitulo").text("Editar Persona y Usuario");
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro del usuario.');
        }
    });
}

function EliminarPersona(PersonaID) {
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
                url: '../../Personas/EliminarPersona',
                data: {
                    PersonaID: PersonaID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    if (resultado.success) {
                        // Si se eliminó correctamente, mostrar éxito
                        Swal.fire({
                            title: "Eliminado!",
                            text: "La persona se eliminó correctamente",
                            icon: "success",
                            confirmButtonColor: "#3085d6"
                        });
                        ListadoPersonas();
                    } else {
                        // Si no se puede eliminar, mostrar el mensaje con la razón
                        Swal.fire({
                            title: "No se puede eliminar!",
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

function Imprimir() {
    // Cambiar la orientación de la hoja a horizontal ('l')
    var doc = new jsPDF('l', 'mm', 'a4');

    var totalPagesExp = "{total_pages_count_string}";

    // Agregar un título al documento
    var titulo = "Personas";
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, 14, 20);


    // Función para agregar contenido de página, incluyendo el pie de página
    var pageContent = function (data) {
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // FOOTER
        var str = "Pagina " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }

        doc.setLineWidth(8);
        doc.setDrawColor(238, 238, 238);
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        doc.setFontSize(10);
        doc.setFontStyle('bold');
        doc.text(str, 17, pageHeight - 10);
    };

    var elem = document.getElementById("tabla-imprimir");
    var res = doc.autoTableHtmlToJson(elem);

    // Eliminar las últimas dos columnas de "editar" y "eliminar"
    res.columns.splice(-2, 2);
    res.data = res.data.map(row => row.slice(0, -2));

    // Configurar autoTable
    doc.autoTable(res.columns, res.data, {
        startY: 30,
        addPageContent: pageContent,
        theme: 'grid',
        headStyles: {
            fillColor: [64, 64, 64],
            textColor: [255, 0, 0],
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 'auto', fontSize: 7 },
            1: { fontSize: 7, overflow: 'hidden' },
            2: { fontSize: 7, overflow: 'hidden' },
        },
        margin: { top: 10 },
    });

    // Calcular el total de páginas antes de mostrar el PDF
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    // Mostrar el PDF en un iframe
    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}

function toggleSocioTitular() {
    var tipoSocio = document.getElementById("TipoSocio").value;
    var socioTitular = document.getElementById("SocioTitularID");

    if (tipoSocio == "2") { // ADHERENTE seleccionado
        socioTitular.disabled = false; // Habilitar la selección de Socio Titular
    } else {
        socioTitular.disabled = true; // Deshabilitar la selección de Socio Titular
        socioTitular.selectedIndex = 0; // Resetear la selección a [SELECCIONE]
    }
}

function toggleTipoSocio() {
    var rolName = document.getElementById("RolID").options[document.getElementById("RolID").selectedIndex].text;
    var tipoSocioSection = document.getElementById("tipoSocioSection");

    // Verificar si el valor seleccionado es el rol con nombre "SOCIO"
    if (rolName === "SOCIO") {
        tipoSocioSection.style.display = "block"; // Mostrar
    } else {
        tipoSocioSection.style.display = "none"; // Ocultar
    }
}


