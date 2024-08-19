using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.Venta;

namespace ClubSoft.Controllers;

public class VentasController : Controller
{
    private ApplicationDbContext _context;

    public VentasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }


    public JsonResult ListadoVentas()
    {
        List<VistaVentas> MostrarVentas = new List<VistaVentas>();

        var listadoVentas = _context.Ventas.ToList();
        var listadoPersonas = _context.Personas.ToList();
        var listadoCuentasCorrientes = _context.CuentaCorrientes.ToList();

        foreach (var ventas in listadoVentas)
        {
              var cuentaCorriente = listadoCuentasCorrientes
            .Where(cc => cc.CuentaCorrienteID == ventas.CuentaCorrienteID)
            .Single();
             var persona = listadoPersonas
            .Where(p => p.PersonaID == cuentaCorriente.PersonaID)
            .Single();

            var ventaMostar = new VistaVentas
            {
                VentaID = ventas.VentaID,
                CuentaCorrienteID = ventas.CuentaCorrienteID,
                Fecha = ventas.Fecha,
                Estado = ventas.Estado,
                Total = ventas.Total,
                NombrePersona = persona.Nombre,
                ApellidoPersona = persona.Apellido,

            };
            MostrarVentas.Add(ventaMostar);
        }
        return Json(MostrarVentas);

    }

}
