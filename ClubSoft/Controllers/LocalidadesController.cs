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
        return View();
    }
    public JsonResult ListadoLocalidades()
    {
        List<Vistalocalidades> LocalidadesMostar = new List<Vistalocalidades>();
        var listadoLocalidades = _context.Localidades.ToList();

        // if (Id != null)
        // {
        //     listadoLocalidades = listadoLocalidades.Where(l => l.LocalidadID == Id).ToList();
        // }
        // if (Id != 0)
        // {
        //     listadoLocalidades = listadoLocalidades.Where(l => l.ProvinciaID == Id).ToList();
        // }
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

}