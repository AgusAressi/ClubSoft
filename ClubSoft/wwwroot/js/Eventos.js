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
                        <div class="card-header fw-bolder card-color">
                            ${evento.nombreTipoEvento}
                        </div>
                        <div class="card-body body-color">
                            <h5 class="card-title text-center">${evento.descripcion}</h5>
                            <p class="card-text"><b>Fecha:</b> ${evento.fechaEvento}</p>
                            <p class="card-text"><b>Hora:</b> ${evento.horaEvento}</p>
                            <p class="card-text"><b>Lugar:</b> ${evento.nombreLugar}</p>
                        </div>
                        <div class="card-footer text-center card-color">
                            <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${evento.eventoID})">
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
    document.getElementById("TipoEventoID").value = 0;
    document.getElementById("DescripcionEvento").value = "";
    document.getElementById("FechaEvento").value = "";
    document.getElementById("LugarID").value = 0;
    document.getElementById("errorMensajeTipoEvento").style.display = "none";
    document.getElementById("errorMensajeDescripcion").style.display = "none";
    document.getElementById("errorMensajeFecha").style.display = "none";
    document.getElementById("errorMensajeLugar").style.display = "none";
}

function NuevoEvento(){
    $("#ModalTitulo").text("Nuevo Evento");
}

function GuardarRegistro() {
    let eventoID = document.getElementById("EventoID").value;
    let tipoEvento = document.getElementById("TipoEventoID").value;
    let descripcion = document.getElementById("DescripcionEvento").value;
    let fecha = document.getElementById("FechaEvento").value; 
    let lugarID = document.getElementById("LugarID").value;
    
    let isValid = true;

    if (tipoEvento === "0") {
        document.getElementById("errorMensajeTipoEvento").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeTipoEvento").style.display = "none";
    }
    if (descripcion === "") {
        document.getElementById("errorMensajeDescripcion").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeDescripcion").style.display = "none";
    }
    if (fecha === "") {
        document.getElementById("errorMensajeFecha").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeFecha").style.display = "none";
    }
    if (lugarID === "0") {
        document.getElementById("errorMensajeLugar").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeLugar").style.display = "none";
    }

    if (!isValid) {
        return;
    }

    $.ajax({
        url: '../../Eventos/GuardarEvento',
        data: { 
            eventoID: eventoID,
            descripcion: descripcion,
            fechaEvento: fecha,
            lugarID: lugarID,
            tipoEventoID: tipoEvento
        },
        type: 'POST',
        dataType: 'json',   
        success: function (resultado) {
            console.log(resultado);
            Swal.fire({
                position: "bottom-end",
                icon: "success",
                title: "Registro guardado correctamente!",
                showConfirmButton: false,
                timer: 1000
            });
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
            document.getElementById("LugarID").value = evento.lugarID;

            $("#ModalEventos").modal("show");
            $("#ModalTitulo").text("Editar Evento");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarEvento(EventoID) {
    Swal.fire({
        title: "¿Esta seguro que quiere eliminar el evento?",
        text: "No podrás recuperarlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../../Eventos/EliminarEvento',
                data: {
                    eventoID: EventoID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El evento se elimino correctamente",
                        icon: "success",
                        confirmButtonColor: "#3085d6"
                    });
                    ListadoEventos();
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}
