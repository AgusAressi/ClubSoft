using Microsoft.AspNetCore.Mvc;
using ClubSoft.Data;
using ClubSoft.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Linq;

namespace ClubSoft.Controllers
{
    public class CobrosController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CobrosController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public JsonResult ListadoCobros()
        {
            // Obtenemos los cobros y sus respectivos clientes
            var cobrosMostrar = _context.Cobros
                .Where(c => c.EstadoCobro == EstadoCobro.Confirmado) // Ejemplo de filtro para cobros confirmados
                .Select(c => new
                {
                    CobroID = c.CobroID,
                    Cliente = c.Persona.Apellido + ", " + c.Persona.Nombre,
                    Fecha = c.Fecha, // Enviar como DateTime
                    Total = c.Total
                })
                .ToList();

            return Json(cobrosMostrar);
        }


        public IActionResult NuevoCobro()
        {
            ViewBag.PersonaID = new SelectList(_context.Personas.Select(p => new
            {
                p.PersonaID,
                NombreCompleto = p.Apellido + " " + p.Nombre
            }), "PersonaID", "NombreCompleto");

            return View();
        }

        [HttpPost]
        public JsonResult CrearCobroTemporal([FromBody] CrearCobroRequest request)
        {
            try
            {
                var ventas = _context.Ventas
                    .Where(v => v.PersonaID == request.PersonaId && v.Fecha.Date <= request.Fecha.Date && v.Estado == Estado.Confirmado)
                    .Select(v => new
                    {
                        ventaID = v.VentaID,
                        fecha = v.Fecha.ToString("dd-MM-yyyy"),
                        total = v.Total ?? 0
                    })
                    .ToList();

                if (!ventas.Any())
                {
                    return Json(new { error = "Este cliente no tiene ventas por cobrar." });
                }

                var cobro = new Cobro
                {
                    Fecha = request.Fecha,
                    PersonaID = request.PersonaId,
                    UsuarioID = request.UsuarioId,
                    EstadoCobro = EstadoCobro.Temporal,
                    Total = 0
                };

                _context.Cobros.Add(cobro);
                _context.SaveChanges();

                return Json(new
                {
                    cobroID = cobro.CobroID,
                    ventas = ventas
                });
            }
            catch (Exception ex)
            {
                return Json(new { error = "Error al crear el cobro o cargar las ventas: " + ex.Message });
            }
        }

        [HttpPost]
        public JsonResult ConfirmarCobro([FromBody] ConfirmarCobroRequest request)
        {
            try
            {
                var cobro = _context.Cobros.Find(request.CobroID);
                if (cobro == null)
                {
                    return Json(new { success = false, message = "Cobro no encontrado" });
                }

                // Solo actualizar las ventas que fueron seleccionadas
                var ventasSeleccionadas = _context.Ventas
                    .Where(v => request.VentaIDs.Contains(v.VentaID) && v.PersonaID == cobro.PersonaID && v.Estado == Estado.Confirmado)
                    .ToList();

                // Actualizar el estado de cada venta seleccionada
                ventasSeleccionadas.ForEach(v => v.Estado = Estado.Pagado);

                cobro.EstadoCobro = EstadoCobro.Confirmado;
                cobro.Total = request.Total;
                _context.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al confirmar el cobro: " + ex.Message });
            }
        }


        [HttpPost]
        public JsonResult CancelarCobroTemporal([FromBody] CancelarCobroRequest request)
        {
            try
            {
                var cobro = _context.Cobros.Find(request.CobroID);
                if (cobro != null && cobro.EstadoCobro == EstadoCobro.Temporal)
                {
                    _context.Cobros.Remove(cobro);
                    _context.SaveChanges();
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al cancelar el cobro: " + ex.Message });
            }
        }

        public class ConfirmarCobroRequest
        {
            public int CobroID { get; set; }
            public decimal Total { get; set; }
            public List<int> VentaIDs { get; set; } // Lista de VentaID seleccionadas
        }

        public class CancelarCobroRequest
        {
            public int CobroID { get; set; }
        }

        public class CrearCobroRequest
        {
            public int PersonaId { get; set; }
            public string UsuarioId { get; set; }
            public DateTime Fecha { get; set; }
        }

        [HttpPost]
        public IActionResult EliminarCobro(int cobroID)
        {
            // Buscar el cobro por su ID
            var cobro = _context.Cobros.FirstOrDefault(c => c.CobroID == cobroID);

            if (cobro == null)
            {
                return Json(new { success = false, message = "Cobro no encontrado." });
            }

            // Cambiar el estado del cobro a 'Eliminado'
            cobro.EstadoCobro = EstadoCobro.Eliminado;

            try
            {
                _context.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al eliminar el cobro: " + ex.Message });
            }
        }
    }


}
