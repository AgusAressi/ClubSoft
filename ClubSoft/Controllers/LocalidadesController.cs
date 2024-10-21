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
    }public JsonResult GuardarLocalidad(int LocalidadID, string Nombre, int ProvinciaID)
{
    string resultado = "";

    // Convertir el nombre a mayúsculas
    Nombre = Nombre.ToUpper();

    // Verificar si ya existe una localidad con el mismo nombre en la misma provincia
    var localidadExistente = _context.Localidades
        .Where(l => l.Nombre == Nombre && l.ProvinciaID == ProvinciaID && l.LocalidadID != LocalidadID)
        .SingleOrDefault();

    if (localidadExistente != null)
    {
        resultado = "LA LOCALIDAD YA EXISTE EN ESTA PROVINCIA";
        return Json(new { success = false, message = resultado });
    }

    // Verificar si la localidad está siendo asociada a otra provincia
    var localidadEnOtraProvincia = _context.Localidades
        .Where(l => l.Nombre == Nombre && l.LocalidadID != LocalidadID && l.ProvinciaID != ProvinciaID)
        .SingleOrDefault();

    if (localidadEnOtraProvincia != null)
    {
        resultado = "LA LOCALIDAD NO PUEDE ASOCIARSE A MÁS DE UNA PROVINCIA";
        return Json(new { success = false, message = resultado });
    }

    // Si LocalidadID es 0, es un nuevo registro, caso contrario, es una actualización
    if (LocalidadID == 0)
    {
        var nuevaLocalidad = new Localidad
        {
            Nombre = Nombre,
            ProvinciaID = ProvinciaID
        };
        _context.Add(nuevaLocalidad);
        resultado = "EL REGISTRO SE GUARDÓ CORRECTAMENTE";
    }
    else
    {
        var localidadEditar = _context.Localidades
            .Where(l => l.LocalidadID == LocalidadID)
            .SingleOrDefault();

        if (localidadEditar != null)
        {
            localidadEditar.Nombre = Nombre;
            localidadEditar.ProvinciaID = ProvinciaID;
        }
        resultado = "EL REGISTRO SE ACTUALIZÓ CORRECTAMENTE";
    }

    _context.SaveChanges();
    return Json(new { success = true, message = resultado });
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





