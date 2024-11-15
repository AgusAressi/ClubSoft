window.onload = InformeListadoProductos;

function InformeListadoProductos() {

    $.ajax({
        url: '../../Productos/InformeListadoProductos',
        data: {

        },
        type: 'POST',
        dataType: 'json',
        success: function (MostrarProductos) {
            let contenidoTabla = ``;
            let agrupadoPorTipo = {};

            $.each(MostrarProductos, function (index, InformeProductos) {
                if (!agrupadoPorTipo[InformeProductos.nombreTipoProducto]) {
                    agrupadoPorTipo[InformeProductos.nombreTipoProducto] = [];
                }
                agrupadoPorTipo[InformeProductos.nombreTipoProducto].push(InformeProductos);
            });

            for (let nombreTipoProducto in agrupadoPorTipo) {

                contenidoTabla += `
                    <tr>
                     <td colspan="3" style="background-color: #e0e0e0;"><strong>${nombreTipoProducto}</strong></td>

                    </tr>
                `;

                $.each(agrupadoPorTipo[nombreTipoProducto], function (index, InformeProductos) {
                    contenidoTabla += `
                        <tr>
                        <td></td>
                            <td>${InformeProductos.nombre}</td>
                            
                            
                        </tr>
                    `;
                });
            }

            document.getElementById("tbody-InformeProductos").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function Imprimir() {
    // Cambiar la orientación de la hoja a horizontal ('l')
    var doc = new jsPDF('l', 'mm', 'a4');

    var totalPagesExp = "{total_pages_count_string}";

    // Agregar un título al documento
    var titulo = "Listado de Productos por Tipo de Productos";
    doc.setFontSize(16);  
    doc.setFont("helvetica", "bold");  
    doc.text(titulo, 14, 20); 
    
    // Función para agregar el pie de página
    var pageContent = function (data) {
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // FOOTER
        var str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }

        // Fecha de creación del informe
        var fechaInforme = "Fecha de Creación: " + new Date().toLocaleDateString();

        doc.setLineWidth(8);
        doc.setDrawColor(238, 238, 238);
        doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        // Número de página
        doc.text(str, 17, pageHeight - 10);
        
        // Fecha de creación del informe
        doc.text(fechaInforme, pageWidth - 90, pageHeight - 10); // Ajusta la posición de la fecha
    };

    var elem = document.getElementById("tabla-imprimir");
    var res = doc.autoTableHtmlToJson(elem);

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
            0: { cellWidth: 'auto', fontSize: 10, fontStyle: 'bold' },
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