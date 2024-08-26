window.onload = ListadoCuentaCorrientes();

function ListadoCuentaCorrientes() {
    $.ajax({
        url: '../../CuentaCorrientes/ListadoCuentaCorrientes',
        data: {
        },
        type: 'POST',
        dataType: 'json',
        success: function (MostrarCuentaCorrientes) {
            $("#ModalCuentaCorrientes").modal("hide");
            LimpiarModal();
            let contenidoTabla = ``;

            $.each(MostrarCuentaCorrientes, function (index, MostrarCuentaCorrientes) {
                contenidoTabla += `
                <tr>
                    <td>${MostrarCuentaCorrientes.nombrePersona}, ${MostrarCuentaCorrientes.apellidoPersona}</td>
                    <td>${MostrarCuentaCorrientes.saldo}</td>
                    <td>${MostrarCuentaCorrientes.ingreso}</td>
                    <td>${MostrarCuentaCorrientes.egreso}</td>
                    <td>${MostrarCuentaCorrientes.descripcion}</td>
                    <td>${MostrarCuentaCorrientes.fecha}</td>
                   
                    <td class="text-center">
                    <button type="button" class="btn btn-primary boton-color" onclick="AbrirEditar(${MostrarCuentaCorrientes.cuentaCorrienteID})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarCuentaCorriente(${MostrarCuentaCorrientes.cuentaCorrienteID})">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td> 
                </tr>
             `;
            });

            document.getElementById("tbody-CuentaCorrientes").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }
    });
}

function LimpiarModal() {
    document.getElementById("CuentaCorrienteID").value = 0;
    document.getElementById("PersonaID").value = "";
    document.getElementById("CuentaCorrienteSaldo").value = "";
    document.getElementById("CuentaCorrienteIngreso").value = "";
    document.getElementById("CuentaCorrienteEgreso").value = "";
    document.getElementById("CuentaCorrienteDescripcion").value = "";
    document.getElementById("CuentaCorrienteFecha").value = "";
    document.getElementById("errorMensajeSaldo").style.display = "none";
    document.getElementById("errorMensajeIngreso").style.display = "none";
    document.getElementById("errorMensajeEgreso").style.display = "none";
    document.getElementById("errorMensajeDescripcion").style.display = "none";
    document.getElementById("errorMensajeFecha").style.display = "none";
}

function NuevaCuentaCorriente() {
    $("#ModalTitulo").text("Nueva Cuenta Corriente");
}

function GuardarRegistro() {
    let cuentaCorrienteID = document.getElementById("CuentaCorrienteID").value;
    let personaID = document.getElementById("PersonaID").value;
    let saldo = document.getElementById("CuentaCorrienteSaldo").value;
    let ingreso = document.getElementById("CuentaCorrienteIngreso").value;
    let egreso = document.getElementById("CuentaCorrienteEgreso").value;
    let descripcion = document.getElementById("CuentaCorrienteDescripcion").value;
    let fecha = document.getElementById("CuentaCorrienteFecha").value;

    let isValid = true;

    if (saldo === "") {
        document.getElementById("errorMensajeSaldo").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeSaldo").style.display = "none";
    }
    if (ingreso === "") {
        document.getElementById("errorMensajeIngreso").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeIngreso").style.display = "none";
    }
    if (egreso === "") {
        document.getElementById("errorMensajeEgreso").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("errorMensajeEgreso").style.display = "none";
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

    if (!isValid) {
        return;
    }


    $.ajax({
        url: '../../CuentaCorrientes/GuardarCuentaCorriente',
        data: {
            CuentaCorrienteID: cuentaCorrienteID,
            PersonaID: personaID,
            Saldo: saldo,
            Ingreso: ingreso,
            Egreso: egreso,
            Descripcion: descripcion,
            Fecha: fecha,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            console.log(resultado);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Registro guardado correctamente!",
                showConfirmButton: false,
                timer: 1000
            });
            ListadoCuentaCorrientes();
        },
        error: function (xhr, status, error) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}

function AbrirEditar(CuentaCorrienteID) {

    $.ajax({
        url: '../../CuentaCorrientes/TraerCuentaCorriente',
        data: {
            cuentaCorrienteID: CuentaCorrienteID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (cuentaCorrientesConId) {
            let cuentaCorriente = cuentaCorrientesConId[0];


            document.getElementById("CuentaCorrienteID").value = cuentaCorriente.cuentaCorrienteID;
            document.getElementById("PersonaID").value = cuentaCorriente.personaID;
            document.getElementById("CuentaCorrienteSaldo").value = cuentaCorriente.saldo;
            document.getElementById("CuentaCorrienteIngreso").value = cuentaCorriente.ingreso;
            document.getElementById("CuentaCorrienteEgreso").value = cuentaCorriente.egreso;
            document.getElementById("CuentaCorrienteDescripcion").value = cuentaCorriente.descripcion;
            document.getElementById("CuentaCorrienteFecha").value = cuentaCorriente.fecha;


            $("#ModalCuentaCorrientes").modal("show");
            $("#ModalTitulo").text("Editar Cuenta Corriente");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarCuentaCorriente(CuentaCorrienteID) {

    Swal.fire({
        title: "¿Esta seguro que quiere eliminar la cuenta corriente?",
        text: "No podrás recuperarla!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                url: '../../CuentaCorrientes/EliminarCuentaCorriente',
                data: {
                    cuentaCorrienteID: CuentaCorrienteID,
                },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire({
                        title: "Eliminado!",
                        text: "La cuenta corriente se elimino correctamente",
                        icon: "success",
                        confirmButtonColor: "#3085d6"
                    });
                    ListadoCuentaCorrientes();
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}
