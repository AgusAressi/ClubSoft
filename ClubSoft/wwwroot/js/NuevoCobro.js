document.addEventListener("DOMContentLoaded", function () {
    const formSection2 = document.getElementById("form-section-2");
    const btnCobrar = document.getElementById("btnCobrar");
    const btnCancelar = document.getElementById("btnCancelar");
    const totalAcumulado = document.getElementById("totalAcumulado");

    let cobroID = 0;
    let total = 0;

    document.getElementById("PersonaID").addEventListener("change", cargarVentas);
    document.getElementById("fecha").addEventListener("change", cargarVentas);

    function cargarVentas() {
        const personaID = document.getElementById("PersonaID").value;
        const fecha = document.getElementById("fecha").value;
        const usuarioID = document.getElementById("UsuarioID").value;

        if (personaID && fecha) {
            fetch("/Cobros/CrearCobroTemporal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ PersonaId: personaID, Fecha: fecha, UsuarioId: usuarioID })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire("Aviso", data.error, "info");
                    return;
                }

                cobroID = data.cobroID;
                total = 0;
                totalAcumulado.textContent = "Total: $0.00";
                document.getElementById("Tabla-Detalle").innerHTML = data.ventas.map(venta => `
                    <tr>
                        <td><input type="checkbox" class="venta-checkbox" data-total="${venta.total}" /></td>
                        <td>${venta.ventaID}</td>
                        <td>${venta.fecha}</td>
                        <td>$${venta.total.toFixed(2)}</td>
                    </tr>
                `).join("");

                formSection2.style.display = "block";
                btnCobrar.style.display = "inline-block";
                btnCancelar.style.display = "inline-block";

                document.querySelectorAll(".venta-checkbox").forEach(checkbox => {
                    checkbox.addEventListener("change", actualizarTotal);
                });
            })
            .catch(error => alert("Error al cargar las ventas: " + error.message));
        }
    }

    function actualizarTotal() {
        total = Array.from(document.querySelectorAll(".venta-checkbox:checked"))
            .reduce((sum, checkbox) => sum + parseFloat(checkbox.getAttribute("data-total")), 0);
        totalAcumulado.textContent = `Total: $${total.toFixed(2)}`;
    }

    btnCobrar.addEventListener("click", function () {
        Swal.fire({
            title: "¿Estás seguro de cobrar?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cobrar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Obtener las IDs de las ventas seleccionadas
                const ventaIDs = Array.from(document.querySelectorAll(".venta-checkbox:checked"))
                    .map(checkbox => parseInt(checkbox.closest("tr").cells[1].textContent.trim())); // Asumiendo que la segunda celda contiene el VentaID
    
                // Realizar la petición al servidor
                fetch("/Cobros/ConfirmarCobro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ CobroID: cobroID, Total: total, VentaIDs: ventaIDs }) // Enviar la lista de VentaIDs
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire("Éxito", "Cobro realizado con éxito", "success").then(() => {
                            window.location.href = "/Cobros/Index";
                        });
                    } else {
                        alert("Error al confirmar el cobro: " + (data.message || "Error desconocido"));
                    }
                })
                .catch(error => alert("Error al confirmar el cobro: " + error.message));
            }
        });
    });

    btnCancelar.addEventListener("click", function () {
        Swal.fire({
            title: "¿Estás seguro de cancelar el cobro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("/Cobros/CancelarCobroTemporal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ CobroID: cobroID })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire("Cobro Cancelado", "El cobro ha sido cancelado correctamente.", "success").then(() => {
                            document.getElementById("PersonaID").value = "";
                            total = 0;
                            totalAcumulado.textContent = "Total: $0.00";
                            formSection2.style.display = "none";
                        });
                    } else {
                        alert("Error al cancelar el cobro: " + (data.message || "Error desconocido"));
                    }
                })
                .catch(error => alert("Error al cancelar el cobro: " + error.message));
            }
        });
    });
});

function ListadoCobros() {
    $.ajax({
        url: '/Cobros/ListadoCobros',
        type: 'GET',
        dataType: 'json',
        success: function (cobros) {
            let contenidoTabla = '';

            // Recorrer los cobros recibidos
            cobros.forEach(cobro => {
                // Formatear el total como moneda en ARS
                let totalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cobro.total);
                // Formatear la fecha
                let fechaFormateada = formatDate(cobro.fecha);

                contenidoTabla += `
                    <tr>
                        <td># ${cobro.cobroID}</td>
                        <td>${cobro.cliente}</td>
                        <td>${fechaFormateada}</td>
                        <td>${totalFormateado}</td>
                    </tr>`;
            });

            document.getElementById("tbody-Cobros").innerHTML = contenidoTabla;
        },
        error: function () {
            alert('Disculpe, existió un problema al cargar los cobros');
        }
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Agrega un cero delante si es menor de 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Formato dd/MM/yyyy
}


// Llamar a la función para cargar los cobros al cargar la página
window.onload = ListadoCobros;

