window.onload = ListadoCuentaCorrientes();

function ListadoCuentaCorrientes(){
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

function LimpiarModal(){
    document.getElementById("CuentaCorrienteID").value = 0;
    document.getElementById("PersonaID").value = 0;
    document.getElementById("CuentaCorrienteSaldo").value = "";
    document.getElementById("CuentaCorrienteIngreso").value = "";
    document.getElementById("CuentaCorrienteEgreso").value = "";
    document.getElementById("CuentaCorrienteDescripcion").value = "";
    document.getElementById("CuentaCorrienteFecha").value = "";
}

function NuevaCuentaCorriente(){
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


    $.ajax({
        url: '../../CuentaCorrientes/GuardarRegistro',
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
            
            if (cuentaCorriente) {
                document.getElementById("CuentaCorrienteID").value = cuentaCorriente.cuentaCorrienteID;
                document.getElementById("PersonaID").value = cuentaCorriente.personaID;
                document.getElementById("CuentaCorrienteSaldo").value = cuentaCorriente.saldo;
                document.getElementById("CuentaCorrienteIngreso").value = cuentaCorriente.ingreso;
                document.getElementById("CuentaCorrienteEgreso").value = cuentaCorriente.egreso;
                document.getElementById("CuentaCorrienteDescripcion").value = cuentaCorriente.descripcion;

                // Formateo de la fecha para que sea compatible con el input type="date"
                let fecha = new Date(cuentaCorriente.fecha);
                document.getElementById("CuentaCorrienteFecha").value = fecha.toISOString().substring(0, 10);

                $("#ModalCuentaCorrientes").modal("show");
            } else {
                console.log('No se encontró el registro.');
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarCuentaCorriente(CuentaCorrienteID){
                
    $.ajax({
        url: '../../CuentaCorrientes/EliminarCuentaCorriente',
        data: {
            cuentaCorrienteID: CuentaCorrienteID,
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {           
            ListadoCuentaCorrientes();
        },
     error: function (xhr, status) {
     console.log('Disculpe, existió un problema al eliminar el registro.');
    }
});
}
