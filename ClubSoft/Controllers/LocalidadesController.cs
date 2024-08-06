using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.Localidad;

namespace ClubSoft.Controllers;

public class LocalidadesController : Controller
{
    private ApplicationDbContext _context;

    public LocalidadesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {

        var provincias = _context.Provincias.ToList();
        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE LA PROVINCIA]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(c => c.Nombre), "ProvinciaID", "Nombre");

        return View();

    }
    public JsonResult ListadoLocalidades()
    {
        List<Vistalocalidades> LocalidadesMostar = new List<Vistalocalidades>();
        var listadoLocalidades = _context.Localidades.ToList();

        var listadoProvincias = _context.Provincias.ToList();
         foreach (var localidad in listadoLocalidades)
        {
            var provincia = listadoProvincias.Where(t => t.ProvinciaID == localidad.ProvinciaID).Single();
            
            var localidadMostar = new Vistalocalidades
            {
                LocalidadID = localidad.LocalidadID,
                Nombre = localidad.Nombre, 
                ProvinciaID = localidad.ProvinciaID,
                NombreProvincia = provincia.Nombre
              
            };
            LocalidadesMostar.Add(localidadMostar);
        }
        return Json(LocalidadesMostar);
    }
    public JsonResult GuardarLocalidad(
       int LocalidadID,
       string? Nombre,
       int ProvinciaID
       
       )
    {
        string resultado = "";
        Nombre = Nombre.ToUpper();
        if (LocalidadID == 0)
        {
            var localidad = new Localidad
            {
                LocalidadID = LocalidadID,
                Nombre = Nombre,
                ProvinciaID = ProvinciaID
            };
            _context.Add(localidad);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
         else
         {
             var editarLocalidad = _context.Localidades.Where(e => e.LocalidadID == LocalidadID).SingleOrDefault();
             if (editarLocalidad != null)
             {
                 editarLocalidad.LocalidadID = LocalidadID;
                 editarLocalidad.Nombre = Nombre;
                 editarLocalidad.ProvinciaID = ProvinciaID;
                 _context.SaveChanges();
             }
         }
        return Json(resultado);
    }

     public JsonResult TraerLocalidad(int? LocalidadID)
    {
        var localidadporID = _context.Localidades.ToList();
        if (LocalidadID != null)
        {
            localidadporID = localidadporID.Where(e => e.LocalidadID == LocalidadID).ToList();
        }

        return Json(localidadporID.ToList());
    }

     public JsonResult EliminarLocalidad(int LocalidadID)
   {
    var localidad = _context.Localidades.Find(LocalidadID);
    _context.Remove(localidad);
    _context.SaveChanges();

    return Json(true);
   }
}





