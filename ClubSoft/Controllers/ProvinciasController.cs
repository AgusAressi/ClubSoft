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

    public JsonResult GuardarProvincia(
       int ProvinciaID,
       string Nombre
       )
    {
        string resultado = "";
        Nombre = Nombre.ToUpper();

        if (ProvinciaID == 0)
        {
            var provincia = new Provincia
            {
                ProvinciaID = ProvinciaID,
                Nombre = Nombre
            };
            _context.Add(provincia);
            _context.SaveChanges();
        }
         else
         {
             var editarProvincia = _context.Provincias.Where(e => e.ProvinciaID == ProvinciaID).SingleOrDefault();
             if (editarProvincia != null)
             {
                 editarProvincia.ProvinciaID = ProvinciaID;
                 editarProvincia.Nombre = Nombre;
                 _context.SaveChanges();
             }
         }
        return Json(resultado);
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



