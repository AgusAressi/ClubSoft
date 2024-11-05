window.onload = ListadoCobros();

//VISTA LISTADO DE COBROS
let itemsPerPageCobros = 7;
let totalPagesCobros = 0;

function ListadoCobros(pagina = 1) {
    $.ajax({
        url: '/Cobros/ListadoCobros',
        type: 'GET',
        dataType: 'json',
        success: function (cobros) {
            // Calcular el total de páginas
            totalPagesCobros = Math.ceil(cobros.length / itemsPerPageCobros);

            // Obtener los datos de la página actual
            const startIndex = (pagina - 1) * itemsPerPageCobros;
            const endIndex = startIndex + itemsPerPageCobros;
            const datosPagina = cobros.slice(startIndex, endIndex);

            let contenidoTabla = '';

            // Recorrer los cobros de la página actual
            datosPagina.forEach(cobro => {
                // Formatear el total como moneda en ARS
                let totalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cobro.total);
                // Formatear la fecha
                let fechaFormateada = formatDate(cobro.fecha);

                contenidoTabla += `
                    <tr>
                        <td class="text-center"># ${cobro.cobroID}</td>
                        <td  class="text-center">${cobro.cliente}</td>
                        <td  class="text-center">${fechaFormateada}</td>
                        <td class="text-end">${totalFormateado}</td>
                        <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarCobro(${cobro.cobroID})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                    </tr>`;
            });

            document.getElementById("tbody-Cobros").innerHTML = contenidoTabla;

            // Generar la paginación
            generarPaginacionCobros(totalPagesCobros, pagina);
        },
        error: function () {
            alert('Disculpe, existió un problema al cargar los cobros');
        }
    });
}

function generarPaginacionCobros(totalPages, currentPage) {
    let paginacion = `
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoCobros(${currentPage - 1})">Anterior</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        paginacion += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="ListadoCobros(${i})">${i}</a>
            </li>`;
    }

    paginacion += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="ListadoCobros(${currentPage + 1})">Siguiente</a>
            </li>
        </ul>
    </nav>`;

    document.getElementById("paginacion").innerHTML = paginacion;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Agrega un cero delante si es menor de 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Formato dd/MM/yyyy
}

function EliminarCobro(cobroID) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esto marcará el cobro como eliminado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0c0c56",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/Cobros/EliminarCobro',
                type: 'POST',
                data: { cobroID: cobroID },
                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            title: "Cobro eliminado",
                            text: "",
                            icon: "success",
                            confirmButtonColor: "#0c0c56"
                        }).then(() => {
                            // Opcionalmente redirigir o actualizar la vista
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: response.message,
                            icon: "error",
                            confirmButtonColor: "#0c0c56"
                        });
                    }
                },
                error: function () {
                    Swal.fire("Error", "No se pudo eliminar el cobro.", "error");
                }
            });
        }
    });
}



