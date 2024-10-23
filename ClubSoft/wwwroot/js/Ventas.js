window.onload = ListadoVentas();

let currentPageVentas = 1;
const itemsPerPageVentas = 7;
let totalPagesVentas = 1;

function ListadoVentas(pagina = 1) {
    $.ajax({
        url: '../../Ventas/ListadoVentas',
        type: 'GET',
        dataType: 'json',
        success: function (VentasMostrar) {
            // Calcular el total de páginas
            totalPagesVentas = Math.ceil(VentasMostrar.length / itemsPerPageVentas);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPageVentas;
            const endIndex = startIndex + itemsPerPageVentas;
            const datosPagina = VentasMostrar.slice(startIndex, endIndex);

            let contenidoTabla = ``;

            // Recorrer las ventas de la página actual
            $.each(datosPagina, function (index, VentaMostrar) {
                contenidoTabla += `
                <tr>
                    <td>${VentaMostrar.ventaID}</td>
                    <td>${VentaMostrar.nombrePersona}, ${VentaMostrar.apellidoPersona}</td>
                    <td>${VentaMostrar.fecha}</td>
                    <td>${VentaMostrar.total}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary boton-color" onclick="AbrirDetalleVenta(${VentaMostrar.ventaID})">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                    </td>
                </tr>`;
            });

            document.getElementById("tbody-Ventas").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacionVentas(totalPagesVentas, pagina);

        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar las ventas');
        }
    });
}

function generarPaginacionVentas(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoVentas(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoVentas(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoVentas(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
}


function AbrirDetalleVenta(ventaID) {
    $.ajax({
        url: '../../Ventas/ObtenerDetalleVenta', 
        data: { id: ventaID },
        type: 'GET',
        dataType: 'json',
        success: function (detalleVenta) {
            let contenidoDetalle = ``;

            $.each(detalleVenta, function (index, detalle) {
                contenidoDetalle += `
                <tr>
                    <td>${detalle.nombre}</td>
                    <td>${detalle.precio}</td>
                    <td>${detalle.cantidad}</td>
                    <td>${detalle.subTotal}</td>
                </tr>`;
            });

            $('#detalleVentaTabla').html(contenidoDetalle);
            $('#detalleVentaModal').modal('show'); 
        },
        error: function (xhr, status) {
            alert('Error al cargar los detalles de la venta');
        }
    });
}
