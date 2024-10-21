using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;

namespace ClubSoft.Controllers;

public class ProvinciasController : Controller
{
    private  ApplicationDbContext _context;

    public ProvinciasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult ListadoProvincias(int? id)
    {
        var traerTodasLasProvincias = _context.Provincias.ToList();
        if (id != null) {
            traerTodasLasProvincias = traerTodasLasProvincias.Where(t => t.ProvinciaID == id).ToList();
        }
        return Json(traerTodasLasProvincias);
    }

public JsonResult GuardarProvincia(int ProvinciaID, string Nombre)
{
    string resultado = "";
    Nombre = Nombre.ToUpper();

    // Verificar si ya existe una provincia con el mismo nombre
    var provinciaExistente = _context.Provincias
        .Where(p => p.Nombre == Nombre && p.ProvinciaID != ProvinciaID)
        .SingleOrDefault();

    if (provinciaExistente != null)
    {
        resultado = "LA PROVINCIA YA EXISTE";
        return Json(new { success = false, message = resultado });
    }

    // Si no existe, guarda o edita la provincia
    if (ProvinciaID == 0)
    {
        var provincia = new Provincia
        {
            Nombre = Nombre
        };
        _context.Add(provincia);
        _context.SaveChanges();

        resultado = "EL REGISTRO SE GUARDÓ CORRECTAMENTE";
    }
    else
    {
        var editarProvincia = _context.Provincias.Where(e => e.ProvinciaID == ProvinciaID).SingleOrDefault();
        if (editarProvincia != null)
        {
            editarProvincia.Nombre = Nombre;
            _context.SaveChanges();

            resultado = "EL REGISTRO SE ACTUALIZÓ CORRECTAMENTE";
        }
    }

    return Json(new { success = true, message = resultado });
}


     public JsonResult TraerProvincia(int? ProvinciaID)
    {
        var provinciaPorID = _context.Provincias.ToList();
        if (ProvinciaID != null)
        {
            provinciaPorID = provinciaPorID.Where(e => e.ProvinciaID == ProvinciaID).ToList();
        }

        return Json(provinciaPorID.ToList());
    }

     public JsonResult EliminarProvincia(int ProvinciaID)
   {
    var provincia = _context.Provincias.Find(ProvinciaID);
    _context.Remove(provincia);
    _context.SaveChanges();

    return Json(true);
   }
}



