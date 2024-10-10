////////////////////////////// <!-- SOCIOS TITULARES-->
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

function Imprimir() {
    // Cambiar la orientación de la hoja a horizontal ('l')
    var doc = new jsPDF('l', 'mm', 'a4');

    var totalPagesExp = "{total_pages_count_string}";

    // Agregar un título al documento
    var titulo = "Socios Titulares";
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

    var elem = document.getElementById("tabla-imprimirsocios");
    var res = doc.autoTableHtmlToJson(elem);

    // Eliminar las últimas dos columnas de "editar" y "eliminar"
    res.columns.splice(-1, 1); 
    res.data = res.data.map(row => row.slice(0, -1));

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

