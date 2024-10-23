using Microsoft.AspNetCore.Mvc;
using ClubSoft.Models;
using ClubSoft.Data;
using Microsoft.EntityFrameworkCore;

namespace ClubSoft.Controllers
{
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

        public IActionResult Index()
        {
            return View();
        }
    }
}
