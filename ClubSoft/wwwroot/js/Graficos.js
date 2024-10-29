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
                        backgroundColor: 'rgba(17, 9, 238, 0.8)',
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
                                maxRotation: 45,  // Rotación máxima para etiquetas cruzadas
                                minRotation: 45,  // Rotación mínima para etiquetas cruzadas
                                padding: 10,      // Añadir un espacio adicional entre etiquetas
                                font: {
                                    size: 10       // Ajustar el tamaño de fuente para etiquetas largas
                                }
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false, // Permitir que el gráfico ajuste su aspecto
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    onResize: function(chart, size) {
                        // Ajusta la rotación de etiquetas en función del ancho del gráfico
                        const isSmallScreen = size.width < 500;
                        chart.options.scales.x.ticks.maxRotation = isSmallScreen ? 60 : 45;
                        chart.options.scales.x.ticks.minRotation = isSmallScreen ? 60 : 45;
                    }
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


$(document).ready(function() {
    // Llamar al método ContarSocios al cargar la página
    $.ajax({
        url: '/Graficos/ContarSocios', // Cambia "TuNombreControlador" por el nombre correcto
        type: 'GET',
        success: function(data) {
            $('#totalSocios').text(data.cantidadSocios); // Actualizar el texto de la card
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener la cantidad de socios:", error);
            $('#totalSocios').text("Error");
        }
    });
});

$(document).ready(function() {
    // Llamar al método SumarTotalesVentas al cargar la página
    $.ajax({
        url: '/Graficos/SumarTotalesVentas', // Cambia "Graficos" por el nombre de tu controlador si es diferente
        type: 'GET',
        success: function(data) {
            // Actualizar el texto de la card con el total de ventas formateado con el signo de peso
            $('#totalVentas').text('$ ' + data.totalVentas.toFixed(2)); // Asegúrate de tener un ID totalVentas en tu card
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener el total de ventas:", error);
            $('#totalVentas').text("Error"); // Mostrar error en la card
        }
    });
});



function renderizarGraficoProductos() {
    $.ajax({
        url: '/Graficos/CantidadProductosVendidosPorTipo', // Asegúrate de que la URL sea correcta
        type: 'GET',
        dataType: 'json',
        success: function (datos) {
            const tiposProducto = datos.map(d => d.tipoProducto);
            const cantidadesVendidas = datos.map(d => d.cantidadVendida);

            // Configurar los datos y opciones del gráfico de torta
            const config = {
                type: 'pie',
                data: {
                    labels: tiposProducto,
                    datasets: [{
                        label: 'Cantidad de Productos Vendidos',
                        data: cantidadesVendidas,
                        backgroundColor: [
                            'rgba(28, 37, 197, 0.8)',
                            'rgba(30, 150, 37, 0.8)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            };

            // Seleccionar el canvas para el gráfico
            const ctx = document.getElementById('grafico-productos').getContext('2d');
            new Chart(ctx, config);
        },
        error: function (error) {
            console.log("Error al cargar los datos: ", error);
        }
    });
}

// Cargar el gráfico cuando la página esté lista
$(document).ready(function () {
    renderizarGraficoProductos();
});
