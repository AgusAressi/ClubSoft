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
         var tipoproductos = _context.TipoProductos.ToList();

        tipoproductos.Add(new TipoProducto { TipoProductoID = 0, Nombre = "[SELECCIONE El Tipo De Producto...]" });
        ViewBag.TipoProductoID = new SelectList(tipoproductos.OrderBy(c => c.Nombre), "TipoProductoID", "Nombre");

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

        public JsonResult GuardarRegistro(
     int VentaID,
      int CuentaCorrienteID,
     DateTime Fecha,
     string? Estado,
     decimal Total
     

     )
    {
        string resultado = "";
        
        if (VentaID == 0)


        {
            var venta = new Venta
            {
                VentaID = VentaID,
                CuentaCorrienteID = CuentaCorrienteID,
                Fecha = Fecha,
                Estado = Estado,
                Total = Total,
                

            };
            _context.Add(venta);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
        else
        {
            var editarVenta = _context.Ventas.Where(v=> v.VentaID == VentaID).SingleOrDefault();
            if (editarVenta != null)
            {
                editarVenta.VentaID = VentaID;
                editarVenta.CuentaCorrienteID = CuentaCorrienteID;
                editarVenta.Fecha = Fecha;
                editarVenta.Estado = Estado;
                editarVenta.Total = Total;
                
                _context.SaveChanges();
            }
        }
        return Json(resultado);
    }

     public JsonResult TraerVenta(int? VentaID)
    {
        var ventasConId = _context.Ventas.ToList();
        if (ventasConId != null)
        {
            ventasConId = ventasConId.Where(v => v.VentaID == VentaID).ToList();
        }

        return Json(ventasConId.ToList());
    }

        public JsonResult EliminarVenta(int VentaID)
    {
        var venta = _context.Ventas.Find(VentaID);
        _context.Remove(venta);
        _context.SaveChanges();

        return Json(true);
    }

}