using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.Localidad;
using Microsoft.EntityFrameworkCore;

namespace ClubSoft.Controllers;
[Authorize (Roles = "ADMINISTRADOR")]
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
        resultado = "Localidad existente";
        return Json(new { success = false, message = resultado });
    }

    // Verificar si la localidad está siendo asociada a otra provincia
    var localidadEnOtraProvincia = _context.Localidades
        .Where(l => l.Nombre == Nombre && l.LocalidadID != LocalidadID && l.ProvinciaID != ProvinciaID)
        .SingleOrDefault();

    if (localidadEnOtraProvincia != null)
    {
        resultado = "Esa localidad no puede asociarse a más de una provincia";
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
        resultado = "¡Localidad registrada correctamente!";
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
        resultado = "Localidad actualizada correctamente";
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
        // Verificar si existen personas asociadas a la provincia
        var personasAsociadas = _context.Personas
            .Any(p => p.LocalidadID == LocalidadID);

        if (personasAsociadas)
        {
            // Retornar un mensaje de error si hay personas asociadas
            return Json(new { success = false, message = "No se puede eliminar la localidad porque hay personas asociadas." });
        }

        // Si no hay personas asociadas, proceder con la eliminación de la provincia
        var localidad = _context.Localidades.Find(LocalidadID);
        if (localidad != null)
        {
            _context.Remove(localidad);
            _context.SaveChanges();
            return Json(new { success = true, message = "La localidad fue eliminada correctamente." });
        }

        return Json(new { success = false, message = "Localidad no encontrada." });
    }
}





