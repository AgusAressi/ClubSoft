
let itemsPerPage = 10;
let totalPages = 0;
let currentPage = 1; 

let nombrePersona = '';

function ListadoCuentaCorrientes(pagina = 1) {
    let personaID = document.getElementById("PersonaID").value;
    currentPage = pagina;

    // Obtener el nombre de la persona seleccionada
    nombrePersona = $("#PersonaID option:selected").text();

    $.ajax({
        url: '../../CuentaCorrientes/ListadoCuentaCorrientes',
        data: { PersonaID: personaID },
        type: 'POST',
        dataType: 'json',
        success: function (MostrarCuentaCorrientes) {
            $("#ModalCuentaCorrientes").modal("hide");

            // Calcular total de páginas
            totalPages = Math.ceil(MostrarCuentaCorrientes.length / itemsPerPage);

            // Obtener los registros de la página actual
            const startIndex = (pagina - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const datosPagina = MostrarCuentaCorrientes.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            datosPagina.forEach((item) => {
                let saldoFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.saldo);
                let ingresoFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.ingreso);
                let egresoFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.egreso);

                // Determinar las clases para colores según las condiciones
                let saldoColor = item.saldo > 0 ? "text-danger" : item.saldo < 0 ? "text-success" : "text-dark";
                let ingresoColor = item.ingreso > 0 ? "text-danger" : "text-dark";
                let egresoColor = item.egreso > 0 ? "text-success" : "text-dark";

                contenidoTabla += `
                <tr>
                    <td>${item.nombrePersona}, ${item.apellidoPersona}</td>
                    <td>${item.fecha}</td>
                    <td>${item.descripcion}</td>
                    <td class="text-end ${ingresoColor}">${ingresoFormateado}</td>
                    <td class="text-end ${egresoColor}">${egresoFormateado}</td>
                    <td class="text-end ${saldoColor}">${saldoFormateado}</td>
                </tr>`;
            });

            document.getElementById("tbody-CuentaCorrientes").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacion(totalPages, currentPage);
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
                <a class="page-link" href="#" onclick="ListadoCuentaCorrientes(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoCuentaCorrientes(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoCuentaCorrientes(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion-CuentaCorrientes").innerHTML = paginacion;
}



function Imprimir() {
    var doc = new jsPDF('l', 'mm', 'a4');
    var totalPagesExp = "{total_pages_count_string}";

    // Título dinámico
    var titulo = "Cuenta Corriente de: " + nombrePersona;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, 14, 20);

    // Función para agregar contenido de página, incluyendo el pie de página
    var pageContent = function (data) {
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // Pie de página con el número de página y la fecha
        var str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }

        // Fecha de creación del informe
        var fechaInforme = "Fecha de Creación: " + new Date().toLocaleDateString();

        doc.setLineWidth(8);
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        // Agregar el texto del pie de página (número de página y fecha)
        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text(str, 17, pageHeight - 10);
        doc.text(fechaInforme, pageWidth - 90, pageHeight - 10); // Ajusta la posición de la fecha

    };

    var elem = document.getElementById("tabla-imprimir");
    var res = doc.autoTableHtmlToJson(elem);

    // Eliminar la columna de SOCIO
    res.columns.shift(); 
    res.data.forEach(function(row) {
        row.shift(); 
    });

    doc.autoTable(res.columns, res.data, {
        startY: 30,
        addPageContent: pageContent,
        headStyles: {
            fillColor: [12, 12, 86], 
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        bodyStyles: {
            fillColor: [255, 255, 255], 
            textColor: [0, 0, 0],
            fontSize: 10
        },
        columnStyles: {
            3: { haling : 'right' },  
            4: { textAlign: "right" },
            5: { textAlign: "right" },  
        },
        margin: { top: 10 },
    });

    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";

    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}