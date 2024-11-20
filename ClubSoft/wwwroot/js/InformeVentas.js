window.onload = InformeVentasPorCliente();

function InformeVentasPorCliente() {
    $.ajax({
        url: '../../Ventas/InformeVentasPorCliente', 
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (MostrarVentas) {
            let contenidoTabla = ``;
            let agrupadoPorCliente = {};

            // Agrupar las ventas bajo el cliente correspondiente
            $.each(MostrarVentas, function (index, Venta) {
                if (!agrupadoPorCliente[`${Venta.apellidoPersona}, ${Venta.nombrePersona}`]) {
                    agrupadoPorCliente[`${Venta.apellidoPersona}, ${Venta.nombrePersona}`] = [];
                }
                agrupadoPorCliente[`${Venta.apellidoPersona}, ${Venta.nombrePersona}`].push(Venta);
            });

            // Construir el contenido de la tabla
            for (let clienteNombre in agrupadoPorCliente) {
                contenidoTabla += `
                    <tr>
                        <td colspan="4" style="background-color: #e0e0e0;"><strong>${clienteNombre}</strong></td>
                    </tr>
                `;

                // Iterar sobre las ventas de cada cliente
                $.each(agrupadoPorCliente[clienteNombre], function (index, Venta) {
                    let totalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Venta.total);

                    contenidoTabla += `
                        <tr>
                            <td style="padding-left: 20px;"></td>
                            <td class="text-end">${Venta.fecha}</td>
                            <td class="text-end">${totalFormateado}</td>
                          
                        </tr>
                    `;
                });
            }

            document.getElementById("tbody-InformeVentas").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar los datos');
        }
    });
}

function Imprimir() {
    // Cambiar la orientación de la hoja a horizontal ('l')
    var doc = new jsPDF('l', 'mm', 'a4');

    var totalPagesExp = "{total_pages_count_string}";

    // Agregar un título al documento
    var titulo = "Listado de Ventas por Socios";
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