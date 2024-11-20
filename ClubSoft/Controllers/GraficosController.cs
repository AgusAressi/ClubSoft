using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using ClubSoft.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace ClubSoft.Controllers
{
    [Authorize (Roles = "ADMINISTRADOR")]
    public class GraficosController : Controller
    {
        private readonly ApplicationDbContext _context;

        public GraficosController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> PersonasPorLocalidad()
        {
            // Agrupar personas por localidad y contar cuántas hay en cada una
            var datos = await _context.Personas
                .Include(p => p.Localidad)
                .GroupBy(p => p.Localidad.Nombre)
                .Select(g => new {
                    Localidad = g.Key,
                    CantidadPersonas = g.Count()
                }).ToListAsync();

            return Json(datos);
        }

        public IActionResult ContarSocios()
        {
            // Obtener el rol con Name = "SOCIO"
            var rolSocio = _context.Roles.SingleOrDefault(r => r.Name == "SOCIO");
            
            if (rolSocio == null)
            {
                return NotFound("Rol 'SOCIO' no encontrado.");
            }

            // Contar los usuarios con el rol 'SOCIO'
            var countSocios = _context.UserRoles
                .Where(ur => ur.RoleId == rolSocio.Id)
                .Count();

            // Devolver el resultado
            return Json(new { cantidadSocios = countSocios });
        }

        public IActionResult SumarTotalesVentas()
        {
            // Sumar todos los totales del campo Total en la tabla Ventas
            var totalVentas = _context.Ventas
                .Where(v => v.Total.HasValue) // Asegurarse de que Total no sea nulo
                .Sum(v => v.Total.Value); // Sumar los totales

            // Devolver el resultado
            return Json(new { totalVentas = totalVentas });
        }

       public async Task<IActionResult> CantidadProductosVendidosPorTipo()
{
    var productosPorTipo = await _context.DetalleVentas
        .Include(dv => dv.Producto) // Asegurarse de incluir el producto
        .Include(dv => dv.Producto.TipoProducto) // Incluir el tipo de producto
        .GroupBy(dv => dv.Producto.TipoProducto.Nombre)
        .Select(g => new {
            TipoProducto = g.Key,
            CantidadVendida = g.Sum(dv => dv.Cantidad) // Sumar la cantidad de productos vendidos
        })
        .ToListAsync();

    return Json(productosPorTipo);
}


        public IActionResult Index()
        {
            return View();
        }
    }
}
