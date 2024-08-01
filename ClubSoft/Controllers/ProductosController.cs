using Microsoft.AspNetCore.Mvc;
using ClubSoft.Data;

namespace ClubSoft.Controllers;

public class ProductosController : Controller
{
    private ApplicationDbContext _context;

    public ProductosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
         return View();
        }
           public JsonResult ListadoProductos(int? id)
    {
        var traerLosProductos = _context.Productos.ToList();
        if (id != null) {
            traerLosProductos = traerLosProductos.Where(p => p.ProductoID == id).ToList();
        }
        return Json(traerLosProductos);
    }
         }