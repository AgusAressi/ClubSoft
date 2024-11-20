using Microsoft.AspNetCore.Mvc;
using ClubSoft.Data;
using ClubSoft.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace ClubSoft.Controllers

{
    [Authorize]
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
                .OrderByDescending(c => c.Fecha)
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
                        fecha = v.Fecha.ToString("dd-MM-yyyy HH:mm"),
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
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Buscar el cobro
                    var cobro = _context.Cobros.Find(request.CobroID);
                    if (cobro == null)
                    {
                        return Json(new { success = false, message = "Cobro no encontrado" });
                    }

                    // Buscar y actualizar las ventas seleccionadas
                    var ventasSeleccionadas = _context.Ventas
                        .Where(v => request.VentaIDs.Contains(v.VentaID) && v.PersonaID == cobro.PersonaID && v.Estado == Estado.Confirmado)
                        .ToList();

                    if (ventasSeleccionadas.Count == 0)
                    {
                        return Json(new { success = false, message = "No se encontraron ventas seleccionadas para actualizar." });
                    }

                    // Cambiar el estado de cada venta seleccionada a 'Pagado'
                    ventasSeleccionadas.ForEach(v => v.Estado = Estado.Pagado);

                    // Actualizar el estado y total del cobro
                    cobro.EstadoCobro = EstadoCobro.Confirmado;
                    cobro.Total = request.Total;
                    _context.SaveChanges();

                    // Registrar el cobro en CuentaCorriente
                    var cuentaCorriente = new CuentaCorriente
                    {
                        PersonaID = cobro.PersonaID,
                        Saldo = 0,
                        Ingreso = 0,
                        Egreso = request.Total,
                        Descripcion = $"Cobro #{request.CobroID}",
                        Fecha = DateTime.Now,
                        CobroID = request.CobroID
                    };

                    _context.CuentaCorrientes.Add(cuentaCorriente);
                    _context.SaveChanges();

                    // Recalcular saldos en CuentaCorriente
                    RecalcularCtaCte(cobro.PersonaID);

                    // Confirmar la transacción
                    transaction.Commit();

                    return Json(new { success = true });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return Json(new { success = false, message = "Error al confirmar el cobro: " + ex.Message });
                }
            }
        }

        public void RecalcularCtaCte(int personaID)
        {
            decimal saldo = 0;

            // Recalculo de saldos acumulados en cada registro ordenado por fecha ascendente 
            var movimientosCtaCte = _context.CuentaCorrientes
                                            .Where(cam => cam.PersonaID == personaID)
                                            .OrderBy(o => o.Fecha)
                                            .ThenBy(o => o.CuentaCorrienteID)
                                            .ToList();

            foreach (var m in movimientosCtaCte)
            {
                saldo = m.Ingreso - m.Egreso + saldo;
                m.Saldo = saldo;
            }

            _context.SaveChanges();
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
