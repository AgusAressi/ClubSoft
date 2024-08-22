using Microsoft.AspNetCore.Mvc;
using ClubSoft.Data;
using ClubSoft.Models;

namespace ClubSoft.Controllers;

public class TipoProductosController : Controller
{
    private ApplicationDbContext _context;

    public TipoProductosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();

    }

    public JsonResult ListadoTipoProductos(int? id)
    {
        var traerTodasLosTiposProductos = _context.TipoProductos.ToList();
        if (id != null) {
            traerTodasLosTiposProductos = traerTodasLosTiposProductos.Where(t => t.TipoProductoID == id).ToList();
        }
        return Json(traerTodasLosTiposProductos);
    }

    public JsonResult GuardarTipoProducto(
       int TipoProductoID,
       string Nombre
       )
    {
        string resultado = "";
        Nombre = Nombre.ToUpper();

        if (TipoProductoID == 0)
        {
            var tipoproducto = new TipoProducto
            {
                Nombre = Nombre
            };
            _context.Add(tipoproducto);
            _context.SaveChanges();

            resultado = "EL REGISTRO SE GUARDO CORRECTAMENTE";
        }
         else
         {
             var editarTipoProducto = _context.TipoProductos.Where(e => e.TipoProductoID == TipoProductoID).SingleOrDefault();
             if (editarTipoProducto != null)
             {
                 editarTipoProducto.TipoProductoID = TipoProductoID;
                 editarTipoProducto.Nombre = Nombre;
                 _context.SaveChanges();
             }
         }
        return Json(resultado);
    }

    public JsonResult TraerTipoProducto(int? TipoProductoID)
    {
        var tipoProductoPorID = _context.TipoProductos.ToList();
        if (TipoProductoID != null)
        {
            tipoProductoPorID = tipoProductoPorID.Where(e => e.TipoProductoID == TipoProductoID).ToList();
        }

        return Json(tipoProductoPorID.ToList());
    }

    public JsonResult EliminarTipoProducto(int TipoProductoID)
   {
    var tipoProducto = _context.TipoProductos.Find(TipoProductoID);
    _context.Remove(tipoProducto);
    _context.SaveChanges();

    return Json(true);
   }
     }