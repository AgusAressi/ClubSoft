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
}
