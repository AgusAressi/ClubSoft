window.onload = ListadoSociosAdherentes();

let currentPageSocios = 1;
const itemsPerPageSocios = 9; // Número de socios por página, ajustable
let totalPagesSocios = 1;

function ListadoSociosAdherentes(pagina = 1) {
    $.ajax({
        url: '../../SocioAdherentes/ListadoSociosAdherentes',
        type: 'POST',
        dataType: 'json',
        success: function (MostrarSocios) {
            $("#ModalSocioAdherente").modal("hide");
            LimpiarModalSocioAdherente();

            // Calcular el total de páginas
            totalPagesSocios = Math.ceil(MostrarSocios.length / itemsPerPageSocios);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPageSocios;
            const endIndex = startIndex + itemsPerPageSocios;
            const datosPagina = MostrarSocios.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            // Recorrer los socios de la página actual
            $.each(datosPagina, function (index, MostrarSociosAdherentes) {
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

            // Generar la paginación
            generarPaginacionSociosAdherentes(totalPagesSocios, pagina);
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los socios adherentes');
        }
    });
}

function generarPaginacionSociosAdherentes(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoSociosAdherentes(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoSociosAdherentes(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoSociosAdherentes(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
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

    // Validación básica de campos
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
            personaID: personaID
        },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: response.mensaje,
                    showConfirmButton: false,
                    timer: 1000
                });
                ListadoSociosAdherentes();
            } else {
                Swal.fire({
                    icon: "error",
                    text: response.mensaje
                });
            }
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

function Imprimir() {
    // Cambiar la orientación de la hoja a horizontal ('l')
    var doc = new jsPDF('l', 'mm', 'a4');

    var totalPagesExp = "{total_pages_count_string}";

    // Agregar un título al documento
    var titulo = "Socios Adherentes";
    doc.setFontSize(16);  
    doc.setFont("helvetica", "bold");  
    doc.text(titulo, 14, 20); 
    
    var pageContent = function (data) {
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // FOOTER
        var str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }

        doc.setLineWidth(8);
        doc.setDrawColor(238, 238, 238);
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(str, 17, pageHeight - 10);
    };

    var elem = document.getElementById("tabla-imprimirsocios");
    var res = doc.autoTableHtmlToJson(elem);

    res.data = res.data.map(row => row.slice(0, 2)); // Elimina las últimas dos columnas

    // Configurar autoTable
    doc.autoTable(res.columns, res.data, {
        startY: 30, 
        addPageContent: pageContent,
        headStyles: {
            fillColor: [64, 64, 64],  
            textColor: [255, 0, 0],   
            fontStyle: 'bold',        
        },
        columnStyles: {
            0: { cellWidth: 'auto', fontSize: 10 },
            1: { fontSize: 10, overflow: 'hidden' },
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
