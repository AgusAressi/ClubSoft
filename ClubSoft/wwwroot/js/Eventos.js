window.onload = ListadoEventos;

function ListadoEventos() {
    $.ajax({
        url: '/Eventos/ListadoEventos',
        type: 'POST',
        dataType: 'json',
        success: function (EventosMostar) {
            $("#ModalEventos").modal("hide");
            LimpiarModal();
            let contenidoCard = '';

            $.each(EventosMostar, function (index, evento) {
                contenidoCard += `
                <div class="col-md-4">
                    <div class="card mb-4" style="width: 24rem;">
                        <div class="card-header fw-bolder">
                            ${evento.nombreTipoEvento}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center">${evento.descripcion}</h5>
                            <p class="card-text"><b>Fecha y hora del evento:</b> ${evento.fechaEvento}</p>
                            <p class="card-text"><b>Lugar:</b> ${evento.lugar}</p>
                        </div>
                        <div class="card-footer text-center">
                            <button type="button" class="btn btn-success" onclick="AbrirEditar(${evento.eventoID})">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="btn btn-danger ms-4" onclick="EliminarEvento(${evento.eventoID})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>    
                `;
            });

            document.getElementById("card-Eventos").innerHTML = contenidoCard;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function LimpiarModal(){
    document.getElementById("EventoID").value = 0;
    document.getElementById("TipoEventoID").value = "";
    document.getElementById("DescripcionEvento").value = "";
    document.getElementById("FechaEvento").value = "";
    document.getElementById("Lugar").value = "";
}

function NuevoEvento(){
    $("#ModalTitulo").text("Nuevo Evento");
}

function GuardarRegistro() {
    let eventoID = document.getElementById("EventoID").value;
    let tipoEvento = document.getElementById("TipoEventoID").value;
    let descripcion = document.getElementById("DescripcionEvento").value;
    let fecha = document.getElementById("FechaEvento").value; 
    let lugar = document.getElementById("Lugar").value;
    
    $.ajax({
        url: '../../Eventos/GuardarEvento',
        data: { 
            eventoID: eventoID,
            descripcion: descripcion,
            fechaEvento: fecha,
            lugar: lugar,
            tipoEventoID: tipoEvento
        },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            console.log(resultado);
            ListadoEventos(); 
        },
        error: function (xhr, status, error) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });    
}

function AbrirEditar(EventoID){
    $.ajax({
        url: '../../Eventos/TraerEvento',
        data: { 
            eventoID: EventoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (eventosConId) { 
            let evento = eventosConId[0];

            document.getElementById("EventoID").value = EventoID;
            document.getElementById("TipoEventoID").value = evento.tipoEventoID;
            document.getElementById("DescripcionEvento").value = evento.descripcion;
            document.getElementById("FechaEvento").value = evento.fechaEvento;
            document.getElementById("Lugar").value = evento.lugar;

            $("#ModalEventos").modal("show");
            $("#ModalTitulo").text("Editar Evento");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarEvento(EventoID) {
                
    $.ajax({
        url: '../../Eventos/EliminarEvento',
        data: {
            eventoID: EventoID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoEventos();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}
