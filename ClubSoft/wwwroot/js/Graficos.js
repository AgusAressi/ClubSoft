// Renderizar el gráfico dentro del div especificado usando AJAX
function renderizarGrafico() {
    $.ajax({
        url: '/Graficos/PersonasPorLocalidad',
        type: 'GET',
        dataType: 'json',
        success: function (datos) {
            const localidades = datos.map(d => d.localidad);
            const cantidades = datos.map(d => Math.round(d.cantidadPersonas)); // Redondear a número entero

            // Configurar los datos y opciones del gráfico
            const config = {
                type: 'bar',
                data: {
                    labels: localidades, // Localidades (provincias)
                    datasets: [{
                        label: 'Cantidad de Personas',
                        data: cantidades, // Cantidades de personas por localidad
                        backgroundColor: 'rgb(17, 17, 147)',
                        borderColor: 'white',
                        borderWidth: 1,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0, // Forzar que los ticks sean enteros
                                callback: function(value) {
                                    return Number(value).toFixed(0); // Mostrar sin decimales
                                }
                            }
                        },
                        x: {
                            ticks: {
                                autoSkip: false, // Evitar que Chart.js omita etiquetas
                                maxRotation: 0,  // Evitar rotaciones
                                minRotation: 0   // Forzar que las etiquetas se muestren horizontalmente
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false, // Permitir que el gráfico ajuste su aspecto
                }
            };

            // Seleccionar el canvas para el gráfico
            const ctx = document.getElementById('grafico-socio').getContext('2d');
            new Chart(ctx, config);
        },
        error: function (error) {
            console.log("Error al cargar los datos: ", error);
        }
    });
}

// Cargar el gráfico cuando la página esté lista
$(document).ready(function () {
    renderizarGrafico();
});
