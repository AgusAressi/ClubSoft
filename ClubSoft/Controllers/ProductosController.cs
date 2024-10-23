using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using ClubSoft.Data;
using static ClubSoft.Models.Producto;

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
        var tipoProductos = _context.TipoProductos.ToList();

        tipoProductos.Add(new TipoProducto { TipoProductoID = 0, Nombre = "[SELECCIONE EL TIPO DE PRODUCTO...]" });
        ViewBag.TipoProductoID = new SelectList(tipoProductos.OrderBy(t => t.Nombre), "TipoProductoID", "Nombre");

        return View();
    }
     public IActionResult InformeProductos()
    {
        return View();
    }

    public JsonResult ListadoProductos(int? id)
    {
        List<VistaTipoProductos> MostrarProductos = new List<VistaTipoProductos>();
        var listadoProductos = _context.Productos.OrderBy(n => n.Nombre).ToList();
        var listadoTipoProducto = _context.TipoProductos.ToList();
        foreach (var productos in listadoProductos)
        {
            var tipoProducto = listadoTipoProducto.Where(t => t.TipoProductoID == productos.TipoProductoID).Single();

            var productoMostar = new VistaTipoProductos
            {
                ProductoID = productos.ProductoID,
                TipoProductoID = productos.TipoProductoID,
                Nombre = productos.Nombre,
                Precio = productos.Precio,
                Cantidad = productos.Cantidad,
                Descripcion = productos.Descripcion,
                Estado = productos.Estado,
                NombreTipoProducto = tipoProducto.Nombre
            };
            MostrarProductos.Add(productoMostar);
        }
        return Json(MostrarProductos);
    }

   public JsonResult GuardarRegistro(
    int ProductoID,
    string Nombre,
    decimal Precio,
    decimal Cantidad,
    string Descripcion,
    bool Estado,
    int TipoProductoID)
{
    string resultado = "";
    Nombre = Nombre.ToUpper();
    Descripcion = Descripcion.ToUpper();

    // Verificar si el producto ya existe
    var productoExistente = _context.Productos
        .Where(p => p.Nombre == Nombre && p.ProductoID != ProductoID)
        .SingleOrDefault();

    if (productoExistente != null)
    {
        return Json(new { success = false, message = "EL PRODUCTO YA EXISTE" });
    }

    // Si es una actualización, verificar si se está intentando cambiar el tipo de producto
    if (ProductoID != 0)
    {
        var productoEditar = _context.Productos
            .Where(p => p.ProductoID == ProductoID)
            .SingleOrDefault();

        if (productoEditar != null && productoEditar.TipoProductoID != TipoProductoID)
        {
            return Json(new { success = false, message = "NO SE PUEDE CAMBIAR EL TIPO DE PRODUCTO" });
        }
    }

    // Si ProductoID es 0, es un nuevo registro
    if (ProductoID == 0)
    {
        var producto = new Producto
        {
            Nombre = Nombre,
            Precio = Precio,
            Cantidad = Cantidad,
            Descripcion = Descripcion,
            Estado = Estado,
            TipoProductoID = TipoProductoID
        };
        _context.Add(producto);
        _context.SaveChanges();
        resultado = "EL REGISTRO SE GUARDÓ CORRECTAMENTE";
    }
    else // Si es una actualización
    {
        var editarProducto = _context.Productos.Where(p => p.ProductoID == ProductoID).SingleOrDefault();
        if (editarProducto != null)
        {
            editarProducto.Nombre = Nombre;
            editarProducto.Precio = Precio;
            editarProducto.Cantidad = Cantidad;
            editarProducto.Descripcion = Descripcion;
            editarProducto.Estado = Estado;
            editarProducto.TipoProductoID = TipoProductoID;
            _context.SaveChanges();
            resultado = "EL REGISTRO SE ACTUALIZÓ CORRECTAMENTE";
        }
    }

    return Json(new { success = true, message = resultado });
}

    public JsonResult TraerProducto(int? ProductoID)
    {
        var productoConId = _context.Productos.ToList();
        if (productoConId != null)
        {
            productoConId = productoConId.Where(p => p.ProductoID == ProductoID).ToList();
        }

        return Json(productoConId.ToList());
    }
    public JsonResult EliminarProducto(int ProductoID)
    {
        var producto = _context.Productos.Find(ProductoID);
        _context.Remove(producto);
        _context.SaveChanges();

        return Json(true);
    }

    public JsonResult OcultarActivarProducto(int? ProductoID, int Accion)
        {
            var producto = _context.Productos.Find(ProductoID);
            if (Accion == 1)
            {
                producto.Estado = true;
            }
            else
            {
                producto.Estado = false;
            }
            _context.SaveChanges();
            return Json(true);
        }

         public JsonResult InformeListadoProductos(int? id)
    {
        List<VistaTipoProductos> MostrarProductos = new List<VistaTipoProductos>();
        var listadoProductos = _context.Productos.OrderBy(n => n.Nombre).ToList();
        var listadoTipoProducto = _context.TipoProductos.OrderBy(t => t.Nombre).ToList();
        foreach (var productos in listadoProductos)
        {
            var tipoProducto = listadoTipoProducto.Where(t => t.TipoProductoID == productos.TipoProductoID).Single();

            var productoMostar = new VistaTipoProductos
            {
                ProductoID = productos.ProductoID,
                TipoProductoID = productos.TipoProductoID,
                Nombre = productos.Nombre,
                NombreTipoProducto = tipoProducto.Nombre
            };
            MostrarProductos.Add(productoMostar);
        }
        return Json(MostrarProductos);
    }

}