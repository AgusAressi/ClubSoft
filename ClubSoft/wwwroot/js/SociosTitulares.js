window.onload = ListadoSociosTitulares();

let currentPageSociosTitulares = 1;
const itemsPerPageSociosTitulares = 9; // Número de socios por página, ajustable
let totalPagesSociosTitulares = 1;

function ListadoSociosTitulares(pagina = 1) {
    $.ajax({
        url: '../../SocioTitulares/ListadoSociosTitulares',
        type: 'POST',
        dataType: 'json',
        success: function (MostrarSocios) {
            $("#ModalSocioTitular").modal("hide");
            LimpiarModalSocioTitular();

            // Calcular el total de páginas
            totalPagesSociosTitulares = Math.ceil(MostrarSocios.length / itemsPerPageSociosTitulares);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPageSociosTitulares;
            const endIndex = startIndex + itemsPerPageSociosTitulares;
            const datosPagina = MostrarSocios.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            // Recorrer los socios de la página actual
            $.each(datosPagina, function (index, MostrarSociosTitulares) {
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

            // Generar la paginación
            generarPaginacionSociosTitulares(totalPagesSociosTitulares, pagina);

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
            alert('Disculpe, existió un problema al cargar los socios titulares');
        }
    });
}

function generarPaginacionSociosTitulares(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoSociosTitulares(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoSociosTitulares(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoSociosTitulares(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
}


function NuevoSocioTitular(){
    $("#ModalSocioTitularTitulo").text("Nuevo Socio Titular");
}

function LimpiarModalSocioTitular(){
    document.getElementById("SocioTitularID").value = 0;
    document.getElementById("PersonaID").value = 0;
    document.getElementById("errorMensajePersona").style.display = "none";
}

function GuardarSocioTitular() {
    let socioTitularID = document.getElementById("SocioTitularID").value;
    let personaID = document.getElementById("PersonaID").value;
    let errorMensajePersona = document.getElementById("errorMensajePersona");

    // Validación básica de campos
    if (personaID == "0") {
        errorMensajePersona.style.display = "block";
        return;
    } else {
        errorMensajePersona.style.display = "none";
    }

    // Realizar la petición AJAX
    $.ajax({
        url: '../../SocioTitulares/GuardarSocioTitular',
        data: {
            socioTitularID: socioTitularID,
            personaID: personaID
        },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                // Mostrar alerta de éxito
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: response.mensaje,
                    showConfirmButton: false,
                    timer: 1000
                });
                ListadoSociosTitulares();
            } else {
                // Mostrar alerta de advertencia
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

function Imprimir() {
   
    var doc = new jsPDF('l', 'mm', 'a4');

    var totalPagesExp = "{total_pages_count_string}";

    // Agregar un título al documento
    var titulo = "Socios Titulares";
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

    // Eliminar la última columna
    res.columns.splice(-1, 1);
    res.data = res.data.map(row => row.slice(0, -1));

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
            2: { fontSize: 10, overflow: 'hidden' },
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
