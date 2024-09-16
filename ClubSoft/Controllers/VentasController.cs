using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.Venta;
using Microsoft.EntityFrameworkCore;

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

        tipoproductos.Add(new TipoProducto { TipoProductoID = 0, Nombre = "[SELECCIONE EL TIPO DE PRODUCTO]" });
        ViewBag.TipoProductoID = new SelectList(tipoproductos.OrderBy(c => c.Nombre), "TipoProductoID", "Nombre");

        var productos = _context.Productos.ToList();

        productos.Add(new Producto { ProductoID = 0, Nombre = "[SELECCIONE UN TIPO DE PRODUCTO]" });
        ViewBag.ProductoID = new SelectList(productos.OrderBy(c => c.Nombre), "ProductoID", "Nombre");

        return View();
    }




    public JsonResult PrecioProducto(int productoID)
{
    var precio = _context.Productos
                        .Where(p => p.ProductoID == productoID)
                        .Select(p => p.Precio)
                        .FirstOrDefault();

    return Json(precio);
}

    public JsonResult ComboProducto(int TipoProductoID)
        {
            //BUSCAR PRODUCTOS
            var productos = (from o in _context.Productos where o.TipoProductoID == TipoProductoID select o).ToList();

            return Json(new SelectList(productos, "ProductoID", "Nombre"));
        }
}


