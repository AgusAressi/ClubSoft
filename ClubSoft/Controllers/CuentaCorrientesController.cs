using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.CuentaCorriente;

namespace ClubSoft.Controllers;

public class CuentaCorrientesController : Controller
{
    private ApplicationDbContext _context;

    public CuentaCorrientesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {

        return View();
    
    }

    public JsonResult ListadoCuentaCorrientes()
    {
        List<VistaCuentaCorrientes> MostrarCuentaCorrientes = new List<VistaCuentaCorrientes>();
        var listadoCuentaCorrientes = _context.CuentaCorrientes.ToList();
        var listadoPersonas = _context.Personas.ToList();

        foreach (var cuentaCorrientes in listadoCuentaCorrientes)
        {
             var cuentaCorriente = listadoCuentaCorrientes
            .Where(cc => cc.CuentaCorrienteID == cuentaCorrientes.CuentaCorrienteID)
            .Single(); 
             var persona = listadoPersonas
            .Where(p => p.PersonaID == cuentaCorrientes.PersonaID)
            .Single();
            var cuentaCorrientesMostar = new VistaCuentaCorrientes
            {
                CuentaCorrienteID = cuentaCorrientes.CuentaCorrienteID,
                PersonaID = cuentaCorrientes.PersonaID,
                Saldo = cuentaCorrientes.Saldo,
                Ingreso = cuentaCorrientes.Ingreso,
                Egreso = cuentaCorrientes.Egreso,
                Descripcion = cuentaCorrientes.Descripcion,
                Fecha = cuentaCorrientes.Fecha,
                NombrePersona = persona.Nombre, 
                ApellidoPersona = persona.Apellido 
            };
            MostrarCuentaCorrientes.Add(cuentaCorrientesMostar);
        }
        return Json(MostrarCuentaCorrientes);

    }

    public JsonResult GuardarRegistro(
     int CuentaCorrienteID,
     int PersonaID,
     decimal Saldo,
     decimal Ingreso,
     decimal Egreso,
     string? Descripcion,
     DateTime Fecha

     )
    {
        string resultado = "";
        Descripcion = Descripcion.ToUpper();
        if (CuentaCorrienteID == 0)


        {
            var cuentaCorriente = new CuentaCorriente
            {
                CuentaCorrienteID = CuentaCorrienteID,
                PersonaID = PersonaID,
                Saldo = Saldo,
                Ingreso = Ingreso,
                Egreso = Egreso,
                Descripcion = Descripcion,
                Fecha = Fecha

            };
            _context.Add(cuentaCorriente);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
        else
        {
            var editarCuentaCorriente = _context.CuentaCorrientes.Where(cc => cc.CuentaCorrienteID == CuentaCorrienteID).SingleOrDefault();
            if (editarCuentaCorriente != null)
            {
                editarCuentaCorriente.CuentaCorrienteID = CuentaCorrienteID;
                editarCuentaCorriente.PersonaID = PersonaID;
                editarCuentaCorriente.Saldo = Saldo;
                editarCuentaCorriente.Ingreso = Ingreso;
                editarCuentaCorriente.Egreso = Egreso;
                editarCuentaCorriente.Descripcion = Descripcion;
                editarCuentaCorriente.Fecha = Fecha;
                _context.SaveChanges();
            }
        }
        return Json(resultado);
    }

    public JsonResult TraerCuentaCorriente(int? CuentaCorrienteID)
    {
        var cuentaCorrientesConId = _context.CuentaCorrientes.ToList();
        if (cuentaCorrientesConId != null)
        {
            cuentaCorrientesConId = cuentaCorrientesConId.Where(p => p.CuentaCorrienteID == CuentaCorrienteID).ToList();
        }

        return Json(cuentaCorrientesConId.ToList());
    }

public JsonResult EliminarCuentaCorriente(int CuentaCorrienteID)
    {
        var cuentaCorriente = _context.CuentaCorrientes.Find(CuentaCorrienteID);
        _context.Remove(cuentaCorriente);
        _context.SaveChanges();

        return Json(true);
    }

    }