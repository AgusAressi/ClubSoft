document.addEventListener("DOMContentLoaded", function () {
    const formSection2 = document.getElementById("form-section-2");
    const btnCobrar = document.getElementById("btnCobrar");
    const btnCancelar = document.getElementById("btnCancelar");
    const totalAcumulado = document.getElementById("totalAcumulado");
    const personaIDInput = document.getElementById("PersonaID");
    const fechaInput = document.getElementById("fecha");

    let cobroID = 0;
    let total = 0;

    personaIDInput.addEventListener("change", function() {
        if (personaIDInput.value) {
            cargarVentas();
            personaIDInput.disabled = true;
            fechaInput.disabled = true;
        }
    });

    fechaInput.addEventListener("change", cargarVentas);

    function cargarVentas() {
        const personaID = personaIDInput.value;
        const fecha = fechaInput.value;
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
                totalAcumulado.textContent = "TOTAL: $0.00";
                document.getElementById("Tabla-Detalle").innerHTML = data.ventas.map(venta => `
                    <tr>
                        <td><input type="checkbox" class="venta-checkbox" data-venta-id="${venta.ventaID}" data-total="${venta.total}" /></td>
                        <td># ${venta.ventaID}</td>
                        <td>${venta.fecha}</td>
                        <td class="text-end">$${venta.total.toFixed(2)}</td>
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
        totalAcumulado.textContent = `TOTAL: $${total.toFixed(2)}`;
    }

    btnCobrar.addEventListener("click", function () {
        Swal.fire({
            title: "¿Estás seguro de cobrar?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cobrar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const ventaIDs = Array.from(document.querySelectorAll(".venta-checkbox:checked"))
                    .map(checkbox => parseInt(checkbox.getAttribute("data-venta-id")));

                fetch("/Cobros/ConfirmarCobro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ CobroID: cobroID, Total: total, VentaIDs: ventaIDs })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            title: "Cobro confirmado",
                            text: "Pudimos registrar el cobro exitosamente.",
                            icon: "success",
                            timer: 2500,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = "/Cobros/Index";
                        });
                    } else {
                        alert("Error al confirmar el cobro: " + (data.message || "Error desconocido"));
                    }
                })
                .catch(error => alert("Error al confirmar el cobro: " + error.message));

                // Habilitar los campos después del cobro
                personaIDInput.disabled = false;
                fechaInput.disabled = false;
            }
        });
    });

    btnCancelar.addEventListener("click", function () {
        Swal.fire({
            title: "¿Estás seguro de cancelar el cobro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Confirmar"
            
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
                            personaIDInput.value = "";
                            total = 0;
                            totalAcumulado.textContent = "Total: $0.00";
                            formSection2.style.display = "none";

                            // Habilitar los campos después de cancelar
                            personaIDInput.disabled = false;
                            fechaInput.disabled = false;
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

